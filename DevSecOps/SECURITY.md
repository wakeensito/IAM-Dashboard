# Security Policy for IAM Dashboard

## Overview
This document outlines the security policies and practices implemented for the IAM Dashboard project.

## Security Tools

### 1. Gitleaks - Secret Detection
- **Purpose**: Scans code for accidentally committed secrets
- **Configuration**: `.gitleaks.toml`
- **Triggers**: On every push and pull request
- **Reports**: Available in GitHub Security tab

### 2. Checkov - Infrastructure Security
- **Purpose**: Scans infrastructure code for security misconfigurations
- **Configuration**: `.checkov.yml`
- **Frameworks**: Terraform, CloudFormation, Kubernetes, Dockerfile
- **Reports**: SARIF format in GitHub Security tab

### 3. OPA (Open Policy Agent) - Policy as Code
- **Purpose**: Enforces security policies as code
- **Configuration**: `policies/security.rego` and `policies/iam-policies.rego`
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

### Automated Scans
- **Daily**: Scheduled security scans at 2 AM UTC
- **On Push**: Security scans on every push to main/develop
- **On PR**: Security scans on every pull request

### Manual Security Reviews
- **High/Critical Issues**: Must be reviewed and resolved before merge
- **Medium Issues**: Should be addressed within 7 days
- **Low Issues**: Should be addressed within 30 days

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **DO NOT** create a public issue
2. Email security issues to: [security@yourcompany.com]
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
