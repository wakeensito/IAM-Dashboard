"""
CloudWatch Service for monitoring and metrics
"""

import boto3
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from botocore.exceptions import ClientError, NoCredentialsError

logger = logging.getLogger(__name__)

class CloudWatchService:
    """Service for CloudWatch metrics and monitoring"""
    
    def __init__(self, namespace: str = 'IAMDash/dev', region: str = 'us-east-1'):
        self.namespace = namespace
        self.region = region
        try:
            self.client = boto3.client('cloudwatch', region_name=region)
        except NoCredentialsError:
            logger.warning("AWS credentials not found for CloudWatch")
            self.client = None
    
    def put_metric(self, metric_name: str, value: float, unit: str = 'Count', 
                   dimensions: Optional[Dict[str, str]] = None) -> bool:
        """Publish a custom metric to CloudWatch"""
        if not self.client:
            logger.debug("CloudWatch client not available, skipping metric")
            return False
        
        try:
            metric_data = {
                'MetricName': metric_name,
                'Value': value,
                'Unit': unit,
                'Timestamp': datetime.utcnow(),
                'Dimensions': []
            }
            
            if dimensions:
                metric_data['Dimensions'] = [
                    {'Name': k, 'Value': v}
                    for k, v in dimensions.items()
                ]
            
            self.client.put_metric_data(
                Namespace=self.namespace,
                MetricData=[metric_data]
            )
            logger.debug(f"Published metric: {metric_name} = {value}")
            return True
        except ClientError as e:
            logger.error(f"Error publishing metric {metric_name}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error publishing metric: {str(e)}")
            return False
    
    def get_metric_statistics(self, metric_name: str, start_time: datetime, 
                              end_time: datetime, period: int = 300,
                              statistic: str = 'Average',
                              dimensions: Optional[List[Dict[str, str]]] = None) -> List[Dict]:
        """Get metric statistics from CloudWatch"""
        if not self.client:
            logger.warning("CloudWatch client not available")
            return []
        
        try:
            params = {
                'Namespace': self.namespace,
                'MetricName': metric_name,
                'StartTime': start_time,
                'EndTime': end_time,
                'Period': period,
                'Statistics': [statistic]
            }
            
            if dimensions:
                params['Dimensions'] = dimensions
            
            response = self.client.get_metric_statistics(**params)
            return response.get('Datapoints', [])
        except ClientError as e:
            logger.error(f"Error getting metric statistics: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error getting metric statistics: {str(e)}")
            return []
    
    def list_metrics(self, metric_name: Optional[str] = None,
                     dimensions: Optional[Dict[str, str]] = None) -> List[Dict]:
        """List available metrics"""
        if not self.client:
            return []
        
        try:
            params = {'Namespace': self.namespace}
            
            if metric_name:
                params['MetricName'] = metric_name
            
            if dimensions:
                params['Dimensions'] = [
                    {'Name': k, 'Value': v}
                    for k, v in dimensions.items()
                ]
            
            response = self.client.list_metrics(**params)
            return response.get('Metrics', [])
        except ClientError as e:
            logger.error(f"Error listing metrics: {str(e)}")
            return []
    
    def track_api_request(self, endpoint: str, status_code: int, duration: float) -> None:
        """Track API request metrics"""
        self.put_metric('APIRequests', 1, 'Count', {
            'Endpoint': endpoint,
            'StatusCode': str(status_code)
        })
        self.put_metric('APIResponseTime', duration, 'Milliseconds', {
            'Endpoint': endpoint
        })
        
        if status_code >= 500:
            self.put_metric('APIErrors', 1, 'Count', {
                'Endpoint': endpoint,
                'ErrorType': 'ServerError'
            })
        elif status_code >= 400:
            self.put_metric('APIErrors', 1, 'Count', {
                'Endpoint': endpoint,
                'ErrorType': 'ClientError'
            })
    
    def track_scan_operation(self, scanner_type: str, region: str, success: bool, 
                            duration: float, findings_count: Optional[int] = None) -> None:
        """Track security scan operation metrics"""
        status = 'Success' if success else 'Failed'
        self.put_metric('ScanOperations', 1, 'Count', {
            'ScannerType': scanner_type,
            'Region': region,
            'Status': status
        })
        self.put_metric('ScanDuration', duration, 'Seconds', {
            'ScannerType': scanner_type,
            'Region': region
        })
        
        if findings_count is not None:
            self.put_metric('FindingsCount', findings_count, 'Count', {
                'ScannerType': scanner_type,
                'Region': region
            })
        
        if not success:
            self.put_metric('ScanErrors', 1, 'Count', {
                'ScannerType': scanner_type,
                'Region': region
            })









