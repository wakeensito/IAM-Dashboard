# Terraform PATH Helper
# Run this script to ensure Terraform is available in your PowerShell session

$terraformPath = "C:\Users\TuNgu\AppData\Local\Microsoft\WinGet\Packages\Hashicorp.Terraform_Microsoft.Winget.Source_8wekyb3d8bbwe"

# Add to PATH for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify Terraform works
if (Get-Command terraform -ErrorAction SilentlyContinue) {
    Write-Host "✓ Terraform is available" -ForegroundColor Green
    terraform version
} else {
    Write-Host "✗ Terraform not found. Adding to PATH..." -ForegroundColor Yellow
    $env:Path += ";$terraformPath"
    
    if (Test-Path "$terraformPath\terraform.exe") {
        Write-Host "✓ Terraform added to PATH" -ForegroundColor Green
        terraform version
    } else {
        Write-Host "✗ Terraform not found at expected location" -ForegroundColor Red
        Write-Host "Please reinstall Terraform: winget install HashiCorp.Terraform" -ForegroundColor Yellow
    }
}









