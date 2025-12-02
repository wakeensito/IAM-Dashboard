terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration
  # Option 1: Local backend (for testing when S3 access is not available)
  # Uncomment this for local testing:
  # backend "local" {
  #   path = "terraform.tfstate"
  # }

  # Option 2: S3 backend (for production/shared state)
  # Uses AWS profile that assumes IAMDash-Developer-Dev role
  backend "s3" {
    bucket  = "iam-dashboard-project"
    key     = "terraform/state/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    profile = "IAMDash-Developer-Dev"  # Uses AWS profile that assumes the role
    # Note: Backend runs before provider role assumption
    # Using profile ensures backend can access bucket with proper permissions
    # dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "IAMDash-Developer-Dev"  # Use AWS profile that assumes IAMDash-Developer-Dev role

  # Note: Using profile instead of assume_role ensures consistent role usage
  # across backend and provider. The profile automatically assumes the role.
}

# S3 Module
module "s3" {
  source = "./s3"

  aws_region     = var.aws_region
  environment    = var.environment
  project_name   = var.project_name
  s3_bucket_name = var.s3_bucket_name
}

# DynamoDB Module
module "dynamodb" {
  source = "./dynamodb"

  aws_region          = var.aws_region
  environment         = var.environment
  project_name        = var.project_name
  dynamodb_table_name = var.dynamodb_table_name
}

# Lambda Module
module "lambda" {
  source = "./lambda"

  aws_region           = var.aws_region
  environment          = var.environment
  project_name         = var.project_name
  lambda_function_name = var.lambda_function_name
  dynamodb_table_name  = var.dynamodb_table_name
  s3_bucket_name       = var.s3_bucket_name
}

# API Gateway Module
module "api_gateway" {
  source = "./api-gateway"

  aws_region              = var.aws_region
  environment             = var.environment
  project_name            = var.project_name
  lambda_function_name    = module.lambda.lambda_function_name
  lambda_function_arn     = module.lambda.lambda_function_arn
  lambda_function_invoke_arn = module.lambda.lambda_function_invoke_arn
}

# GitHub Actions OIDC Module
module "github_actions" {
  source = "./github-actions"

  aws_region                  = var.aws_region
  environment                 = var.environment
  project_name                = var.project_name
  github_repo_owner           = var.github_repo_owner
  github_repo_name            = var.github_repo_name
  frontend_s3_bucket_name     = var.s3_bucket_name
  scan_results_s3_bucket_name = var.scan_results_s3_bucket_name
  lambda_function_name        = var.lambda_function_name
  dynamodb_table_name         = var.dynamodb_table_name
}

# CloudWatch Module
module "cloudwatch" {
  source = "./cloudwatch"

  aws_region           = var.aws_region
  environment          = var.environment
  project_name         = var.project_name
  lambda_function_name = module.lambda.lambda_function_name
  lambda_timeout       = module.lambda.lambda_timeout
  sns_topic_arn        = var.sns_topic_arn
  log_retention_days   = var.log_retention_days

  depends_on = [module.lambda]
}

