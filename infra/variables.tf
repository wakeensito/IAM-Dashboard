variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "IAMDash"
}

variable "github_repo_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "wakeensito"
}

variable "github_repo_name" {
  description = "GitHub repository name"
  type        = string
  default     = "IAM-Dashboard"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for frontend static hosting"
  type        = string
  default     = "iam-dashboard-project"
}

variable "scan_results_s3_bucket_name" {
  description = "S3 bucket name for scan results storage"
  type        = string
  default     = "iam-dashboard-scan-results"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for scan results"
  type        = string
  default     = "iam-dashboard-scan-results"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "iam-dashboard-scanner"
}

variable "sns_topic_arn" {
  description = "SNS topic ARN for CloudWatch alarm notifications (optional)"
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 30
}

variable "assume_role_arn" {
  description = "IAM role ARN to assume for resource access (e.g., IAMDash-Developer-Dev)"
  type        = string
  default     = ""
}

