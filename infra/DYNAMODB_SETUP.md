# DynamoDB Setup Guide

This guide walks you through creating and deploying DynamoDB tables for the IAM Dashboard.

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws --version
   aws discover-identity
   ```

2. **Terraform installed** (version >= 1.0)
   ```bash
   terraform version
   ```

3. **AWS credentials configured** for the `IAMDash-Developer-Dev` role
   ```bash
   aws configure
   ```

4. **Assume the role** (if not already done)
   ```bash
   aws sts assume-role \
     --role-arn arn:aws:iam::562559071105:role/IAMDash-Developer-Dev \
     --role-session-name dev-session
   ```

## Step-by-Step Instructions

### Step 1: Navigate to Infrastructure Directory

```bash
cd /Users/alexajimenez/IAM-Dashboard/infra
```

### Step 2: Initialize Terraform

This will download the AWS provider and initialize the working directory.

```bash
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...
...
Terraform has been successfully initialized!
```

### Step 3: Review the Plan

Before applying changes, review what will be created:

```bash
terraform plan
```

This shows you:
- 3 DynamoDB tables will be created:
  - `iam-dashboard-scan-results` (scan ID + timestamp)
  - `iam-dashboard-iam-findings` (findings with GSI)
  - `iam-dashboard-compliance` (account + framework)

### Step 4: Apply Terraform Configuration

Create the DynamoDB tables:

```bash
terraform apply
```

Type `yes` when prompted to confirm.

Expected output:
```
aws_dynamodb_table.compliance_status: Creating...
aws_dynamodb_table.scan_results: Creating...
aws_dynamodb_table.iam_findings: Creating...
...
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
```

### Step 5: Verify Tables Were Created

List all tables:

```bash
aws dynamodb list-tables
```

You should see:
```
iam-dashboard-compliance
iam-dashboard-iam-findings
iam-dashboard-scan-results
```

### Step 6: Describe the Tables

Get details about each table:

```bash
# Scan results table
aws dynamodb describe-table --table-name iam-dashboard-scan-results

# IAM findings table
aws dynamodb describe-table --table-name iam-dashboard-iam-findings

# Compliance table
aws dynamodb describe-table --table-name iam-dashboard-compliance
```

### Step 7: Test Data Operations

#### Test Scan Results Table

**Insert a test item:**
```bash
aws dynamodb put-item \
  --table-name iam-dashboard-scan-results \
  --item '{
    "scan_id": {"S": "test-scan-001"},
    "timestamp": {"S": "2024-01-01T00:00:00Z"},
    "status": {"S": "completed"},
    "scan_type": {"S": "full"},
    "findings_count": {"N": "5"},
    "metadata": {"M": {"source": {"S": "manual"}}}
  }'
```

**Get the item:**
```bash
aws dynamodb get-item \
  --table-name iam-dashboard-scan-results \
  --key '{
    "scan_id": {"S": "test-scan-001"},
    "timestamp": {"S": "2024-01-01T00:00:00Z"}
  }'
```

**Scan the table:**
```bash
aws dynamodb scan --table-name iam-dashboard-scan-results
```

#### Test IAM Findings Table

**Insert a finding:**
```bash
aws dynamodb put-item \
  --table-name iam-dashboard-iam-findings \
  --item '{
    "finding_id": {"S": "finding-001"},
    "detected_at": {"S": "2024-01-01T12:00:00Z"},
    "resource_type": {"S": "user"},
    "resource_id": {"S": "test-user"},
    "severity": {"S": "high"},
    "title": {"S": "User without MFA"},
    "description": {"S": "Test user does not have MFA enabled"},
    "status": {"S": "open"},
    "account_id": {"S": "562559071105"},
    "region": {"S": "us-east-1"}
  }'
```

**Query by resource type:**
```bash
aws dynamodb query \
  --table-name iam-dashboard-iam-findings \
  --index-name resource-index \
  --key-condition-expression "resource_type = :rt" \
  --expression-attribute-values stewardship '{\":rt\":{\"S\":\"user\"}}'
```

#### Test Compliance Table

**Insert compliance status:**
```bash
aws dynamodb put-item \
  --table-name iam-dashboard-compliance \
  --item '{
    "account_id": {"S": "562559071105"},
    "framework": {"S": "CIS"},
    "status": {"S": "compliant"},
    "score": {"N": "95.5"},
    "findings_count": {"N": "2"},
    "last_assessed": {"S": "2024-01-01T00:00:00Z"}
  }'
```

**Get compliance status:**
```bash
aws dynamodb get-item \
  --table-name iam-dashboard-compliance \
  --key '{
    "account_id": {"S": "562559071105"},
    "framework": {"S": "CIS"}
  }'
```

### Step 8: Set Environment Variables

Add these to your `.env` file:

```bash
# DynamoDB Configuration
DYNAMODB_SCAN_RESULTS_TABLE=iam-dashboard-scan-results
DYNAMODB_IAM_FINDINGS_TABLE=iam-dashboard-iam-findings
DYNAMODB_COMPLIANCE_TABLE=iam-dashboard-compliance
AWS_REGION=us-east-1
```

### Step 9: Test with Python Service

Create a test script to verify the Python service works:

```python
# test_dynamodb.py
from services.dynamodb_service import DynamoDBService

service = DynamoDBService()

# Test creating a scan record
scan_data = {
    'scan_id': 'test-scan-002',
    'status': 'completed',
    'scan_type': 'full',
    'findings_count': 10,
    'metadata': {'source': 'automated'}
}
result = service.create_scan_record(scan_data)
print(f"Scan record created: {result}")

# Test creating an IAM finding
finding_data = {
    'finding_id': 'finding-002',
    'resource_type': 'role',
    'resource_id': 'test-role',
    'severity': 'critical',
    'title': 'Role with excessive permissions',
    'description': 'Test role has permissions it should not have',
    'recommendation': 'Review and restrict permissions'
}
result = service.create_iam_finding(finding_data)
print(f"IAM finding created: {result}")

print("DynamoDB test completed successfully!")
```

## Cleanup

To destroy the DynamoDB tables (careful, this deletes all data):

```bash
cd /Users/alexajimenez/IAM-Dashboard/infra
terraform destroy
```

Type `yes` to confirm. **This action cannot be undone.**

## Troubleshooting

### Error: "Access Denied"

Make sure you have assumed the correct role:
```bash
aws sts get-caller-identity
```

### Error: "Table already exists"

If the table already exists, you can either:
1. Delete it manually: `aws dynamodb delete-table --table-name <table-name>`
2. Import it to Terraform state: `terraform import aws_dynamodb_table.<resource_name> <table-name>`

### Error: "Insufficient permissions"

The IAM role needs the following permissions:
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:DeleteItem`

## Success Criteria

✅ All three DynamoDB tables created  
✅ Tables have proper how and range keys  
✅ Can insert and retrieve data  
✅ Properly tagged with Project=IAMDash and Env=dev  
✅ Accessible via IAMDash-Developer-Dev role  
✅ Python service can interact with tables  

## Next Steps

1. Update your application code to use the DynamoDB service
2. Configure monitoring and alarms for the tables
3. Set up backup and disaster recovery
4. Implement data retention policies

