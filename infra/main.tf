terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# DynamoDB Table for Scan Results
resource "aws_dynamodb_table" "scan_results" {
  name           = "iam-dashboard-scan-results"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "scan_id"
  range_key      = "timestamp"

  attribute {
    name = "scan_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  # Enable point-in-time recovery for data protection
  point_in_time_recovery {
    enabled = true
  }

  # Enable encryption at rest
  server_side_encryption {
    enabled = true
  }

  tags = {
    Name    = "iam-dashboard-scan-results"
    Project = "IAMDash"
    Env     = var.environment
    Managed = "Terraform"
  }
}

# DynamoDB Table for IAM Findings
resource "aws_dynamodb_table" "iam_findings" {
  name           = "iam-dashboard-iam-findings"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "finding_id"
  range_key      = "detected_at"

  attribute {
    name = "finding_id"
    type = "S"
  }

  attribute {
    name = "detected_at"
    type = "S"
  }

  # Global Secondary Index for querying by resource
  global_secondary_index {
    name     = "resource-index"
    hash_key = "resource_type"
    range_key = "severity"
    projection_type = "ALL"
  }

  attribute {
    name = "resource_type"
    type = "S"
  }

  attribute {
    name = "severity"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Name    = "iam-dashboard-iam-findings"
    Project = "IAMDash"
    Env     = var.environment
    Managed = "Terraform"
  }
}

# DynamoDB Table for Compliance Status
resource "aws_dynamodb_table" "compliance_status" {
  name           = "iam-dashboard-compliance"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "account_id"
  range_key      = "framework"

  attribute {
    name = "account_id"
    type = "S"
  }

  attribute {
    name = "framework"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = {
    Name    = "iam-dashboard-compliance"
    Project = "IAMDash"
    Env     = var.environment
    Managed = "Terraform"
  }
}

