#!/bin/bash

# Verification script to compare Terraform configs with actual AWS resources
# Usage: ./verify-resources.sh [region]
# Default region: us-east-1

set -e

REGION="${1:-us-east-1}"
PROJECT_NAME="IAMDash"
ENV="dev"

echo "🔍 Verifying AWS Resources in region: ${REGION}"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if AWS CLI is configured
check_aws_cli() {
    if ! aws sts get-caller-identity &>/dev/null; then
        echo -e "${RED}❌ AWS CLI not configured or credentials not set${NC}"
        echo "Run: aws configure"
        exit 1
    fi
    echo -e "${GREEN}✅ AWS CLI configured${NC}"
    aws sts get-caller-identity --query 'Account' --output text | sed 's/^/   Account ID: /'
    echo ""
}

# Function to verify Lambda
verify_lambda() {
    echo "📦 Lambda Function Verification"
    echo "-------------------------------"
    
    FUNCTION_NAME="iam-dashboard-scanner"
    ROLE_NAME="iam-dashboard-lambda-role"
    
    # Check Lambda function exists
    if aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" &>/dev/null; then
        echo -e "${GREEN}✅ Lambda function '$FUNCTION_NAME' exists${NC}"
        
        # Get function details
        FUNC_INFO=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query 'Configuration' --output json)
        
        RUNTIME=$(echo "$FUNC_INFO" | jq -r '.Runtime // "N/A"')
        ARCHITECTURE=$(echo "$FUNC_INFO" | jq -r '.Architectures[0] // "N/A"')
        TIMEOUT=$(echo "$FUNC_INFO" | jq -r '.Timeout // "N/A"')
        MEMORY=$(echo "$FUNC_INFO" | jq -r '.MemorySize // "N/A"')
        ROLE_ARN=$(echo "$FUNC_INFO" | jq -r '.Role // "N/A"')
        
        echo "   Runtime: $RUNTIME (Expected: python3.13)"
        echo "   Architecture: $ARCHITECTURE (Expected: arm64)"
        echo "   Timeout: ${TIMEOUT}s (Expected: 300)"
        echo "   Memory: ${MEMORY}MB (Expected: 512)"
        echo "   Role: $ROLE_ARN"
        
        # Check environment variables
        ENV_VARS=$(echo "$FUNC_INFO" | jq -r '.Environment.Variables // {}')
        echo "   Environment Variables:"
        echo "$ENV_VARS" | jq -r 'to_entries[] | "      \(.key)=\(.value)"'
        
        # Check tags
        TAGS=$(aws lambda list-tags --resource "$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query 'Configuration.FunctionArn' --output text)" --region "$REGION" --output json 2>/dev/null || echo "{}")
        echo "   Tags:"
        echo "$TAGS" | jq -r '.Tags // {} | to_entries[] | "      \(.key)=\(.value)"'
        
    else
        echo -e "${RED}❌ Lambda function '$FUNCTION_NAME' not found${NC}"
    fi
    
    # Check IAM Role
    echo ""
    echo "🔐 Lambda IAM Role Verification"
    echo "-------------------------------"
    
    if aws iam get-role --role-name "$ROLE_NAME" &>/dev/null; then
        echo -e "${GREEN}✅ IAM Role '$ROLE_NAME' exists${NC}"
        
        ROLE_INFO=$(aws iam get-role --role-name "$ROLE_NAME" --output json)
        ROLE_ARN=$(echo "$ROLE_INFO" | jq -r '.Role.Arn')
        TRUST_POLICY=$(echo "$ROLE_INFO" | jq -r '.Role.AssumeRolePolicyDocument')
        
        echo "   ARN: $ROLE_ARN"
        echo "   Trust Policy (Principal):"
        echo "$TRUST_POLICY" | jq -r '.Statement[0].Principal.Service // "N/A"'
        
        # Check attached policies
        POLICIES=$(aws iam list-role-policies --role-name "$ROLE_NAME" --output json)
        INLINE_POLICIES=$(echo "$POLICIES" | jq -r '.PolicyNames[]')
        
        if [ -n "$INLINE_POLICIES" ]; then
            echo "   Inline Policies:"
            for POLICY in $INLINE_POLICIES; do
                echo "      - $POLICY"
            done
        fi
        
        # Check tags
        ROLE_TAGS=$(aws iam list-role-tags --role-name "$ROLE_NAME" --output json 2>/dev/null || echo "{\"Tags\":[]}")
        echo "   Tags:"
        echo "$ROLE_TAGS" | jq -r '.Tags[]? | "      \(.Key)=\(.Value)"' || echo "      (no tags)"
        
    else
        echo -e "${RED}❌ IAM Role '$ROLE_NAME' not found${NC}"
    fi
    
    echo ""
}

# Function to verify DynamoDB
verify_dynamodb() {
    echo "🗄️  DynamoDB Table Verification"
    echo "-------------------------------"
    
    TABLE_NAME="iam-dashboard-scan-results"
    
    if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" &>/dev/null; then
        echo -e "${GREEN}✅ DynamoDB table '$TABLE_NAME' exists${NC}"
        
        TABLE_INFO=$(aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" --output json)
        
        BILLING_MODE=$(echo "$TABLE_INFO" | jq -r '.Table.BillingModeSummary.BillingMode // .Table.BillingMode // "N/A"')
        KEY_SCHEMA=$(echo "$TABLE_INFO" | jq -r '.Table.KeySchema[] | "\(.AttributeName) (\(.KeyType))"')
        ENCRYPTION=$(echo "$TABLE_INFO" | jq -r '.Table.SSEDescription.Status // .Table.SSEDescription // "N/A"')
        PITR=$(echo "$TABLE_INFO" | jq -r '.Table.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus // "N/A"')
        DELETION_PROTECTION=$(echo "$TABLE_INFO" | jq -r '.Table.DeletionProtectionEnabled // false')
        
        echo "   Billing Mode: $BILLING_MODE (Expected: PAY_PER_REQUEST)"
        echo "   Key Schema:"
        echo "$KEY_SCHEMA" | sed 's/^/      /'
        echo "   Encryption: $ENCRYPTION (Expected: ENABLED)"
        echo "   Point-in-Time Recovery: $PITR (Expected: ENABLED)"
        echo "   Deletion Protection: $DELETION_PROTECTION (Expected: false for dev)"
        
        # Check Global Secondary Indexes
        GSI_COUNT=$(echo "$TABLE_INFO" | jq -r '.Table.GlobalSecondaryIndexes | length // 0')
        echo "   Global Secondary Indexes: $GSI_COUNT"
        if [ "$GSI_COUNT" -gt 0 ]; then
            echo "$TABLE_INFO" | jq -r '.Table.GlobalSecondaryIndexes[] | "      - \(.IndexName)"'
        fi
        
        # Check tags
        TAGS=$(aws dynamodb list-tags-of-resource --resource-arn "$(echo "$TABLE_INFO" | jq -r '.Table.TableArn')" --region "$REGION" --output json 2>/dev/null || echo "{\"Tags\":[]}")
        echo "   Tags:"
        echo "$TAGS" | jq -r '.Tags[]? | "      \(.Key)=\(.Value)"' || echo "      (no tags)"
        
    else
        echo -e "${RED}❌ DynamoDB table '$TABLE_NAME' not found${NC}"
    fi
    
    echo ""
}

# Function to verify S3
verify_s3() {
    echo "🪣 S3 Bucket Verification"
    echo "------------------------"
    
    BUCKET_NAME="iam-dashboard-project"
    
    # Check if bucket exists
    if aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" &>/dev/null 2>&1; then
        echo -e "${GREEN}✅ S3 bucket '$BUCKET_NAME' exists${NC}"
        
        # Get bucket details
        BUCKET_INFO=$(aws s3api get-bucket-versioning --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null || echo "{}")
        VERSIONING=$(echo "$BUCKET_INFO" | jq -r '.Status // "Not configured"')
        
        # Get encryption
        ENCRYPTION=$(aws s3api get-bucket-encryption --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null || echo "{}")
        ENCRYPTION_ALGO=$(echo "$ENCRYPTION" | jq -r '.ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm // "Not configured"')
        
        # Get public access block
        PUBLIC_ACCESS=$(aws s3api get-public-access-block --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null || echo "{}")
        BLOCK_PUBLIC_ACLS=$(echo "$PUBLIC_ACCESS" | jq -r '.PublicAccessBlockConfiguration.BlockPublicAcls // "Not configured"')
        
        echo "   Versioning: $VERSIONING (Expected: Enabled)"
        echo "   Encryption: $ENCRYPTION_ALGO (Expected: AES256)"
        echo "   Block Public ACLs: $BLOCK_PUBLIC_ACLS (Expected: true)"
        
        # Get bucket location
        LOCATION=$(aws s3api get-bucket-location --bucket "$BUCKET_NAME" --region "$REGION" --output text 2>/dev/null || echo "N/A")
        echo "   Region: ${LOCATION:-us-east-1}"
        
        # Get tags
        TAGS=$(aws s3api get-bucket-tagging --bucket "$BUCKET_NAME" --region "$REGION" --output json 2>/dev/null || echo "{\"TagSet\":[]}")
        echo "   Tags:"
        echo "$TAGS" | jq -r '.TagSet[]? | "      \(.Key)=\(.Value)"' || echo "      (no tags)"
        
        # Check if website hosting is configured
        WEBSITE=$(aws s3api get-bucket-website --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null || echo "{}")
        INDEX_DOC=$(echo "$WEBSITE" | jq -r '.IndexDocument.Suffix // "Not configured"')
        if [ "$INDEX_DOC" != "Not configured" ]; then
            echo "   Website Hosting: Enabled (Index: $INDEX_DOC)"
            WEBSITE_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
            echo "   Website URL: $WEBSITE_URL"
        else
            echo "   Website Hosting: Not configured"
        fi
        
    else
        echo -e "${RED}❌ S3 bucket '$BUCKET_NAME' not found${NC}"
    fi
    
    echo ""
}

# Main execution
check_aws_cli
verify_lambda
verify_dynamodb
verify_s3

echo "================================================"
echo -e "${GREEN}✅ Verification complete!${NC}"
echo ""
echo "💡 Tip: Compare the values above with your Terraform configurations"
echo "   If anything doesn't match, you may need to update either:"
echo "   1. The AWS resources manually, or"
echo "   2. The Terraform configurations to match what's deployed"

