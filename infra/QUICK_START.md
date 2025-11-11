# DynamoDB Quick Start Guide

## 🚀 Deploy in 3 Steps

### Step 1: Configure AWS Credentials

Assume the IAMDash-Developer-Dev role:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::562559071105:role/IAMDash-Developer-Dev \
  --role-session-name dev-session
```

Export the credentials from the response:
```bash
export AWS_ACCESS_KEY_ID="<AccessKeyId>"
export AWS_SECRET_ACCESS_KEY="<SecretAccessKey>"
export AWS_SESSION_TOKEN="<SessionToken>"
```

### Step 2: Deploy DynamoDB Tables

Navigate to the infra directory and run the deployment script:

```bash
cd /Users/alexajimenez/IAM-Dashboard/infra
./deploy.sh
```

Or manually:
```bash
terraform init
terraform plan
terraform apply
```

### Step 3: Test Tables

Verify tables were created:
```bash
aws dynamodb list-tables
```

Test inserting data:
```bash
aws dynamodb put-item \
  --table-name iam-dashboard-scan-results \
  --item '{
    "scan_id": {"S": "test-001"},
    "timestamp": {"S": "2024-01-01T00:00:00Z"},
    "status": {"S": "completed"}
  }'
```

## 📋 Created Tables

| Table Name | Purpose | Key Schema |
|-----------|---------|------------|
| `iam-dashboard-scan-results` | Store scan execution results | scan_id (HASH) + timestamp (RANGE) |
| `iam-dashboard-iam-findings` | Store IAM security findings | finding_id (HASH) + detected_at (RANGE) |
| `iam-dashboard-compliance` | Store compliance status | account_id (HASH) + framework (RANGE) |

## 🛠️ Usage in Application

The Python service is already created at `backend/services/dynamodb_service.py`.

Update your environment variables:
```bash
DYNAMODB_SCAN_RESULTS_TABLE=iam-dashboard-scan-results
DYNAMODB_IAM_FINDINGS_TABLE=iam-dashboard-iam-findings
DYNAMODB_COMPLIANCE_TABLE=iam-dashboard-compliance
AWS_REGION=us-east-1
```

## 🧹 Cleanup

To remove all tables (⚠️ deletes all data):
```bash
terraform destroy
```

## 📚 Full Documentation

See [DYNAMODB_SETUP.md](./DYNAMODB_SETUP.md) for detailed instructions.

