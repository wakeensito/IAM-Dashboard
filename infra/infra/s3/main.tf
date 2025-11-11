variable "bucket_prefix" {
  description = "Prefix for S3 bucket name (will get a random suffix to ensure uniqueness)"
  type        = string
  default     = "iam-dashboard-project"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "project_bucket" {
  bucket = "${var.bucket_prefix}-${random_id.suffix.hex}"
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
    Project     = "IAMDash"
    Environment = var.environment
  }

  lifecycle_rule {
    id      = "expire-old-versions"
    enabled = true

    noncurrent_version_expiration {
      days = 90
    }
  }

  force_destroy = false
}