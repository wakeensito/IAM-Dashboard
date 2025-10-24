# Issue #1: Infrastructure Setup (Infra-as-Code)

**Goal:** Establish the base AWS environment for the IAM Dashboard project.

**Priority:** High  
**Difficulty:** Medium  
**Estimated Time:** 4-6 hours  
**Skills Needed:** Terraform, AWS S3, CloudFront, GitHub Actions

---

## Description
Create the foundational AWS infrastructure using Infrastructure as Code. This includes setting up S3 buckets for static hosting, CloudFront distribution for CDN, and establishing a repeatable deployment process.

---

## Detailed Steps

### 1. Set Up Terraform Structure
```bash
# Create new branch
git checkout -b feature/infrastructure-setup

# Create directory structure
mkdir infrastructure
cd infrastructure
```

Create these files:
- `main.tf` - Main infrastructure resources
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `terraform.tfvars` - Variable values

### 2. Write main.tf
```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Random ID for unique bucket names
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 bucket for frontend hosting
resource "aws_s3_bucket" "frontend" {
  bucket = "iam-dashboard-frontend-${random_id.bucket_suffix.hex}"
  
  tags = {
    Project = "IAMDash"
    Env     = "dev"
  }
}

# S3 bucket for scan results
resource "aws_s3_bucket" "scan_results" {
  bucket = "iam-dashboard-scan-results-${random_id.bucket_suffix.hex}"
  
  tags = {
    Project = "IAMDash"
    Env     = "dev"
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend_oai.cloudfront_access_identity_path
    }
  }
  
  enabled             = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    target_origin_id       = "S3-${aws_s3_bucket.frontend.bucket}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods       = ["GET", "HEAD"]
    cached_methods        = ["GET", "HEAD"]
  }
  
  tags = {
    Project = "IAMDash"
    Env     = "dev"
  }
}
```

### 3. Write variables.tf
```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
```

### 4. Write outputs.tf
```hcl
# outputs.tf
output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "scan_results_bucket_name" {
  value = aws_s3_bucket.scan_results.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend_distribution.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend_distribution.domain_name
}
```

### 5. Test Locally
```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Verify the plan looks correct
```

### 6. Commit and Deploy
```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: add infrastructure setup with S3 and CloudFront"

# Push to trigger GitHub Actions
git push origin feature/infrastructure-setup
```

### 7. Verify Deployment
- Check GitHub Actions for successful deployment
- Verify resources in AWS Console (read-only access)
- Confirm all resources have proper tags (`Project=IAMDash`, `Env=dev`)

---

## Success Criteria
- [ ] S3 bucket for frontend hosting created
- [ ] S3 bucket for scan results created  
- [ ] CloudFront distribution configured
- [ ] All resources properly tagged
- [ ] GitHub Actions pipeline successful
- [ ] Resources accessible via IAM roles

## Testing
```bash
# Test S3 bucket access (after assuming role)
aws s3 ls s3://iam-dashboard-frontend-[suffix]/
aws s3 ls s3://iam-dashboard-scan-results-[suffix]/

# Test CloudFront distribution
curl -I https://[cloudfront-domain].cloudfront.net
```

## Notes
- All resources must be tagged with `Project=IAMDash` and `Env=dev`
- Use the IAMDash-Developer-Dev role to access resources
- Monitor costs in AWS Console (read-only access)

---

**Assignee:** [Student name]  
**Status:** Open  
**Created:** [Date]  
**Updated:** [Date]
