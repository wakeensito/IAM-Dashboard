"""
AWS Lambda function for IAM Dashboard security scanning
Handles security scans from various AWS services and stores results
"""

import json
import os
import logging
import boto3
from datetime import datetime
from typing import Dict, Any, Optional
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
securityhub = boto3.client('securityhub')
guardduty = boto3.client('guardduty')
config = boto3.client('config')
inspector = boto3.client('inspector2')
macie = boto3.client('macie2')
iam = boto3.client('iam')
ec2 = boto3.client('ec2')

# Environment variables
DYNAMODB_TABLE_NAME = os.environ.get('DYNAMODB_TABLE_NAME', 'iam-dashboard-scan-results')
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'iam-dashboard-project')
PROJECT_NAME = os.environ.get('PROJECT_NAME', 'IAMDash')
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'dev')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for security scanning
    
    Expected event structure (API Gateway):
    {
        "httpMethod": "POST",
        "path": "/scan/{scanner_type}",
        "pathParameters": {
            "scanner_type": "security-hub|guardduty|config|inspector|macie|iam|ec2|s3|full"
        },
        "body": "{\"region\": \"us-east-1\", ...}"
    }
    
    Or direct invocation:
    {
        "scanner_type": "security-hub",
        "region": "us-east-1",
        "scan_parameters": {...}
    }
    """
    try:
        logger.info(f"Received event: {json.dumps(event)}")
        
        # Parse event (API Gateway or direct invocation)
        if 'httpMethod' in event or 'requestContext' in event:
            # API Gateway event (v1 REST or v2 HTTP)
            # Extract scanner type from path
            path = event.get('path') or event.get('requestContext', {}).get('http', {}).get('path', '')
            if path:
                # Extract scanner type from path like "/scan/security-hub" or "/v1/scan/security-hub"
                path_parts = [p for p in path.strip('/').split('/') if p]
                # Find the index of 'scan' and get the next part
                if 'scan' in path_parts:
                    scan_idx = path_parts.index('scan')
                    scanner_type = path_parts[scan_idx + 1] if scan_idx + 1 < len(path_parts) else ''
                else:
                    # Fallback: get last part of path
                    scanner_type = path_parts[-1] if path_parts else ''
            else:
                # Fallback to pathParameters if available (REST API)
                scanner_type = event.get('pathParameters', {}).get('scanner_type', '')
            
            body = json.loads(event.get('body', '{}')) if event.get('body') else {}
            region = body.get('region', 'us-east-1')
            scan_params = body
        else:
            # Direct invocation
            scanner_type = event.get('scanner_type', '')
            region = event.get('region', 'us-east-1')
            scan_params = event.get('scan_parameters', {})
        
        # Validate scanner type
        valid_scanners = ['security-hub', 'guardduty', 'config', 'inspector', 'macie', 'iam', 'ec2', 's3', 'full']
        if scanner_type not in valid_scanners:
            return create_response(400, {
                'error': f'Invalid scanner type. Must be one of: {", ".join(valid_scanners)}'
            })
        
        # Execute scan
        scan_id = f"{scanner_type}-{datetime.utcnow().isoformat()}"
        logger.info(f"Starting scan: {scan_id} for type: {scanner_type}")
        
        try:
            scan_result = execute_scan(scanner_type, region, scan_params, scan_id)
        except Exception as scan_error:
            logger.error(f"Error executing scan: {str(scan_error)}", exc_info=True)
            return create_response(500, {
                'error': 'Scan execution failed',
                'message': str(scan_error),
                'scan_id': scan_id,
                'scanner_type': scanner_type
            })
        
        # Store results (non-blocking - don't fail if storage fails)
        try:
            store_results(scan_id, scanner_type, region, scan_result)
        except Exception as storage_error:
            logger.warning(f"Error storing results (non-fatal): {str(storage_error)}")
        
        # Return response
        return create_response(200, {
            'scan_id': scan_id,
            'scanner_type': scanner_type,
            'region': region,
            'status': 'completed',
            'results': scan_result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in lambda_handler: {str(e)}", exc_info=True)
        return create_response(500, {
            'error': 'Internal server error',
            'message': str(e)
        })


def execute_scan(scanner_type: str, region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Execute the appropriate security scan based on scanner type"""
    
    scanner_handlers = {
        'security-hub': scan_security_hub,
        'guardduty': scan_guardduty,
        'config': scan_config,
        'inspector': scan_inspector,
        'macie': scan_macie,
        'iam': scan_iam,
        'ec2': scan_ec2,
        's3': scan_s3,
        'full': scan_full
    }
    
    handler = scanner_handlers.get(scanner_type)
    if handler:
        return handler(region, scan_params, scan_id)
    else:
        raise ValueError(f"Unknown scanner type: {scanner_type}")


def scan_security_hub(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan AWS Security Hub for findings"""
    try:
        logger.info(f"Scanning Security Hub in region: {region}")
        
        findings = []
        severity_filter = scan_params.get('severity', {})
        
        # Get findings
        paginator = securityhub.get_paginator('get_findings')
        page_iterator = paginator.paginate(
            Filters={
                'SeverityLabel': severity_filter if severity_filter else [
                    {'Value': 'CRITICAL', 'Comparison': 'EQUALS'},
                    {'Value': 'HIGH', 'Comparison': 'EQUALS'},
                    {'Value': 'MEDIUM', 'Comparison': 'EQUALS'}
                ]
            },
            MaxResults=100
        )
        
        for page in page_iterator:
            findings.extend(page.get('Findings', []))
        
        # Get summary
        summary = {
            'total_findings': len(findings),
            'critical': len([f for f in findings if f.get('Severity', {}).get('Label') == 'CRITICAL']),
            'high': len([f for f in findings if f.get('Severity', {}).get('Label') == 'HIGH']),
            'medium': len([f for f in findings if f.get('Severity', {}).get('Label') == 'MEDIUM']),
            'low': len([f for f in findings if f.get('Severity', {}).get('Label') == 'LOW'])
        }
        
        return {
            'findings': findings[:100],  # Limit to first 100
            'summary': summary,
            'scan_type': 'security-hub'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning Security Hub: {str(e)}")
        if e.response['Error']['Code'] == 'InvalidAccessException':
            return {
                'error': 'Security Hub is not enabled in this region',
                'scan_type': 'security-hub'
            }
        raise


def scan_guardduty(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan AWS GuardDuty for threats"""
    try:
        logger.info(f"Scanning GuardDuty in region: {region}")
        
        # List detectors
        detectors = guardduty.list_detectors()
        detector_ids = detectors.get('DetectorIds', [])
        
        if not detector_ids:
            return {
                'error': 'No GuardDuty detectors found in this region',
                'scan_type': 'guardduty'
            }
        
        findings = []
        for detector_id in detector_ids:
            # Get findings
            paginator = guardduty.get_paginator('list_findings')
            page_iterator = paginator.paginate(
                DetectorId=detector_id,
                FindingCriteria={
                    'Criterion': {
                        'severity': {
                            'Gte': scan_params.get('min_severity', 4.0)
                        }
                    }
                }
            )
            
            for page in page_iterator:
                finding_ids = page.get('FindingIds', [])
                if finding_ids:
                    findings_response = guardduty.get_findings(
                        DetectorId=detector_id,
                        FindingIds=finding_ids
                    )
                    findings.extend(findings_response.get('Findings', []))
        
        return {
            'findings': findings[:100],
            'total_findings': len(findings),
            'detectors': len(detector_ids),
            'scan_type': 'guardduty'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning GuardDuty: {str(e)}")
        raise


def scan_config(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan AWS Config for compliance"""
    try:
        logger.info(f"Scanning AWS Config in region: {region}")
        
        # Get compliance summary
        compliance_summary = config.get_compliance_summary_by_config_rule()
        
        # Get config rules
        rules = config.describe_config_rules()
        
        return {
            'compliance_summary': compliance_summary,
            'config_rules': rules.get('ConfigRules', [])[:50],
            'total_rules': len(rules.get('ConfigRules', [])),
            'scan_type': 'config'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning Config: {str(e)}")
        raise


def scan_inspector(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan AWS Inspector for vulnerabilities"""
    try:
        logger.info(f"Scanning AWS Inspector in region: {region}")
        
        # List findings
        findings = []
        paginator = inspector.get_paginator('list_findings')
        page_iterator = paginator.paginate(
            filterCriteria={
                'severity': {
                    'comparison': 'EQUALS',
                    'value': scan_params.get('severity', 'HIGH')
                }
            }
        )
        
        for page in page_iterator:
            finding_arns = page.get('findingArns', [])
            if finding_arns:
                findings_response = inspector.batch_get_findings(
                    findingArns=finding_arns[:100]
                )
                findings.extend(findings_response.get('findings', []))
        
        return {
            'findings': findings[:100],
            'total_findings': len(findings),
            'scan_type': 'inspector'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning Inspector: {str(e)}")
        raise


def scan_macie(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan AWS Macie for data security"""
    try:
        logger.info(f"Scanning AWS Macie in region: {region}")
        
        # List findings
        findings = []
        paginator = macie.get_paginator('list_findings')
        page_iterator = paginator.paginate(
            findingCriteria={
                'criterion': {
                    'severity.description': {
                        'eq': [scan_params.get('severity', 'High')]
                    }
                }
            }
        )
        
        for page in page_iterator:
            finding_ids = page.get('findingIds', [])
            if finding_ids:
                findings_response = macie.get_findings(findingIds=finding_ids[:100])
                findings.extend(findings_response.get('findings', []))
        
        return {
            'findings': findings[:100],
            'total_findings': len(findings),
            'scan_type': 'macie'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning Macie: {str(e)}")
        raise


def scan_iam(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan IAM for security issues"""
    try:
        logger.info(f"Scanning IAM in region: {region}")
        
        # List users
        users = iam.list_users()
        user_list = users.get('Users', [])
        
        # Analyze users
        users_with_mfa = 0
        users_without_mfa = 0
        inactive_users = 0
        
        for user in user_list:
            # Check MFA
            mfa_devices = iam.list_mfa_devices(UserName=user['UserName'])
            if mfa_devices.get('MFADevices'):
                users_with_mfa += 1
            else:
                users_without_mfa += 1
            
            # Check last login
            access_keys = iam.list_access_keys(UserName=user['UserName'])
            if not access_keys.get('AccessKeyMetadata'):
                # Check password last used
                if user.get('PasswordLastUsed'):
                    from datetime import datetime, timezone
                    last_used = user['PasswordLastUsed'].replace(tzinfo=timezone.utc)
                    if (datetime.now(timezone.utc) - last_used).days > 90:
                        inactive_users += 1
        
        # List roles
        roles = iam.list_roles()
        role_list = roles.get('Roles', [])
        
        return {
            'users': {
                'total': len(user_list),
                'with_mfa': users_with_mfa,
                'without_mfa': users_without_mfa,
                'inactive': inactive_users
            },
            'roles': {
                'total': len(role_list)
            },
            'scan_type': 'iam'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning IAM: {str(e)}")
        raise


def scan_ec2(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan EC2 instances for security issues"""
    try:
        logger.info(f"Scanning EC2 in region: {region}")
        
        # Describe instances
        response = ec2.describe_instances()
        instances = []
        
        for reservation in response.get('Reservations', []):
            instances.extend(reservation.get('Instances', []))
        
        # Analyze instances
        public_instances = 0
        instances_without_imdsv2 = 0
        
        for instance in instances:
            # Check for public IP
            if instance.get('PublicIpAddress'):
                public_instances += 1
            
            # Check IMDSv2 (simplified - would need more detailed check)
            metadata_options = instance.get('MetadataOptions', {})
            if metadata_options.get('HttpTokens') != 'required':
                instances_without_imdsv2 += 1
        
        return {
            'instances': {
                'total': len(instances),
                'public': public_instances,
                'without_imdsv2': instances_without_imdsv2
            },
            'scan_type': 'ec2'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning EC2: {str(e)}")
        raise


def scan_s3(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Scan S3 buckets for security issues"""
    try:
        logger.info(f"Scanning S3 in region: {region}")
        
        # List buckets
        buckets = s3_client.list_buckets()
        bucket_list = buckets.get('Buckets', [])
        
        # Analyze buckets
        public_buckets = 0
        unencrypted_buckets = 0
        
        for bucket in bucket_list:
            bucket_name = bucket['Name']
            
            try:
                # Check public access
                public_access = s3_client.get_public_access_block(Bucket=bucket_name)
                if not public_access.get('PublicAccessBlockConfiguration', {}).get('BlockPublicAcls'):
                    public_buckets += 1
                
                # Check encryption
                try:
                    encryption = s3_client.get_bucket_encryption(Bucket=bucket_name)
                except ClientError:
                    unencrypted_buckets += 1
                    
            except ClientError:
                # Skip if we can't access bucket
                continue
        
        return {
            'buckets': {
                'total': len(bucket_list),
                'public': public_buckets,
                'unencrypted': unencrypted_buckets
            },
            'scan_type': 's3'
        }
        
    except ClientError as e:
        logger.error(f"Error scanning S3: {str(e)}")
        raise


def scan_full(region: str, scan_params: Dict[str, Any], scan_id: str) -> Dict[str, Any]:
    """Execute full security scan across all services"""
    logger.info(f"Executing full security scan in region: {region}")
    
    results = {
        'security_hub': scan_security_hub(region, scan_params, scan_id),
        'guardduty': scan_guardduty(region, scan_params, scan_id),
        'config': scan_config(region, scan_params, scan_id),
        'iam': scan_iam(region, scan_params, scan_id),
        'ec2': scan_ec2(region, scan_params, scan_id),
        's3': scan_s3(region, scan_params, scan_id),
        'scan_type': 'full'
    }
    
    return results


def store_results(scan_id: str, scanner_type: str, region: str, scan_result: Dict[str, Any]) -> None:
    """Store scan results in DynamoDB and S3"""
    try:
        timestamp = datetime.utcnow().isoformat()
        
        # Store in DynamoDB
        try:
            table = dynamodb.Table(DYNAMODB_TABLE_NAME)
            table.put_item(
                Item={
                    'scan_id': scan_id,
                    'scanner_type': scanner_type,
                    'region': region,
                    'timestamp': timestamp,
                    'results': scan_result,
                    'project': PROJECT_NAME,
                    'environment': ENVIRONMENT
                }
            )
            logger.info(f"Stored results in DynamoDB: {scan_id}")
        except ClientError as e:
            logger.warning(f"Could not store in DynamoDB: {str(e)}")
        
        # Store in S3
        try:
            s3_key = f"scan-results/{ENVIRONMENT}/{scanner_type}/{scan_id}.json"
            s3_client.put_object(
                Bucket=S3_BUCKET_NAME,
                Key=s3_key,
                Body=json.dumps({
                    'scan_id': scan_id,
                    'scanner_type': scanner_type,
                    'region': region,
                    'timestamp': timestamp,
                    'results': scan_result
                }, indent=2),
                ContentType='application/json'
            )
            logger.info(f"Stored results in S3: {s3_key}")
        except ClientError as e:
            logger.warning(f"Could not store in S3: {str(e)}")
            
    except Exception as e:
        logger.error(f"Error storing results: {str(e)}")


def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """Create API Gateway compatible response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps(body)
    }

