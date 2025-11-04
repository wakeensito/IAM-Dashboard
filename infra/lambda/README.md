# Lambda Function for IAM Dashboard Scanner

## 🎯 What This Does

Creates an AWS Lambda function that aggregates security findings from AWS native scanners and evaluates resources against OPA policies. The function stores results in DynamoDB and S3.

## 🔧 Lambda Configuration

- **Function Name**: `iam-dashboard-scanner`
- **IAM Role**: `iam-dashboard-lambda-role`
- **Runtime**: Python 3.13 (arm64 architecture)
- **Timeout**: 300 seconds (5 minutes)
- **Memory**: 512 MB

## 📁 Files Created

- `infra/lambda/main.tf` - Lambda function and IAM role configuration
- `infra/lambda/variables.tf` - Input variables
- `infra/lambda/outputs.tf` - Output values
- `infra/lambda/lambda-role-policy.json` - IAM permissions for Lambda
- `infra/lambda/README.md` - This file

## 🔐 IAM Permissions

The Lambda role (`iam-dashboard-lambda-role`) has permissions for:

- **CloudWatch Logs**: Create log groups/streams, write logs
- **S3**: PutObject, GetObject, ListBucket on `iam-dashboard-project` and `iam-dashboard-scan-results-*`
- **DynamoDB**: PutItem, GetItem, UpdateItem, Query, Scan on `iam-dashboard-*` tables
- **AWS Security Services**: (Will be added when implementing scanner integrations)
  - Security Hub: GetFindings, BatchImportFindings
  - GuardDuty: ListDetectors, GetFindings
  - Config: DescribeConfigRules, GetComplianceSummaryByConfigRule
  - Inspector: ListFindings, DescribeFindings
  - Macie: ListFindings, GetFindings

## 🚀 How to Deploy

### Option 1: Deploy with Placeholder Code (No Code Yet)

```bash
cd infra/lambda
terraform init
terraform plan
terraform apply
```

This creates the Lambda function with placeholder Python code.

### Option 2: Deploy with Actual Code

1. Create your Lambda deployment package:
   ```bash
   cd infra/lambda
   zip -r function.zip lambda_function.py opa-policies/ requirements.txt
   ```

2. Set the zip file path:
   ```bash
   terraform apply -var="lambda_zip_file=./function.zip"
   ```

   Or update `variables.tf`:
   ```hcl
   variable "lambda_zip_file" {
     default = "./function.zip"
   }
   ```

## 📝 Environment Variables

The Lambda function automatically receives these environment variables:

- `DYNAMODB_TABLE_NAME`: Name of DynamoDB table (from variable)
- `S3_BUCKET_NAME`: Name of S3 bucket (from variable)
- `PROJECT_NAME`: Project name for tagging
- `ENVIRONMENT`: Environment name (dev, staging, prod)

Additional variables can be added via `lambda_environment_variables` map.

## 🔄 Lambda Handler Structure

The placeholder handler expects:
- **File**: `lambda_function.py`
- **Function**: `lambda_handler(event, context)`
- **Event**: API Gateway event or direct invocation

Example structure:
```python
def lambda_handler(event, context):
    """
    Main Lambda handler for security scanning
    
    Expected event structure:
    {
        "scanner_type": "security-hub|guardduty|config|inspector|macie|iam-opa|ec2-opa|s3-opa",
        "scan_parameters": {...}
    }
    """
    # Implementation will scan AWS resources and store results
    return {
        'statusCode': 200,
        'body': 'Scan completed'
    }
```

## 🏷️ Tags

The Lambda function is tagged with:
- `Project = IAMDash`
- `Env = dev` (or from variable)
- `ManagedBy = terraform`
- `Service = scanner`

## 📊 Monitoring

- **CloudWatch Logs**: Automatic logging to `/aws/lambda/iam-dashboard-scanner`
- **CloudWatch Metrics**: Automatic metrics for invocations, errors, duration, throttles
- **X-Ray Tracing**: Can be enabled for distributed tracing

## 🔗 Integration

After deployment, the Lambda function can be integrated with:
- **API Gateway**: For REST API endpoints
- **EventBridge**: For scheduled scans
- **S3 Event Notifications**: For triggering scans on S3 events
- **CloudWatch Events**: For cron-based scheduling
