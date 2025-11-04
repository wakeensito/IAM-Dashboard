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

# API Gateway REST API
resource "aws_apigatewayv2_api" "api" {
  name          = var.api_gateway_name
  description   = "REST API for IAM Dashboard security scanning"
  protocol_type = "HTTP"
  version       = "1.0"

  cors_configuration {
    allow_origins = var.cors_allowed_origins
    allow_methods = var.cors_allowed_methods
    allow_headers = var.cors_allowed_headers
    max_age       = 3600
  }

  tags = {
    Name      = var.api_gateway_name
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# Default stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.stage_name
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = var.throttling_burst_limit
    throttling_rate_limit  = var.throttling_rate_limit
  }

  tags = {
    Name      = "${var.api_gateway_name}-${var.stage_name}"
    Project   = var.project_name
    Env       = var.environment
    ManagedBy = "terraform"
  }
}

# Placeholder: Integration will be added when Lambda is ready
# This creates a placeholder structure for the 9 API endpoints
# Actual integrations will be added when Lambda function is deployed

output "api_endpoints_placeholder" {
  description = "Placeholder for 9 API endpoints to be implemented"
  value = {
    endpoints = [
      "POST   /scan/security-hub",
      "POST   /scan/guardduty",
      "POST   /scan/config",
      "POST   /scan/inspector",
      "POST   /scan/macie",
      "POST   /scan/iam",
      "POST   /scan/ec2",
      "POST   /scan/s3",
      "POST   /scan/full"
    ]
    note = "These endpoints will be configured once Lambda function is deployed and ready for integration"
  }
}

