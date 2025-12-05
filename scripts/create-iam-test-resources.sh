#!/bin/bash
# Create IAM test resources that will trigger security findings
# These resources are designed to be detected by the IAM scanner

set -e

TIMESTAMP=$(date +%s)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=${AWS_REGION:-us-east-1}

echo "=========================================="
echo "Creating IAM Test Resources"
echo "Account ID: ${ACCOUNT_ID}"
echo "Region: ${REGION}"
echo "=========================================="
echo ""

# 1. Create User with AdministratorAccess (Critical Finding)
echo "1. Creating test user with AdministratorAccess..."
USER_NAME="test-admin-user-${TIMESTAMP}"
aws iam create-user --user-name "${USER_NAME}" 2>/dev/null || {
    echo "   User ${USER_NAME} might already exist, continuing..."
}
aws iam attach-user-policy \
    --user-name "${USER_NAME}" \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess 2>/dev/null || {
    echo "   Policy might already be attached, continuing..."
}
echo "   ✓ Created user: ${USER_NAME} with AdministratorAccess"
echo ""

# 2. Create Role with AdministratorAccess (Critical Finding)
echo "2. Creating test role with AdministratorAccess..."
ROLE_NAME="test-admin-role-${TIMESTAMP}"
cat > /tmp/trust-policy-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document file:///tmp/trust-policy-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Role ${ROLE_NAME} might already exist, continuing..."
}

aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess 2>/dev/null || {
    echo "   Policy might already be attached, continuing..."
}
echo "   ✓ Created role: ${ROLE_NAME} with AdministratorAccess"
echo ""

# 3. Create Role with Wildcard Permissions (Critical Finding)
echo "3. Creating test role with wildcard permissions..."
WILDCARD_ROLE_NAME="test-wildcard-role-${TIMESTAMP}"
cat > /tmp/trust-policy-wildcard-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
    --role-name "${WILDCARD_ROLE_NAME}" \
    --assume-role-policy-document file:///tmp/trust-policy-wildcard-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Role ${WILDCARD_ROLE_NAME} might already exist, continuing..."
}

cat > /tmp/wildcard-policy-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
  }]
}
EOF

aws iam put-role-policy \
    --role-name "${WILDCARD_ROLE_NAME}" \
    --policy-name WildcardPolicy \
    --policy-document file:///tmp/wildcard-policy-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Policy might already exist, continuing..."
}
echo "   ✓ Created role: ${WILDCARD_ROLE_NAME} with wildcard permissions (*)"
echo ""

# 4. Create Role with Public Access Trust Policy (Critical Finding)
echo "4. Creating test role with public access trust policy..."
PUBLIC_ROLE_NAME="test-public-role-${TIMESTAMP}"
cat > /tmp/public-trust-policy-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
    --role-name "${PUBLIC_ROLE_NAME}" \
    --assume-role-policy-document file:///tmp/public-trust-policy-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Role ${PUBLIC_ROLE_NAME} might already exist, continuing..."
}
echo "   ✓ Created role: ${PUBLIC_ROLE_NAME} with public access (wildcard principal)"
echo ""

# 5. Create User without MFA (Medium/High Finding)
echo "5. Creating test user without MFA..."
NO_MFA_USER_NAME="test-no-mfa-user-${TIMESTAMP}"
aws iam create-user --user-name "${NO_MFA_USER_NAME}" 2>/dev/null || {
    echo "   User ${NO_MFA_USER_NAME} might already exist, continuing..."
}

# Create access key (this will trigger finding for users without MFA)
aws iam create-access-key --user-name "${NO_MFA_USER_NAME}" 2>/dev/null || {
    echo "   Access key might already exist, continuing..."
}
echo "   ✓ Created user: ${NO_MFA_USER_NAME} without MFA"
echo ""

# 6. Create Role with Service-Wide Wildcard (High Finding)
echo "6. Creating test role with service-wide wildcard (s3:*)..."
S3_WILDCARD_ROLE_NAME="test-s3-wildcard-role-${TIMESTAMP}"
cat > /tmp/trust-policy-s3-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
    --role-name "${S3_WILDCARD_ROLE_NAME}" \
    --assume-role-policy-document file:///tmp/trust-policy-s3-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Role ${S3_WILDCARD_ROLE_NAME} might already exist, continuing..."
}

cat > /tmp/s3-wildcard-policy-${TIMESTAMP}.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:*",
    "Resource": "*"
  }]
}
EOF

aws iam put-role-policy \
    --role-name "${S3_WILDCARD_ROLE_NAME}" \
    --policy-name S3WildcardPolicy \
    --policy-document file:///tmp/s3-wildcard-policy-${TIMESTAMP}.json 2>/dev/null || {
    echo "   Policy might already exist, continuing..."
}
echo "   ✓ Created role: ${S3_WILDCARD_ROLE_NAME} with service-wide wildcard (s3:*)"
echo ""

# Cleanup temp files
rm -f /tmp/trust-policy-${TIMESTAMP}.json
rm -f /tmp/trust-policy-wildcard-${TIMESTAMP}.json
rm -f /tmp/trust-policy-s3-${TIMESTAMP}.json
rm -f /tmp/wildcard-policy-${TIMESTAMP}.json
rm -f /tmp/s3-wildcard-policy-${TIMESTAMP}.json
rm -f /tmp/public-trust-policy-${TIMESTAMP}.json

echo "=========================================="
echo "IAM Test Resources Created Successfully!"
echo "=========================================="
echo ""
echo "Resources created:"
echo "  - User: ${USER_NAME} (AdministratorAccess - Critical)"
echo "  - Role: ${ROLE_NAME} (AdministratorAccess - Critical)"
echo "  - Role: ${WILDCARD_ROLE_NAME} (Wildcard permissions - Critical)"
echo "  - Role: ${PUBLIC_ROLE_NAME} (Public access - Critical)"
echo "  - User: ${NO_MFA_USER_NAME} (No MFA - Medium/High)"
echo "  - Role: ${S3_WILDCARD_ROLE_NAME} (Service-wide wildcard - High)"
echo ""
echo "Next steps:"
echo "  1. Go to your IAM Dashboard"
echo "  2. Navigate to 'IAM & Access' tab"
echo "  3. Click 'Start Scan'"
echo "  4. The scan should detect these resources as security findings"
echo ""
echo "To clean up these resources later, run:"
echo "  ./scripts/cleanup-iam-test-resources.sh ${TIMESTAMP}"
echo ""

