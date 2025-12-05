# IAM Test Resources Scripts

These scripts create IAM resources in your AWS account that will trigger security findings when scanned by the IAM Dashboard scanner.

## ⚠️ Warning

These scripts create **intentionally insecure** IAM resources for testing purposes only. Do NOT use these in production environments. Always clean up test resources after testing.

## Prerequisites

- AWS CLI installed and configured
- Appropriate IAM permissions to create users, roles, and policies
- AWS credentials configured (via `aws configure` or environment variables)

## Usage

### Create Test Resources

```bash
cd scripts
./create-iam-test-resources.sh
```

This will create:
1. **User with AdministratorAccess** (Critical finding)
2. **Role with AdministratorAccess** (Critical finding)
3. **Role with wildcard permissions (`*`)** (Critical finding)
4. **Role with public access trust policy** (Critical finding)
5. **User without MFA** (Medium/High finding)
6. **Role with service-wide wildcard (`s3:*`)** (High finding)

### Test the Scanner

1. Run the script to create test resources
2. Go to your IAM Dashboard application
3. Navigate to the "IAM & Access" tab
4. Click "Start Scan"
5. The scan should detect all the test resources as security findings

### Cleanup Test Resources

The script outputs a timestamp. Use it to clean up:

```bash
./cleanup-iam-test-resources.sh <TIMESTAMP>
```

Example:
```bash
./cleanup-iam-test-resources.sh 1234567890
```

Or manually delete resources:
- Users: `test-admin-user-<TIMESTAMP>`, `test-no-mfa-user-<TIMESTAMP>`
- Roles: `test-admin-role-<TIMESTAMP>`, `test-wildcard-role-<TIMESTAMP>`, `test-public-role-<TIMESTAMP>`, `test-s3-wildcard-role-<TIMESTAMP>`

## What Findings Will Be Detected

| Resource | Finding Type | Severity | Description |
|----------|-------------|----------|-------------|
| User with AdministratorAccess | Admin Access | Critical | User has full AWS administrative privileges |
| Role with AdministratorAccess | Admin Access | Critical | Role has full AWS administrative privileges |
| Role with `*` permissions | Wildcard Permissions | Critical | Role has full wildcard permissions |
| Role with public trust policy | Public Access | Critical | Role can be assumed by anyone (`Principal: "*"`) |
| User without MFA | Missing MFA | Medium/High | User has console access but no MFA device |
| Role with `s3:*` | Service Wildcard | High | Role has full S3 service permissions |

## Troubleshooting

### Script fails with "Access Denied"
- Ensure your AWS credentials have permissions to create IAM users, roles, and policies
- Required permissions: `iam:CreateUser`, `iam:CreateRole`, `iam:AttachUserPolicy`, `iam:AttachRolePolicy`, `iam:PutRolePolicy`, `iam:CreateAccessKey`

### Resources already exist
- The script will continue if resources already exist (idempotent)
- To start fresh, use the cleanup script first, then create new resources

### Scanner doesn't detect resources
- Ensure you're scanning the correct AWS region (default: us-east-1)
- Wait a few seconds after creating resources before scanning
- Check CloudWatch logs for the Lambda function if scans fail

