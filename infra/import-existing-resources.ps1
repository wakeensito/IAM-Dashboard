# Script to import existing AWS resources into Terraform state
# Run this when resources already exist in AWS but not in Terraform state

Write-Host "`n=== Importing Existing Resources into Terraform State ===" -ForegroundColor Cyan

# Set AWS profile
$env:AWS_PROFILE = "IAMDash-Developer-Dev"
Write-Host "✓ Set AWS_PROFILE to: IAMDash-Developer-Dev" -ForegroundColor Green

# Get AWS account ID
Write-Host "`nGetting AWS account ID..." -ForegroundColor Yellow
try {
    $accountInfo = aws sts get-caller-identity --profile IAMDash-Developer-Dev | ConvertFrom-Json
    $accountId = $accountInfo.Account
    Write-Host "✓ Account ID: $accountId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get account ID: $_" -ForegroundColor Red
    exit 1
}

# Change to infra directory
if (-not (Test-Path "main.tf")) {
    Write-Host "✗ main.tf not found. Run this script from the infra directory." -ForegroundColor Red
    exit 1
}

Write-Host "`nInitializing Terraform..." -ForegroundColor Yellow
terraform init

Write-Host "`n=== Importing Resources ===" -ForegroundColor Cyan

# 1. Import DynamoDB Table
Write-Host "`n[1] Importing DynamoDB table: iam-dashboard-scan-results" -ForegroundColor Yellow
try {
    terraform import module.dynamodb.aws_dynamodb_table.scan_results iam-dashboard-scan-results
    Write-Host "  ✓ DynamoDB table imported" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ DynamoDB import failed (may already be imported): $_" -ForegroundColor Yellow
}

# 2. Import S3 Bucket
Write-Host "`n[2] Importing S3 bucket: iam-dashboard-project" -ForegroundColor Yellow
try {
    terraform import module.s3.aws_s3_bucket.frontend iam-dashboard-project
    Write-Host "  ✓ S3 bucket imported" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ S3 bucket import failed (may already be imported): $_" -ForegroundColor Yellow
}

# 3. Import Lambda IAM Role
Write-Host "`n[3] Importing Lambda IAM role: iam-dashboard-lambda-role" -ForegroundColor Yellow
try {
    terraform import module.lambda.aws_iam_role.lambda_role iam-dashboard-lambda-role
    Write-Host "  ✓ Lambda IAM role imported" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Lambda IAM role import failed (may already be imported): $_" -ForegroundColor Yellow
}

# 4. Import GitHub Actions IAM Role
Write-Host "`n[4] Importing GitHub Actions IAM role: IAMDash-Deployer-Prod" -ForegroundColor Yellow
try {
    terraform import module.github_actions.aws_iam_role.github_actions_deployer IAMDash-Deployer-Prod
    Write-Host "  ✓ GitHub Actions IAM role imported" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ GitHub Actions IAM role import failed (may already be imported): $_" -ForegroundColor Yellow
}

Write-Host "`n=== Import Complete ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Run: terraform plan" -ForegroundColor White
Write-Host "     This will show any differences between Terraform config and actual resources" -ForegroundColor Gray
Write-Host "  2. Review the plan carefully" -ForegroundColor White
Write-Host "  3. If everything looks good, run: terraform apply" -ForegroundColor White
Write-Host "`nNote: You may need to import additional resources (like S3 bucket configurations," -ForegroundColor Gray
Write-Host "      IAM role policies, etc.) if terraform plan shows they're missing." -ForegroundColor Gray
Write-Host ""







