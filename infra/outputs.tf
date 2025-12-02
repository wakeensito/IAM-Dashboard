output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.s3.s3_bucket_name
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda.lambda_function_name
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.dynamodb.dynamodb_table_name
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = module.api_gateway.api_gateway_id
}

output "github_actions_role_arn" {
  description = "GitHub Actions IAM role ARN"
  value       = module.github_actions.github_actions_role_arn
}

output "cloudwatch_dashboard_url" {
  description = "CloudWatch Dashboard URL"
  value       = module.cloudwatch.dashboard_url
}

output "cloudwatch_dashboard_name" {
  description = "CloudWatch Dashboard name"
  value       = module.cloudwatch.dashboard_name
}

