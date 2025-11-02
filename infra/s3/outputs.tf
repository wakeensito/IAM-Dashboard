output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.scan_results.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.scan_results.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.scan_results.bucket_domain_name
}

