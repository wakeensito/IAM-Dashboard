# Configure AWS Provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-2"
}

# Lambda function
data "aws_iam_role" "lambda_role" {
  name = "iam-dashboard-lambda-role"
}

resource "aws_lambda_function" "iam_dashboard_api" {
  filename         = "${path.module}/lambda_function.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda_function.zip")
  function_name    = "iam-dashboard-api"
  role             = data.aws_iam_role.lambda_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.9"
  timeout          = 30

  tags = {
    Project = "IAMDash"
    Env     = "dev"
  }
}