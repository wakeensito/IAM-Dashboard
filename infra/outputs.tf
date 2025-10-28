output "dynamodb_scan_results_table" {
  description = "DynamoDB table for scan results"
  value       = aws_dynamodb_table.scan_results.name
}

output "dynamodb_iam_findings_table" {
  description = "DynamoDB table for IAM findings"
  value       = aws_dynamodb_table.iam_findings.name
}

output "dynamodb_compliance_table" {
  description = "DynamoDB table for compliance status"
  value       = aws_dynamodb_table.compliance_status.name
}

output "dynamodb_table_arns" {
  description = "ARNs of all DynamoDB tables"
  value = {
    scan_results = aws_dynamodb_table.scan_results.arn
    iam_findings = aws_dynamodb_table.iam_findings.arn
    compliance   = aws_dynamodb_table.compliance_status.arn
  }
}

