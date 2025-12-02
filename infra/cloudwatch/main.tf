terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# CloudWatch Dashboard for IAM Dashboard metrics
resource "aws_cloudwatch_dashboard" "iam_dashboard" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "ScanSuccess", { "stat" : "Sum", "label" : "Successful Scans" }]
          ]
          period  = 300
          stat    = "Sum"
          region  = var.aws_region
          title   = "Successful Scans"
          view    = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "ScanErrors", { "stat" : "Sum", "label" : "Failed Scans" }]
          ]
          period  = 300
          stat    = "Sum"
          region  = var.aws_region
          title   = "Failed Scans"
          view    = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "ScanDuration", { "stat" : "Average", "label" : "Average Duration" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Scan Duration (seconds)"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "FindingsCount", { "stat" : "Sum", "label" : "Total Findings" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "Security Findings Count"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "APIRequests", { "stat" : "Sum", "label" : "API Requests" }]
          ]
          period  = 300
          stat    = "Sum"
          region  = var.aws_region
          title   = "API Requests"
          view    = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["${var.project_name}/${var.environment}", "APIErrors", { "stat" : "Sum", "label" : "API Errors" }]
          ]
          period  = 300
          stat    = "Sum"
          region  = var.aws_region
          title   = "API Errors"
          view    = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", { "FunctionName" : var.lambda_function_name, "MetricName" : "Invocations", "stat" : "Sum" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "Lambda Invocations"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", { "FunctionName" : var.lambda_function_name, "MetricName" : "Errors", "stat" : "Sum" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "Lambda Errors"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", { "FunctionName" : var.lambda_function_name, "MetricName" : "Duration", "stat" : "Average" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Lambda Duration"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 24
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", { "FunctionName" : var.lambda_function_name, "MetricName" : "Throttles", "stat" : "Sum" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "Lambda Throttles"
          view   = "timeSeries"
        }
      }
    ]
  })
}

# CloudWatch Alarm for Lambda Errors
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "This metric monitors lambda function errors"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  tags = {
    Name      = "${var.project_name}-${var.environment}-lambda-errors-alarm"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# CloudWatch Alarm for High Scan Error Rate
resource "aws_cloudwatch_metric_alarm" "scan_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-scan-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ScanErrors"
  namespace           = "${var.project_name}/${var.environment}"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "This metric monitors security scan errors"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name      = "${var.project_name}-${var.environment}-scan-errors-alarm"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# CloudWatch Alarm for High API Error Rate
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-api-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "APIErrors"
  namespace           = "${var.project_name}/${var.environment}"
  period              = 300
  statistic           = "Sum"
  threshold           = 20
  alarm_description   = "This metric monitors API errors"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  tags = {
    Name      = "${var.project_name}-${var.environment}-api-errors-alarm"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# CloudWatch Alarm for Lambda Duration
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${var.project_name}-${var.environment}-lambda-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Average"
  threshold           = var.lambda_timeout * 1000 * 0.8 # 80% of timeout
  alarm_description   = "This metric monitors lambda function duration"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  tags = {
    Name      = "${var.project_name}-${var.environment}-lambda-duration-alarm"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# CloudWatch Log Group for Lambda (if not already created)
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = var.log_retention_days

  tags = {
    Name      = "${var.project_name}-${var.environment}-lambda-logs"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}