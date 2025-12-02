# Test CloudWatch Integration in AWS
# This script tests the CloudWatch integration after deployment

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$LambdaName = "iam-dashboard-scanner"
)

$ErrorActionPreference = "Continue"
$ACCOUNT_ID = "562559071105"
$NAMESPACE = "IAMDash/dev"

Write-Host "`n=== Testing CloudWatch Integration in AWS ===" -ForegroundColor Green
Write-Host "Account: $ACCOUNT_ID" -ForegroundColor Cyan
Write-Host "Region: $Region`n" -ForegroundColor Cyan

# 1. Test Lambda Invocation
Write-Host "1. Testing Lambda Function..." -ForegroundColor Yellow
try {
    $testPayload = '{\"scanner_type\":\"iam\",\"region\":\"us-east-1\"}'
    
    $response = aws lambda invoke `
        --function-name $LambdaName `
        --payload $testPayload `
        --region $Region `
        response.json 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        if (Test-Path response.json) {
            $result = Get-Content response.json | ConvertFrom-Json
            if ($result.statusCode -eq 200) {
                Write-Host "   ✓ Lambda executed successfully" -ForegroundColor Green
            } else {
                Write-Host "   ✗ Lambda execution failed: $($result.statusCode)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "   ✗ Lambda invoke failed" -ForegroundColor Red
        Write-Host "   Make sure Lambda function is deployed: terraform apply" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}

# 2. Wait for metrics
Write-Host "`n2. Waiting for metrics to propagate (2 minutes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

# 3. Check Custom Metrics
Write-Host "`n3. Checking Custom Metrics..." -ForegroundColor Yellow
try {
    $metrics = aws cloudwatch list-metrics `
        --namespace $NAMESPACE `
        --region $Region 2>&1 | ConvertFrom-Json
    
    if ($metrics.Metrics.Count -gt 0) {
        Write-Host "   ✓ Found $($metrics.Metrics.Count) custom metrics:" -ForegroundColor Green
        $metrics.Metrics | ForEach-Object { 
            Write-Host "     - $($_.MetricName)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ✗ No custom metrics found" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error checking metrics: $_" -ForegroundColor Red
}

# 4. Check CloudWatch Dashboard
Write-Host "`n4. Checking CloudWatch Dashboard..." -ForegroundColor Yellow
try {
    $dashboard = aws cloudwatch get-dashboard `
        --dashboard-name "IAMDash-dev-dashboard" `
        --region $Region 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dashboard exists" -ForegroundColor Green
        $dashboardUrl = "https://$Region.console.aws.amazon.com/cloudwatch/home?region=$Region#dashboards:name=IAMDash-dev-dashboard"
        Write-Host "   Dashboard URL: $dashboardUrl" -ForegroundColor Cyan
    } else {
        Write-Host "   ✗ Dashboard not found" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}

# 5. Check CloudWatch Alarms
Write-Host "`n5. Checking CloudWatch Alarms..." -ForegroundColor Yellow
try {
    $alarms = aws cloudwatch describe-alarms `
        --alarm-name-prefix "IAMDash-dev" `
        --region $Region 2>&1 | ConvertFrom-Json
    
    if ($alarms.MetricAlarms.Count -gt 0) {
        Write-Host "   ✓ Found $($alarms.MetricAlarms.Count) alarms:" -ForegroundColor Green
        $alarms.MetricAlarms | ForEach-Object { 
            Write-Host "     - $($_.AlarmName): $($_.StateValue)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ✗ No alarms found" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green









