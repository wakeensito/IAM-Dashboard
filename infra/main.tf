terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

# Random ID for unique bucket name
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 bucket for scan results
resource "aws_s3_bucket" "scan_results" {
  bucket = "iam-dashboard-scan-results-${random_id.bucket_suffix.hex}"
  
  tags = {
    Project = "IAMDash"
    Env     = "dev"
  }
}

# S3 bucket versioning
resource "aws_s3_bucket_versioning" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Output the bucket name
output "bucket_name" {
  value = aws_s3_bucket.scan_results.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.scan_results.arn
}
