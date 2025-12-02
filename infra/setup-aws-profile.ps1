# Configure AWS Profile for IAMDash-Developer-Dev Role
# This allows Terraform backend to access S3 bucket using the role

$awsConfigPath = "$env:USERPROFILE\.aws\config"
$roleArn = "arn:aws:iam::562559071105:role/IAMDash-Developer-Dev"

# Ensure .aws directory exists
if (-not (Test-Path "$env:USERPROFILE\.aws")) {
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.aws" -Force | Out-Null
}

# Profile configuration
$profileConfig = "[profile IAMDash-Developer-Dev]`nrole_arn = $roleArn`nsource_profile = default`nregion = us-east-1"

# Check if profile already exists
if (-not (Test-Path $awsConfigPath)) {
    Set-Content -Path $awsConfigPath -Value $profileConfig
    Write-Host "✓ Created AWS config with profile" -ForegroundColor Green
}

$existing = Get-Content $awsConfigPath -Raw
if ($existing -match "\[profile IAMDash-Developer-Dev\]") {
    Write-Host "✓ Profile already exists in AWS config" -ForegroundColor Green
}

if ($existing -notmatch "\[profile IAMDash-Developer-Dev\]") {
    Add-Content -Path $awsConfigPath -Value "`n$profileConfig"
    Write-Host "✓ Profile added to AWS config" -ForegroundColor Green
}

Write-Host "`nAWS Profile Configuration:" -ForegroundColor Cyan
Write-Host "  Profile Name: IAMDash-Developer-Dev" -ForegroundColor White
Write-Host "  Role ARN: $roleArn" -ForegroundColor White
Write-Host "  Source Profile: default" -ForegroundColor White

Write-Host "`n✓ Backend is now configured to use this profile" -ForegroundColor Green
Write-Host "Run: terraform init" -ForegroundColor Yellow
