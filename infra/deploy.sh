#!/bin/bash

# DynamoDB Terraform Deployment Script
# This script deploys DynamoDB tables for the IAM Dashboard

set -e  # Exit on error

echo "=========================================="
echo "IAM Dashboard - DynamoDB Deployment"
echo "=========================================="
echo ""

# Check if AWS credentials are configured
echo "Checking AWS credentials..."
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Error: AWS credentials not configured"
    echo "Please configure AWS credentials or assume the IAMDash-Developer-Dev role"
    exit 1
fi
echo "✅ AWS Account: $AWS_ACCOUNT"
echo ""

# Check if Terraform is installed
echo "Checking Terraform installation..."
if ! command -v terraform &> /dev/null; then
    echo "❌ Error: Terraform not found"
    echo "Please install Terraform: https://www.terraform.io/downloads"
    exit 1
fi
echo "✅ Terraform version: $(terraform version | head -n 1)"
echo ""

# Navigate to infra directory
cd "$(dirname "$0")"

# Initialize Terraform
echo "=========================================="
echo "Step 1: Initializing Terraform"
echo "=========================================="
terraform init
echo ""

# Plan deployment
echo "=========================================="
echo "Step 2: Planning deployment"
echo "=========================================="
terraform plan
echo ""

# Ask for confirmation
echo "=========================================="
echo "Step 3: Deploying resources"
echo "=========================================="
read -p "Do you want to apply these changes? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Apply Terraform
terraform apply -auto-approve
echo ""

# Verify tables
echo "=========================================="
echo "Step 4: Verifying tables"
echo "=========================================="
echo "Listing DynamoDB tables..."
aws dynamodb list-tables --query 'TableNames[?contains(@, `iam-dashboard`)]' --output table

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the table names"
echo "2. Test the tables using the commands in DYNAMODB_SETUP.md"
echo "3. Verify access with your application"

