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

# helper: statement requires MFA for AssumeRole (checks StringEquals["aws:MultiFactorAuthPresent"])
mfa_required(stmt) {
    stmt.Condition
    stmt.Condition.StringEquals
    stmt.Condition.StringEquals["aws:MultiFactorAuthPresent"]
}

# Deny if IAM policy allows AssumeRole without MFA
deny[msg] {
    input.resource_type == "aws_iam_policy"
    some i, j
    stmt := input.resource.Statement[i]
    stmt.Effect == "Allow"
    stmt.Action[j] == "sts:AssumeRole"
    not mfa_required(stmt)
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

# Test functions for OPA test command
test_deny_wildcard_action {
    input := {
        "resource_type": "aws_iam_policy",
        "resource": {
            "Statement": [{
                "Effect": "Allow",
                "Action": "*",
                "Resource": "arn:aws:s3:::my-bucket/*"
            }]
        }
    }
    deny[msg] with input as input
    msg == "IAM policy contains wildcard action (*) - use specific actions"
}

test_deny_wildcard_resource {
    input := {
        "resource_type": "aws_iam_policy", 
        "resource": {
            "Statement": [{
                "Effect": "Allow",
                "Action": "s3:GetObject",
                "Resource": "*"
            }]
        }
    }
    deny[msg] with input as input
    msg == "IAM policy contains wildcard resource (*) - use specific resources"
}

test_allow_specific_permissions {
    input := {
        "resource_type": "aws_iam_policy",
        "resource": {
            "Statement": [{
                "Effect": "Allow", 
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::my-bucket/*"
            }]
        }
    }
    count(deny) == 0 with input as input
}
