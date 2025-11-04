# DynamoDB Table for IAM Dashboard

## 🎯 What This Does

Creates a DynamoDB table to store security scan results from AWS native scanners (Security Hub, GuardDuty, Config, Inspector, Macie) and custom OPA policy scans.

## 📋 Table Structure

- **Table Name**: `iam-dashboard-scan-results`
- **Partition Key**: `scan_id` (String) - Unique identifier for each scan
- **Sort Key**: `timestamp` (String) - Timestamp of the scan
- **Billing Mode**: Pay-per-request (on-demand)

**Note**: The actual deployed table uses `scan_id` as the partition key and `timestamp` as the sort key. This allows efficient queries by scan ID and time-based sorting.

## 🔧 Features

- ✅ Point-in-time recovery (optional, disabled by default)
- ✅ Server-side encryption at rest
- ✅ Optional Global Secondary Index for scanner_type-based queries
- ✅ Deletion protection in production environment
- ✅ Consistent tagging (Project, Env, ManagedBy)

## 📁 Files Created

- `infra/dynamodb/main.tf` - DynamoDB table configuration
- `infra/dynamodb/variables.tf` - Input variables
- `infra/dynamodb/outputs.tf` - Output values
- `infra/dynamodb/README.md` - This file

## 🚀 How to Deploy

```bash
cd infra/dynamodb
terraform init
terraform plan
terraform apply
```

## 📊 Example Data Structure

```json
{
  "scan_id": "scan-2025-01-15-abc123",
  "timestamp": "2025-01-15T10:30:00Z",
  "scanner_type": "security-hub",
  "findings": [...],
  "status": "completed",
  "scan_metadata": {
    "account_id": "123456789012",
    "region": "us-east-1"
  }
}
```

**Key Points**:
- `scan_id` is the partition key (HASH) - uniquely identifies each scan
- `timestamp` is the sort key (RANGE) - allows time-based queries and sorting
- `scanner_type` is a regular attribute that can be indexed via GSI if needed

## 🔄 Optional: Enable Scanner Type Index

To enable querying by scanner type, set the variable:

```hcl
variable "enable_scanner_type_index" {
  default = true
}
```

This creates a Global Secondary Index that allows efficient queries like:
- Get all Security Hub scans from the last 7 days
- Find the most recent scan for each scanner type
- Query all scans by scanner type

The GSI uses `scanner_type` as the partition key and `timestamp` as the sort key.

## 📈 Scaling

- **Pay-per-request**: Automatically scales based on traffic
- No capacity planning needed
- Suitable for variable workloads

## 🔐 Security

- Encryption at rest enabled by default
- IAM-based access control (Lambda function uses IAM role)
- Optional point-in-time recovery for backup/restore capabilities (enable via `enable_point_in_time_recovery = true`)

### Enable Point-in-Time Recovery

If you want to enable point-in-time recovery, set the variable:

```hcl
variable "enable_point_in_time_recovery" {
  default = true
}
```

