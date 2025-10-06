package iam_policies

# IAM-specific security policies for the IAM Dashboard
# These policies focus on IAM resource security

# Deny if IAM policy allows wildcard permissions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Action == "*"
    msg := "IAM policy contains wildcard action (*) - use specific actions"
}

# Deny if IAM policy allows wildcard resources
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Resource == "*"
    msg := "IAM policy contains wildcard resource (*) - use specific resources"
}

# Deny if IAM user has inline policies (prefer managed policies)
deny[msg] {
    input.resource_type == "aws_iam_user"
    count(input.resource.Policies) > 0
    msg := "IAM user has inline policies - use managed policies instead"
}

# Deny if IAM role has inline policies (prefer managed policies)
deny[msg] {
    input.resource_type == "aws_iam_role"
    count(input.resource.Policies) > 0
    msg := "IAM role has inline policies - use managed policies instead"
}

# Deny if IAM policy version is not latest
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Version != "2012-10-17"
    msg := "IAM policy version must be 2012-10-17"
}

# Deny if IAM policy allows AssumeRole without MFA
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Action[_] == "sts:AssumeRole"
    not input.resource.Statement[_].Condition.StringEquals."aws:MultiFactorAuthPresent"
    msg := "AssumeRole action must require MFA"
}

# Deny if IAM policy allows root account access
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Principal.AWS == "arn:aws:iam::*:root"
    msg := "IAM policy should not allow root account access"
}

# Deny if IAM user has access keys without rotation policy
deny[msg] {
    input.resource_type == "aws_iam_user"
    input.resource.AccessKeys[_]
    not input.resource.AccessKeyRotationPolicy
    msg := "IAM user with access keys must have rotation policy"
}

# Allow if all IAM security checks pass
allow {
    count(deny) == 0
}
