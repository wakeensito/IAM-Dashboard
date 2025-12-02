# Terraform Permission Troubleshooting Guide

## Issue: Access Denied Errors

If you're seeing errors like:
```
Error: User: arn:aws:iam::562559071105:user/cyber-Tu is not authorized to perform: dynamodb:CreateTable
Error: User: arn:aws:iam::562559071105:user/cyber-Tu is not authorized to perform: iam:CreateRole
Error: User: arn:aws:iam::562559071105:user/cyber-Tu is not authorized to perform: s3:CreateBucket
```

This means Terraform is using your direct IAM user (`cyber-Tu`) instead of the `IAMDash-Developer-Dev` role.

## Solution Steps

### Step 1: Verify AWS Profile Configuration

Run the setup script to ensure the AWS profile is configured:

```powershell
cd infra
.\setup-aws-profile.ps1
```

This creates/updates the `~/.aws/config` file with:
```ini
[profile IAMDash-Developer-Dev]
role_arn = arn:aws:iam::562559071105:role/IAMDash-Developer-Dev
source_profile = default
region = us-east-1
```

### Step 2: Verify Your Default Profile Has AssumeRole Permission

Your `cyber-Tu` user needs permission to assume the `IAMDash-Developer-Dev` role. Check with your AWS administrator that your user has:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::562559071105:role/IAMDash-Developer-Dev"
    }
  ]
}
```

### Step 3: Set AWS Profile Before Running Terraform

**Option A: Use the helper script (Recommended)**

```powershell
cd infra
.\use-developer-role.ps1
terraform plan
terraform apply
```

**Option B: Set environment variable manually**

```powershell
$env:AWS_PROFILE = "IAMDash-Developer-Dev"
terraform plan
terraform apply
```

**Option C: Verify current identity**

Before running Terraform, verify you're using the correct role:

```powershell
aws sts get-caller-identity --profile IAMDash-Developer-Dev
```

You should see something like:
```json
{
    "UserId": "...",
    "Account": "562559071105",
    "Arn": "arn:aws:sts::562559071105:assumed-role/IAMDash-Developer-Dev/..."
}
```

If you see `arn:aws:iam::562559071105:user/cyber-Tu` instead, the role assumption is not working.

### Step 4: Verify Backend Configuration

The Terraform backend in `main.tf` is configured to use the profile:

```hcl
backend "s3" {
  bucket  = "iam-dashboard-project"
  key     = "terraform/state/terraform.tfstate"
  region  = "us-east-1"
  encrypt = true
  profile = "IAMDash-Developer-Dev"
}
```

If you've already run `terraform init`, you may need to reinitialize:

```powershell
terraform init -reconfigure
```

## Required Permissions for IAMDash-Developer-Dev Role

The `IAMDash-Developer-Dev` role needs the following permissions:

### DynamoDB
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:UpdateTable`
- `dynamodb:DeleteTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`

### IAM
- `iam:CreateRole`
- `iam:GetRole`
- `iam:UpdateRole`
- `iam:DeleteRole`
- `iam:PutRolePolicy`
- `iam:GetRolePolicy`
- `iam:DeleteRolePolicy`
- `iam:AttachRolePolicy`
- `iam:DetachRolePolicy`
- `iam:ListAttachedRolePolicies`
- `iam:TagRole`
- `iam:UntagRole`

### S3
- `s3:CreateBucket`
- `s3:GetBucketLocation`
- `s3:PutBucketVersioning`
- `s3:PutBucketEncryption`
- `s3:PutBucketPublicAccessBlock`
- `s3:PutBucketWebsite`
- `s3:PutBucketPolicy`
- `s3:GetBucketPolicy`
- `s3:DeleteBucket`

### Lambda
- `lambda:CreateFunction`
- `lambda:UpdateFunctionCode`
- `lambda:UpdateFunctionConfiguration`
- `lambda:GetFunction`
- `lambda:DeleteFunction`

### API Gateway
- `apigatewayv2:CreateApi`
- `apigatewayv2:CreateStage`
- `apigatewayv2:CreateIntegration`
- `apigatewayv2:CreateRoute`

### CloudWatch
- `cloudwatch:PutDashboard`
- `cloudwatch:PutMetricAlarm`
- `logs:CreateLogGroup`
- `logs:PutRetentionPolicy`

## Common Issues

### Issue: "Profile not found"
**Solution**: Run `.\setup-aws-profile.ps1` to create the profile configuration.

### Issue: "Access Denied when assuming role"
**Solution**: Your `cyber-Tu` user needs `sts:AssumeRole` permission for the `IAMDash-Developer-Dev` role. Contact your AWS administrator.

### Issue: "Backend access denied"
**Solution**: The backend needs access to the S3 bucket. Ensure:
1. The `IAMDash-Developer-Dev` role has S3 permissions
2. The S3 bucket `iam-dashboard-project` exists
3. You've run `terraform init -reconfigure` after setting up the profile

### Issue: "Role exists but still getting user errors"
**Solution**: 
1. Verify the profile is set: `$env:AWS_PROFILE = "IAMDash-Developer-Dev"`
2. Check current identity: `aws sts get-caller-identity --profile IAMDash-Developer-Dev`
3. Reinitialize Terraform: `terraform init -reconfigure`

## Next Steps

If you continue to have issues:

1. **Contact your AWS Administrator** to verify:
   - The `IAMDash-Developer-Dev` role exists
   - The role has the required permissions listed above
   - Your `cyber-Tu` user has permission to assume the role

2. **Check AWS CloudTrail** logs to see what identity is actually being used

3. **Verify the role trust policy** allows your user to assume it:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::562559071105:user/cyber-Tu"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```







