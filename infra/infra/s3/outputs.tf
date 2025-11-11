output "s3_bucket_name" {
  description = "Name of the S3 bucket for project"
  value       = aws_s3_bucket.project_bucket.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.project_bucket.arn
}
