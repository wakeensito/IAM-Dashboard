# CloudWatch Integration Guide

This document explains how CloudWatch is integrated into the IAM Dashboard project.

## Overview

CloudWatch integration provides comprehensive monitoring, logging, and alerting for:
- Lambda function execution
- Backend API requests
- Security scan operations
- Error tracking and performance metrics

## Components

### 1. Lambda Function Integration

**Location**: `infra/lambda/lambda_function.py`

The Lambda function publishes custom metrics to CloudWatch:

- **ScanSuccess**: Number of successful scans
- **ScanErrors**: Number of failed scans (with error types)
- **ScanDuration**: Duration of scan operations
- **FindingsCount**: Number of security findings discovered
- **ResultsStored**: Successfully stored results
- **StorageErrors**: Storage operation failures
- **TotalExecutionTime**: Total Lambda execution time

**Metrics Namespace**: `{PROJECT_NAME}/{ENVIRONMENT}` (e.g., `IAMDash/dev`)

### 2. Backend Flask Integration

**Location**: `backend/services/cloudwatch_service.py` and `backend/app.py`

The Flask backend automatically tracks:
- API request counts and response times
- API errors (4xx and 5xx status codes)
- Security scan operations initiated from the backend

**Middleware**: Request/response tracking is handled automatically via Flask middleware.

### 3. CloudWatch Infrastructure

**Location**: `infra/cloudwatch/`

Terraform module that creates:
- **CloudWatch Dashboard**: Visual dashboard with key metrics
- **CloudWatch Alarms**: Automated alerts for critical events
- **CloudWatch Log Group**: Centralized logging for Lambda

## Setup

### 1. Deploy Infrastructure

```bash
cd infra
terraform init
terraform plan
terraform apply
```

### 2. Configure Environment Variables

For the backend Flask app, set these environment variables:

```bash
export AWS_REGION=us-east-1
export CLOUDWATCH_NAMESPACE=IAMDash/dev
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
```

### 3. IAM Permissions

The Lambda function already has CloudWatch permissions configured in `infra/lambda/lambda-role-policy.json`.

For the backend, ensure your AWS credentials have:
- `cloudwatch:PutMetricData`
- `cloudwatch:GetMetricStatistics`
- `cloudwatch:ListMetrics`

## Viewing Metrics

### CloudWatch Dashboard

After deployment, access the dashboard via:
```bash
terraform output cloudwatch_dashboard_url
```

Or find it in AWS Console: CloudWatch → Dashboards → `{project-name}-{environment}-dashboard`

### Individual Metrics

Navigate to CloudWatch → Metrics → Custom Namespaces → `IAMDash/{environment}`

## Alarms

The following alarms are automatically created:

1. **Lambda Errors**: Triggers when Lambda errors exceed 5 in 10 minutes
2. **Scan Errors**: Triggers when scan errors exceed 10 in 10 minutes
3. **API Errors**: Triggers when API errors exceed 20 in 10 minutes
4. **Lambda Duration**: Triggers when Lambda duration exceeds 80% of timeout

### Configuring Alarm Notifications

To receive alarm notifications via SNS:

1. Create an SNS topic (or use existing)
2. Update `infra/variables.tf`:
   ```hcl
   variable "sns_topic_arn" {
     default = "arn:aws:sns:us-east-1:123456789012:alerts"
   }
   ```
3. Run `terraform apply`

## Custom Metrics

### Publishing Custom Metrics from Lambda

```python
from datetime import datetime

publish_metric('CustomMetricName', value, {
    'Dimension1': 'value1',
    'Dimension2': 'value2'
})
```

### Publishing Custom Metrics from Backend

```python
from services.cloudwatch_service import CloudWatchService

cloudwatch = CloudWatchService()
cloudwatch.put_metric('CustomMetric', 1.0, 'Count', {
    'Source': 'backend',
    'Type': 'custom'
})
```

## Logs

### Lambda Logs

Lambda function logs are automatically sent to CloudWatch Logs at:
```
/aws/lambda/{lambda_function_name}
```

### Viewing Logs

1. AWS Console: CloudWatch → Logs → Log groups
2. AWS CLI:
   ```bash
   aws logs tail /aws/lambda/iam-dashboard-scanner --follow
   ```

### Log Retention

Logs are retained for 30 days by default. Configure via `log_retention_days` variable.

## Best Practices

1. **Namespace Organization**: Use consistent namespace format: `{Project}/{Environment}`
2. **Dimension Usage**: Add dimensions to metrics for better filtering and analysis
3. **Cost Management**: Monitor CloudWatch costs; custom metrics incur charges
4. **Alarm Thresholds**: Adjust alarm thresholds based on your operational needs
5. **Log Levels**: Use appropriate log levels (DEBUG, INFO, WARNING, ERROR)

## Troubleshooting

### Metrics Not Appearing

1. Check IAM permissions for CloudWatch
2. Verify namespace matches configuration
3. Check CloudWatch service quotas
4. Review Lambda function logs for errors

### Alarms Not Triggering

1. Verify alarm configuration in Terraform
2. Check SNS topic permissions (if configured)
3. Review alarm evaluation periods
4. Confirm metric names match exactly

### High Costs

1. Review number of custom metrics
2. Reduce log retention period if needed
3. Use metric math to combine metrics instead of creating many
4. Consider using CloudWatch Logs Insights instead of custom metrics for queries

## References

- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [CloudWatch Metrics Best Practices](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)
- [CloudWatch Pricing](https://aws.amazon.com/cloudwatch/pricing/)









