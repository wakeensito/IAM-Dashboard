package security

# IAM Security Policies for IAM Dashboard
# This file contains OPA policies to enforce security best practices

# Deny if IAM policies allow overly broad permissions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    some j
    stmt := input.resource.Statement[j]
    stmt.Effect == "Allow"
    stmt.Action == "*"
    stmt.Resource == "*"
    msg := "IAM policy allows overly broad permissions (Action: *, Resource: *)"
}

# Deny if IAM policies allow administrative actions without conditions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    admin_actions := ["*", "iam:*", "s3:*", "ec2:*", "rds:*", "lambda:*"]
    some j, k, idx
    stmt := input.resource.Statement[j]
    stmt.Effect == "Allow"
    action := stmt.Action[k]
    admin_actions[idx] == action
    not stmt.Condition
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
    some j
    stmt := input.resource.Statement[j]
    stmt.Effect == "Allow"
    stmt.Principal.AWS != "*"
    not stmt.Condition
    msg := "Cross-account IAM access must include conditions"
}

# Deny if IAM roles have overly permissive trust policies
deny[msg] {
    input.resource_type == "aws_iam_role"
    some j
    stmt := input.resource.AssumeRolePolicyDocument.Statement[j]
    stmt.Effect == "Allow"
    stmt.Principal.AWS == "*"
    msg := "IAM role trust policy allows access from any AWS account"
}

# Deny if IAM policies allow PassRole without resource restrictions
deny[msg] {
    input.resource_type == "aws_iam_policy"
    some j, k
    stmt := input.resource.Statement[j]
    stmt.Effect == "Allow"
    action := stmt.Action[k]
    action == "iam:PassRole"
    stmt.Resource == "*"
    msg := "iam:PassRole action must be restricted to specific roles"
}

# Deny if IAM policies allow privilege escalation
deny[msg] {
    input.resource_type == "aws_iam_policy"
    escalation_actions := [
        "iam:CreateRole",
        "iam:AttachRolePolicy", 
        "iam:PutRolePolicy",
        "iam:CreatePolicy",
        "iam:CreatePolicyVersion"
    ]
    some j, k, idx
    stmt := input.resource.Statement[j]
    stmt.Effect == "Allow"
    action := stmt.Action[k]
    escalation_actions[idx] == action
    msg := "IAM policy allows privilege escalation actions"
}

# Allow if all security checks pass
allow {
    count(deny) == 0
}
