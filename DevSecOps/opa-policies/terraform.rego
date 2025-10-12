package terraform

# Terraform-specific security policies for IAM Dashboard
# These policies focus on Terraform resource security

# Deny if S3 bucket is publicly accessible
deny[msg] {
    input.resource_type == "aws_s3_bucket"
    input.resource.acl == "public-read"
    msg := "S3 bucket should not be publicly accessible"
}

# Deny if S3 bucket doesn't have encryption enabled
deny[msg] {
    input.resource_type == "aws_s3_bucket"
    not input.resource.server_side_encryption_configuration
    msg := "S3 bucket must have encryption enabled"
}

# Deny if EC2 instance doesn't have detailed monitoring
deny[msg] {
    input.resource_type == "aws_instance"
    not input.resource.monitoring
    msg := "EC2 instance must have detailed monitoring enabled"
}

# Deny if security group allows all traffic
deny[msg] {
    input.resource_type == "aws_security_group"
    input.resource.ingress[_].cidr_blocks[_] == "0.0.0.0/0"
    msg := "Security group should not allow all traffic from anywhere"
}

# Deny if RDS instance is publicly accessible
deny[msg] {
    input.resource_type == "aws_db_instance"
    input.resource.publicly_accessible == true
    msg := "RDS instance should not be publicly accessible"
}

# Allow if all Terraform security checks pass
allow {
    count(deny) == 0
}

