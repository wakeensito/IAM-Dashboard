#!/bin/bash
# Cleanup IAM test resources created by create-iam-test-resources.sh
# Usage: ./cleanup-iam-test-resources.sh <TIMESTAMP>

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <TIMESTAMP>"
    echo "Example: $0 1234567890"
    exit 1
fi

TIMESTAMP=$1

echo "=========================================="
echo "Cleaning up IAM Test Resources"
echo "Timestamp: ${TIMESTAMP}"
echo "=========================================="
echo ""

# Cleanup users
echo "Cleaning up users..."
for USER_NAME in "test-admin-user-${TIMESTAMP}" "test-no-mfa-user-${TIMESTAMP}"; do
    echo "  Removing user: ${USER_NAME}..."
    
    # Detach policies
    aws iam list-attached-user-policies --user-name "${USER_NAME}" --query 'AttachedPolicies[].PolicyArn' --output text 2>/dev/null | \
        xargs -n1 -I{} aws iam detach-user-policy --user-name "${USER_NAME}" --policy-arn {} 2>/dev/null || true
    
    # Delete access keys
    aws iam list-access-keys --user-name "${USER_NAME}" --query 'AccessKeyMetadata[].AccessKeyId' --output text 2>/dev/null | \
        xargs -n1 -I{} aws iam delete-access-key --user-name "${USER_NAME}" --access-key-id {} 2>/dev/null || true
    
    # Delete user
    aws iam delete-user --user-name "${USER_NAME}" 2>/dev/null || {
        echo "    User ${USER_NAME} not found or already deleted"
    }
done
echo ""

# Cleanup roles
echo "Cleaning up roles..."
for ROLE_NAME in "test-admin-role-${TIMESTAMP}" "test-wildcard-role-${TIMESTAMP}" "test-public-role-${TIMESTAMP}" "test-s3-wildcard-role-${TIMESTAMP}"; do
    echo "  Removing role: ${ROLE_NAME}..."
    
    # Delete inline policies
    aws iam list-role-policies --role-name "${ROLE_NAME}" --query 'PolicyNames' --output text 2>/dev/null | \
        xargs -n1 -I{} aws iam delete-role-policy --role-name "${ROLE_NAME}" --policy-name {} 2>/dev/null || true
    
    # Detach managed policies
    aws iam list-attached-role-policies --role-name "${ROLE_NAME}" --query 'AttachedPolicies[].PolicyArn' --output text 2>/dev/null | \
        xargs -n1 -I{} aws iam detach-role-policy --role-name "${ROLE_NAME}" --policy-arn {} 2>/dev/null || true
    
    # Delete role
    aws iam delete-role --role-name "${ROLE_NAME}" 2>/dev/null || {
        echo "    Role ${ROLE_NAME} not found or already deleted"
    }
done
echo ""

echo "=========================================="
echo "Cleanup Complete!"
echo "=========================================="

