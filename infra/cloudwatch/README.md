# CloudWatch Integration for IAM Dashboard

This module sets up CloudWatch monitoring, dashboards, and alarms for the IAM Dashboard project.

## Resources Created

- **CloudWatch Dashboard**: Comprehensive dashboard showing:
  - Scan operations overview (success/failure rates)
  - Scan duration metrics
  - Security findings counts
  - API request metrics
  - Lambda function metrics

- **CloudWatch Alarms**:
  - Lambda function errors
  - High scan error rate
  - High API error rate
  - Lambda function duration thresholds

- **CloudWatch Log Group**: Centralized logging for Lambda function

## Usage

The module is automatically included in the main infrastructure. To customize:

```hcl
module "cloudwatch" {
  source = "./cloudwatch"
  
  aws_region            = "us-east-1"
  environment           = "dev"
  project_name          = "IAMDash"
  lambda_function_name  = "iam-dashboard-scanner"
  lambda_timeout        = 300
  sns_topic_arn         = "arn:aws:sns:us-east-1:123456789012:alerts"  # Optional
  log_retention_days    = 30
}
```

## Metrics Published

### Custom Metrics (Namespace: `IAMDash/{environment}`)

- `ScanSuccess`: Number of successful scans
- `ScanErrors`: Number of failed scans
- `ScanDuration`: Duration of scan operations (seconds)
- `FindingsCount`: Number of security findings discovered
- `APIRequests`: Number of API requests
- `APIErrors`: Number of API errors
- `APIResponseTime`: API response time (milliseconds)
- `ResultsStored`: Number of results successfully stored
- `StorageErrors`: Number of storage errors

### AWS Lambda Metrics

- `Invocations`: Number of Lambda invocations
- `Errors`: Number of Lambda errors
- `Duration`: Lambda execution duration
- `Throttles`: Number of Lambda throttles

## Alarms

The module creates alarms that trigger when:
- Lambda errors exceed 5 in 10 minutes
- Scan errors exceed 10 in 10 minutes
- API errors exceed 20 in 10 minutes
- Lambda duration exceeds 80% of timeout

Alarms can send notifications to an SNS topic if configured.

## Viewing Metrics

1. Access the CloudWatch Dashboard via the URL in Terraform outputs
2. View individual metrics in CloudWatch Metrics
3. Set up custom alarms via AWS Console or Terraform

## Logs

Lambda function logs are automatically sent to CloudWatch Logs at:
`/aws/lambda/{lambda_function_name}`

Logs are retained for the specified number of days (default: 30 days).









