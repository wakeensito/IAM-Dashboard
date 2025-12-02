terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Provider block removed - module inherits provider from parent
# This ensures role assumption from main.tf is used

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

# Lambda integration - use variables passed from Lambda module
# This avoids needing data source permissions
resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_function_invoke_arn != "" ? var.lambda_function_invoke_arn : "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:${var.lambda_function_name}"
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Get current AWS account ID (no permissions needed)
data "aws_caller_identity" "current" {}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name != "" ? var.lambda_function_name : "iam-dashboard-scanner"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

# Routes for all 9 security scan endpoints
resource "aws_apigatewayv2_route" "security_hub" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/security-hub"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "guardduty" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/guardduty"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "config" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/config"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "inspector" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/inspector"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "macie" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/macie"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "iam" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/iam"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "ec2" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/ec2"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "s3" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/s3"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "full" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /scan/full"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

