variable "dynamodb_table_name" {
  description = "DynamoDB table name for scan results"
  type        = string
  default     = "iam-dashboard-scan-results"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

resource "aws_dynamodb_table" "scan_results" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "scan_id"

  attribute {
    name = "scan_id"
    type = "S"
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = false
  }

  tags = {
    Project     = "IAMDash"
    Environment = var.environment
  }
}