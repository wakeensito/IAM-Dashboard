cd // Terraform manifest for IAM-Dashboard infrastructure (S3 for scan results + IAM role)
// Note: Set `AWS` credentials via environment or shared config before running.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment tag"
  type        = string
  default     = "dev"
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "scan_results" {
  bucket = "iam-dashboard-scan-results-${random_id.suffix.hex}"
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name        = "iam-dashboard-scan-results"
    Environment = var.environment
  }
}

resource "aws_iam_role" "app_role" {
  name = "iam_dashboard_app_role-${random_id.suffix.hex}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_policy" "s3_access" {
  name = "iam_dashboard_s3_access-${random_id.suffix.hex}"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid = "AllowS3PutGet",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.scan_results.arn,
          "${aws_s3_bucket.scan_results.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_s3" {
  role       = aws_iam_role.app_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for scanner results"
  value       = aws_s3_bucket.scan_results.id
}

output "app_role_arn" {
  description = "IAM role ARN for the dashboard application"
  value       = aws_iam_role.app_role.arn
}
