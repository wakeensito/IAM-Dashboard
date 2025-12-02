# Diagnostic script to verify AWS setup for Terraform
# This helps identify why Terraform might be using the wrong credentials

Write-Host "`n=== AWS Terraform Setup Diagnostic ===" -ForegroundColor Cyan

# Check 1: AWS CLI installed
Write-Host "`n[1] Checking AWS CLI installation..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "  ✓ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ AWS CLI not found. Install from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Check 2: AWS credentials file exists
Write-Host "`n[2] Checking AWS credentials..." -ForegroundColor Yellow
$credentialsPath = "$env:USERPROFILE\.aws\credentials"
if (Test-Path $credentialsPath) {
    Write-Host "  ✓ Credentials file exists: $credentialsPath" -ForegroundColor Green
    
    # Check for default profile
    $credentials = Get-Content $credentialsPath -Raw
    if ($credentials -match "\[default\]") {
        Write-Host "  ✓ Default profile found in credentials" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No [default] profile found in credentials" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Credentials file not found: $credentialsPath" -ForegroundColor Red
    Write-Host "    Run: aws configure" -ForegroundColor Yellow
}

# Check 3: AWS config file exists
Write-Host "`n[3] Checking AWS config..." -ForegroundColor Yellow
$configPath = "$env:USERPROFILE\.aws\config"
if (Test-Path $configPath) {
    Write-Host "  ✓ Config file exists: $configPath" -ForegroundColor Green
    
    # Check for IAMDash-Developer-Dev profile
    $config = Get-Content $configPath -Raw
    if ($config -match "\[profile IAMDash-Developer-Dev\]") {
        Write-Host "  ✓ IAMDash-Developer-Dev profile found" -ForegroundColor Green
        
        # Extract role ARN
        if ($config -match "role_arn\s*=\s*(.+?)(\r\n|\n)") {
            $roleArn = $matches[1].Trim()
            Write-Host "    Role ARN: $roleArn" -ForegroundColor Gray
        }
        
        # Check source profile
        if ($config -match "source_profile\s*=\s*(.+?)(\r\n|\n)") {
            $sourceProfile = $matches[1].Trim()
            Write-Host "    Source Profile: $sourceProfile" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ✗ IAMDash-Developer-Dev profile not found" -ForegroundColor Red
        Write-Host "    Run: .\setup-aws-profile.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Config file not found: $configPath" -ForegroundColor Red
    Write-Host "    Run: .\setup-aws-profile.ps1" -ForegroundColor Yellow
}

# Check 4: Current AWS identity (without profile)
Write-Host "`n[4] Checking current AWS identity (default)..." -ForegroundColor Yellow
try {
    $defaultIdentity = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
    Write-Host "  Current Identity (default):" -ForegroundColor Gray
    Write-Host "    ARN: $($defaultIdentity.Arn)" -ForegroundColor Gray
    Write-Host "    Account: $($defaultIdentity.Account)" -ForegroundColor Gray
    
    if ($defaultIdentity.Arn -like "*user/cyber-Tu*") {
        Write-Host "  ⚠ Using direct user (cyber-Tu) - this may not have required permissions" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Failed to get identity: $_" -ForegroundColor Red
}

# Check 5: AWS identity with IAMDash-Developer-Dev profile
Write-Host "`n[5] Checking AWS identity with IAMDash-Developer-Dev profile..." -ForegroundColor Yellow
try {
    $profileIdentity = aws sts get-caller-identity --profile IAMDash-Developer-Dev 2>&1 | ConvertFrom-Json
    Write-Host "  Identity with profile:" -ForegroundColor Gray
    Write-Host "    ARN: $($profileIdentity.Arn)" -ForegroundColor Gray
    Write-Host "    Account: $($profileIdentity.Account)" -ForegroundColor Gray
    
    if ($profileIdentity.Arn -like "*assumed-role/IAMDash-Developer-Dev*") {
        Write-Host "  ✓ Successfully using IAMDash-Developer-Dev role" -ForegroundColor Green
    } elseif ($profileIdentity.Arn -like "*user/cyber-Tu*") {
        Write-Host "  ✗ Profile is not assuming role - still using cyber-Tu user" -ForegroundColor Red
        Write-Host "    Possible causes:" -ForegroundColor Yellow
        Write-Host "      - Role trust policy doesn't allow cyber-Tu to assume it" -ForegroundColor Yellow
        Write-Host "      - cyber-Tu user doesn't have sts:AssumeRole permission" -ForegroundColor Yellow
        Write-Host "      - Role doesn't exist" -ForegroundColor Yellow
    } else {
        Write-Host "  ⚠ Unexpected identity format" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Failed to assume role: $_" -ForegroundColor Red
    Write-Host "    This means the profile cannot assume the role." -ForegroundColor Yellow
    Write-Host "    Check:" -ForegroundColor Yellow
    Write-Host "      1. Role exists: IAMDash-Developer-Dev" -ForegroundColor Yellow
    Write-Host "      2. Role trust policy allows cyber-Tu to assume it" -ForegroundColor Yellow
    Write-Host "      3. cyber-Tu user has sts:AssumeRole permission" -ForegroundColor Yellow
}

# Check 6: Environment variable
Write-Host "`n[6] Checking AWS_PROFILE environment variable..." -ForegroundColor Yellow
if ($env:AWS_PROFILE) {
    Write-Host "  ✓ AWS_PROFILE is set to: $env:AWS_PROFILE" -ForegroundColor Green
} else {
    Write-Host "  ⚠ AWS_PROFILE is not set" -ForegroundColor Yellow
    Write-Host "    Set it with: `$env:AWS_PROFILE = 'IAMDash-Developer-Dev'" -ForegroundColor Gray
    Write-Host "    Or run: .\use-developer-role.ps1" -ForegroundColor Gray
}

# Check 7: Terraform configuration
Write-Host "`n[7] Checking Terraform configuration..." -ForegroundColor Yellow
if (Test-Path "main.tf") {
    $mainTf = Get-Content "main.tf" -Raw
    
    # Check provider profile
    if ($mainTf -match 'profile\s*=\s*"IAMDash-Developer-Dev"') {
        Write-Host "  ✓ Provider configured to use IAMDash-Developer-Dev profile" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Provider not configured to use IAMDash-Developer-Dev profile" -ForegroundColor Red
    }
    
    # Check backend profile
    if ($mainTf -match 'backend\s+"s3"') {
        if ($mainTf -match 'profile\s*=\s*"IAMDash-Developer-Dev"') {
            Write-Host "  ✓ Backend configured to use IAMDash-Developer-Dev profile" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Backend may not be configured to use profile" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  ⚠ main.tf not found in current directory" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "To fix permission issues:" -ForegroundColor Yellow
Write-Host "  1. Ensure AWS profile is configured: .\setup-aws-profile.ps1" -ForegroundColor White
Write-Host "  2. Set AWS_PROFILE before running Terraform: .\use-developer-role.ps1" -ForegroundColor White
Write-Host "  3. Verify role assumption works: aws sts get-caller-identity --profile IAMDash-Developer-Dev" -ForegroundColor White
Write-Host "  4. If role assumption fails, contact AWS administrator to:" -ForegroundColor White
Write-Host "     - Verify IAMDash-Developer-Dev role exists" -ForegroundColor Gray
Write-Host "     - Verify role trust policy allows cyber-Tu to assume it" -ForegroundColor Gray
Write-Host "     - Verify cyber-Tu has sts:AssumeRole permission" -ForegroundColor Gray
Write-Host ""







