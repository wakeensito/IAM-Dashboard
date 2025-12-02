# Script to ensure Terraform uses the IAMDash-Developer-Dev role
# Run this before any terraform commands

Write-Host "`n=== Configuring Developer Role for Terraform ===" -ForegroundColor Cyan

# Set AWS_PROFILE environment variable
$env:AWS_PROFILE = "IAMDash-Developer-Dev"
Write-Host "✓ Set AWS_PROFILE to: IAMDash-Developer-Dev" -ForegroundColor Green

# Verify the profile works
Write-Host "`nVerifying role assumption..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --profile IAMDash-Developer-Dev | ConvertFrom-Json
    if ($identity.Arn -like "*assumed-role/IAMDash-Developer-Dev*") {
        Write-Host "✓ Successfully using developer role" -ForegroundColor Green
        Write-Host "  Identity: $($identity.Arn)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Not using developer role!" -ForegroundColor Red
        Write-Host "  Current: $($identity.Arn)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Failed to assume role: $_" -ForegroundColor Red
    exit 1
}

# Verify Terraform configuration
Write-Host "`nChecking Terraform configuration..." -ForegroundColor Yellow
if (Test-Path "main.tf") {
    $profileInConfig = Get-Content main.tf | Select-String -Pattern 'profile = "IAMDash-Developer-Dev"'
    if ($profileInConfig) {
        Write-Host "✓ Terraform configured to use IAMDash-Developer-Dev profile" -ForegroundColor Green
    } else {
        Write-Host "⚠ Terraform config may not specify profile" -ForegroundColor Yellow
    }
}

Write-Host "`n=== Ready to use Terraform ===" -ForegroundColor Green
Write-Host "The AWS_PROFILE environment variable is set for this session." -ForegroundColor Gray
Write-Host "Run terraform commands normally:" -ForegroundColor Yellow
Write-Host "  terraform plan" -ForegroundColor White
Write-Host "  terraform apply" -ForegroundColor White
Write-Host "`nNote: This environment variable only lasts for this PowerShell session." -ForegroundColor Gray
Write-Host "Run this script again if you open a new terminal." -ForegroundColor Gray
