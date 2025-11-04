# GitHub Actions Workflows

## 🔐 Required Secrets

Before deploying, you must configure the following secrets in GitHub:

### AWS_ROLE_ARN
- **Purpose**: IAM Role ARN for GitHub Actions to assume via OIDC
- **Location**: Repository Settings → Secrets and variables → Actions
- **Format**: `arn:aws:iam::ACCOUNT_ID:role/IAMDash-Deployer-Prod`
- **How to get**: Run `terraform output github_actions_role_arn` after deploying the `infra/github-actions` module

### Setup Instructions

1. Deploy the GitHub Actions OIDC module:
   ```bash
   cd infra/github-actions
   terraform init
   terraform apply
   ```

2. Get the role ARN:
   ```bash
   terraform output github_actions_role_arn
   ```

3. Add to GitHub Secrets:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AWS_ROLE_ARN`
   - Value: The ARN from step 2
   - Click "Add secret"

## 📋 Workflows

### deploy.yml
- **Triggers**: Push and PR to `main` branch
- **Actions**:
  - Deploys infrastructure via Terraform
  - Builds and deploys frontend to S3
  - Updates Lambda function code
- **Secrets Required**: `AWS_ROLE_ARN`

### devsecops-scan.yml
- **Triggers**: Push to any branch
- **Actions**:
  - Runs security scanners (gitleaks, checkov, OPA)
  - Uploads results as artifacts
- **Secrets Required**: None

## 🔒 Security Notes

- Never commit AWS account IDs or ARNs directly in workflow files
- Always use GitHub Secrets for sensitive values
- The OIDC provider ensures GitHub Actions can only assume the role from your repository

