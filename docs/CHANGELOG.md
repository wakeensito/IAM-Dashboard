# Changelog

All notable changes to the IAM Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- DevSecOps security scanning with OPA, Checkov, and Gitleaks
- Docker-based scanning infrastructure
- Cross-platform Makefile for security scans
- Comprehensive documentation structure
- GitHub Actions workflow for automated scanning

### Changed
- Reorganized project structure for maximum organization
- Moved documentation to `docs/` directory
- Moved utility scripts to `scripts/` directory
- Updated all file references to reflect new structure

### Security
- Implemented OPA policy validation for IAM, Terraform, and Kubernetes
- Added Checkov infrastructure security scanning
- Integrated Gitleaks secret detection
- Created comprehensive security policies and configurations

## [0.1.0] - 2025-10-10

### Added
- Initial release of IAM Dashboard
- React frontend with TypeScript
- Flask backend with Python
- PostgreSQL database integration
- Redis caching layer
- Grafana monitoring dashboard
- Prometheus metrics collection
- AWS IAM, EC2, S3, and Security Hub integrations
- Docker Compose orchestration


