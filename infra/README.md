# Infrastructure as Code (IaC)

This directory contains Terraform configurations for the IAM Dashboard infrastructure.

## Overview

This directory is set up for future infrastructure management using Terraform. Currently, the IAM Dashboard runs in Docker containers, but this directory will contain:

- **Terraform configurations** for AWS resources
- **Module definitions** for reusable infrastructure components
- **Environment-specific configurations** (dev, staging, prod)
- **State management** files (stored remotely)

## Current Status

✅ **DynamoDB tables are configured and ready for deployment**

The IAM Dashboard infrastructure includes:
- **DynamoDB tables** for scan results, IAM findings, and compliance status
- **Terraform configuration** ready for deployment
- **Python service** for DynamoDB interactions

See [DYNAMODB_SETUP.md](./DYNAMODB_SETUP.md) for deployment instructions.

## Future Plans

When ready to deploy to AWS, this directory will contain:

```
infra/
├── main.tf              # Main Terraform configuration
├── variables.tf         # Input variables
├── outputs.tf          # Output values
├── terraform.tfvars    # Variable values
├── modules/            # Reusable modules
│   ├── vpc/           # VPC module
│   ├── ecs/           # ECS module
│   └── rds/           # RDS module
└── environments/       # Environment-specific configs
    ├── dev/
    ├── staging/
    └── prod/
```

## Security Scanning

This directory will be scanned by:
- **Checkov** - Infrastructure security scanning
- **OPA** - Policy validation using Terraform policies
- **Terraform Plan** - Built-in security checks

## Getting Started

When ready to use this directory:

1. Install Terraform: https://terraform.io/downloads
2. Configure AWS credentials
3. Initialize Terraform: `terraform init`
4. Plan changes: `terraform plan`
5. Apply changes: `terraform apply`

## Security Notes

- Never commit `.terraform/` directory
- Store sensitive values in environment variables
- Use remote state backend for team collaboration
- Enable Terraform Cloud for state management



