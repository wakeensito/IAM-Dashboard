# Security Policy for IAM Dashboard

## Overview
This document outlines the security policies and practices implemented for the IAM Dashboard project.

## Security Tools

### 1. Gitleaks - Secret Detection
- **Purpose**: Scans code for accidentally committed secrets
- **Configuration**: `DevSecOps/.gitleaks.toml`
- **Triggers**: On every push and pull request
- **Reports**: Available in GitHub Security tab

### 2. Checkov - Infrastructure Security
- **Purpose**: Scans infrastructure code for security misconfigurations
- **Configuration**: `DevSecOps/.checkov.yml`
- **Frameworks**: Terraform, CloudFormation, Kubernetes, Dockerfile
- **Reports**: SARIF format in GitHub Security tab

### 3. OPA (Open Policy Agent) - Policy as Code
- **Purpose**: Enforces security policies as code
- **Configuration**: `DevSecOps/opa-policies/security.rego` and `DevSecOps/opa-policies/iam-policies.rego`
- **Policies**: IAM-specific security rules
- **Reports**: Policy evaluation results

## Security Policies

### IAM Security Rules
1. **No Wildcard Permissions**: IAM policies must not use wildcard actions or resources
2. **MFA Required**: Console access requires MFA
3. **Access Key Rotation**: Access keys must be rotated every 90 days
4. **No Root Access**: Policies should not allow root account access
5. **Conditional Access**: Administrative actions must include conditions
6. **Managed Policies**: Prefer managed policies over inline policies

### Code Security Rules
1. **No Secrets in Code**: All secrets must be stored in secure vaults
2. **Dependency Scanning**: Regular scanning for vulnerable dependencies
3. **License Compliance**: Ensure all dependencies have compatible licenses
4. **Code Quality**: Maintain high code quality standards

## Security Workflow

### GitHub Actions Pipeline
Our security scanning is automated through GitHub Actions using the `devsecops-scan.yml` workflow:

- **Daily**: Scheduled security scans at 2 AM UTC
- **On Push**: Security scans on every push to main/develop branches
- **On PR**: Security scans on every pull request
- **Manual**: Can be triggered manually from GitHub Actions tab

### Workflow Components
- **OPA Policy Validation**: Validates security policies in `DevSecOps/opa-policies/`
- **Checkov Infrastructure Scan**: Scans infrastructure code for security misconfigurations
- **Gitleaks Secret Detection**: Detects accidentally committed secrets
- **Local Development Testing**: Tests Makefile commands and project structure
- **Artifact Upload**: Uploads scan results for review

### Local Development
Use the Makefile for local security scanning:
```bash
make scan        # Run all security scans
make opa         # Run OPA policy validation
make checkov     # Run Checkov infrastructure scan
make gitleaks    # Run Gitleaks secret detection
```

### Manual Security Reviews
- **High/Critical Issues**: Must be reviewed and resolved before merge
- **Medium Issues**: Should be addressed within 7 days
- **Low Issues**: Should be addressed within 30 days

### Dependabot Integration
Automated dependency updates are configured via `.github/dependabot.yml`:
- **Python dependencies**: Weekly updates on Mondays
- **GitHub Actions**: Weekly updates for workflow actions
- **Docker dependencies**: Weekly updates for base images
- **Terraform dependencies**: Weekly updates for providers
- **Security team review**: All updates require security team approval

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **DO NOT** create a public issue
2. Reach out via LinkedIn
3. Include detailed information about the vulnerability
4. Allow 90 days for response before public disclosure

## Security Best Practices

### For Developers
1. **Never commit secrets** to version control
2. **Use least privilege** principles for IAM policies
3. **Enable MFA** for all AWS accounts
4. **Rotate access keys** regularly
5. **Review security findings** promptly

### For Infrastructure
1. **Use specific resources** instead of wildcards
2. **Implement conditions** for sensitive actions
3. **Use managed policies** instead of inline policies
4. **Enable CloudTrail** for audit logging
5. **Implement least privilege** access

## Compliance

This security policy helps ensure compliance with:
- **AWS Well-Architected Framework**
- **CIS AWS Foundations Benchmark**
- **SOC 2 Type II**
- **ISO 27001**

## Contact

For security-related questions or concerns:
- **Security Team**: INIT @ FIU Cybersecurity
