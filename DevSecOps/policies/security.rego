package security

# IAM Security Policies for IAM Dashboard
# This file contains OPA policies to enforce security best practices

# Deny if IAM policies allow overly broad permissions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Action == "*"
    input.resource.Statement[_].Resource == "*"
    msg := "IAM policy allows overly broad permissions (Action: *, Resource: *)"
}

# Deny if IAM policies allow administrative actions without conditions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    admin_actions := ["*", "iam:*", "s3:*", "ec2:*", "rds:*", "lambda:*"]
    input.resource.Statement[_].Action[_] in admin_actions
    not input.resource.Statement[_].Condition
    msg := "Administrative IAM actions must include conditions"
}

# Deny if IAM user has console access without MFA
deny[msg] {
    input.resource_type == "aws_iam_user"
    input.resource.ConsoleAccess == true
    not input.resource.MFAEnabled
    msg := "IAM users with console access must have MFA enabled"
}

# Deny if IAM access keys are older than 90 days
deny[msg] {
    input.resource_type == "aws_iam_access_key"
    input.resource.CreateDate
    days_old := (time.now_ns() - input.resource.CreateDate) / (24 * 60 * 60 * 1000000000)
    days_old > 90
    msg := sprintf("IAM access key is %d days old, should be rotated", [days_old])
}

# Deny if IAM policies allow cross-account access without conditions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Principal.AWS != "*"
    not input.resource.Statement[_].Condition
    msg := "Cross-account IAM access must include conditions"
}

# Deny if IAM roles have overly permissive trust policies
deny[msg] {
    input.resource_type == "aws_iam_role"
    input.resource.AssumeRolePolicyDocument.Statement[_].Effect == "Allow"
    input.resource.AssumeRolePolicyDocument.Statement[_].Principal.AWS == "*"
    msg := "IAM role trust policy allows access from any AWS account"
}

# Deny if IAM policies allow PassRole without resource restrictions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    input.resource.Statement[_].Action[_] == "iam:PassRole"
    input.resource.Statement[_].Resource == "*"
    msg := "iam:PassRole action must be restricted to specific roles"
}

# Deny if IAM policies allow privilege escalation
deny[msg] {
    input.resource_type == "aws_iam_policy"
    input.resource.Statement[_].Effect == "Allow"
    escalation_actions := [
        "iam:CreateRole",
        "iam:AttachRolePolicy", 
        "iam:PutRolePolicy",
        "iam:CreatePolicy",
        "iam:CreatePolicyVersion"
    ]
    input.resource.Statement[_].Action[_] in escalation_actions
    msg := "IAM policy allows privilege escalation actions"
}

# Allow if all security checks pass
allow {
    count(deny) == 0
}
