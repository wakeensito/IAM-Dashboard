# Create S3 Bucket for Terraform Backend
# This script assumes the IAMDash-Developer-Dev role and creates the S3 bucket

$roleArn = "arn:aws:iam::562559071105:role/IAMDash-Developer-Dev"
$bucketName = "iam-dashboard-project"
$region = "us-east-1"

Write-Host "`n=== Creating S3 Bucket for Terraform Backend ===" -ForegroundColor Green
Write-Host "Role: $roleArn" -ForegroundColor Cyan
Write-Host "Bucket: $bucketName`n" -ForegroundColor Cyan

# Assume role
Write-Host "Assuming role..." -ForegroundColor Yellow
try {
    $assumeRoleResult = aws sts assume-role --role-arn $roleArn --role-session-name "bucket-create" --duration-seconds 900
    $creds = $assumeRoleResult | ConvertFrom-Json
    
    if ($creds.Credentials) {
        Write-Host "✓ Role assumed successfully" -ForegroundColor Green
        
        # Set environment variables
        $env:AWS_ACCESS_KEY_ID = $creds.Credentials.AccessKeyId
        $env:AWS_SECRET_ACCESS_KEY = $creds.Credentials.SecretAccessKey
        $env:AWS_SESSION_TOKEN = $creds.Credentials.SessionToken
        
        # Create bucket
        Write-Host "`nCreating S3 bucket..." -ForegroundColor Yellow
        $bucketResult = aws s3 mb "s3://$bucketName" --region $region 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Bucket created successfully" -ForegroundColor Green
            
            # Enable versioning
            Write-Host "Enabling versioning..." -ForegroundColor Yellow
            aws s3api put-bucket-versioning --bucket $bucketName --versioning-configuration Status=Enabled --region $region | Out-Null
            Write-Host "✓ Versioning enabled" -ForegroundColor Green
            
            # Enable encryption
            Write-Host "Enabling encryption..." -ForegroundColor Yellow
            $encryptionConfig = @{
                Rules = @(
                    @{
                        ApplyServerSideEncryptionByDefault = @{
                            SSEAlgorithm = "AES256"
                        }
                    }
                )
            } | ConvertTo-Json
            
            aws s3api put-bucket-encryption --bucket $bucketName --server-side-encryption-configuration $encryptionConfig --region $region | Out-Null
            Write-Host "✓ Encryption enabled" -ForegroundColor Green
            
            Write-Host "`n✓ Bucket ready! You can now run: terraform init" -ForegroundColor Cyan
        } else {
            if ($bucketResult -like "*BucketAlreadyExists*") {
                Write-Host "✓ Bucket already exists" -ForegroundColor Green
                Write-Host "`nBucket ready! You can now run: terraform init" -ForegroundColor Cyan
            } else {
                Write-Host "✗ Bucket creation failed: $bucketResult" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "✗ Failed to assume role" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

# Reset credentials (optional - comment out if you want to keep using the role)
$env:AWS_ACCESS_KEY_ID = ""
$env:AWS_SECRET_ACCESS_KEY = ""
$env:AWS_SESSION_TOKEN = ""








