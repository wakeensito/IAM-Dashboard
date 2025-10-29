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
  region = var.aws_region
}

# Random ID for unique bucket name
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 bucket for scan results
resource "aws_s3_bucket" "scan_results" {
  bucket = "iam-dashboard-scan-results-${random_id.bucket_suffix.hex}"

  tags = {
    Project = var.project_name
    Env     = var.environment
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

# S3 bucket public access block
resource "aws_s3_bucket_public_access_block" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
