# Cybersecurity Dashboard - Team Setup Guide

## 🚀 Quick Start

Welcome Team ! ! !

### Prerequisites

- Docker and Docker Compose installed
- Python Flask = pip install flask
- Git installed
- Basic familiarity with command line

### One-Command Setup

```bash
# 1. Fork the repository on GitHub first
# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/IAM-Dashboard.git

cd IAM-Dashboard

# 3. Add upstream remote
git remote add upstream https://github.com/wakeensito/IAM-Dashboard.git

# 4. Start the application
docker-compose up -d

# Rebuild containers
docker-compose up --build -d

# Stop services
docker-compose down

# Get Updates

# 1. Make sure you're on your local main branch
git checkout main

# 2. Fetch new commits from the upstream (your main IAM-Dashboard repo)
git fetch upstream

# 3. Merge those upstream changes into your local main
git merge upstream/main

# 4. Push to their personal fork (so GitHub stays in sync)
git push origin main

```

That's it! The dashboard will be available at:
- **Main Dashboard**: http://localhost:5001
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 🔍 DevSecOps Security Scanning

### Quick Security Scan

```bash
# Run all security scans (OPA + Checkov + Gitleaks)
make scan

# Run individual scans
make opa         # OPA policy validation
make checkov     # Infrastructure security scan
make gitleaks    # Secret detection scan
```

### Prerequisites
- Docker and Docker Compose installed (already required for the project)
- No additional tool installation needed

### Troubleshooting
```bash
# Check Docker status
make check-docker

# Clean up containers
make clean-scans
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Flask API     │    │   PostgreSQL   │
│   (React/Vite)  │◄──►│   (Python)      │◄──►│   Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis Cache   │    │   Grafana       │
                       │   (Sessions)    │    │   (Monitoring)  │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Prometheus    │
                       │   (Metrics)     │
                       └─────────────────┘
```

## 🔧 Development Workflow

### For Full-Stack Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
IAM-Dashboard/
├── .github/              # GitHub configuration
│   ├── workflows/        # GitHub Actions workflows
│   │   └── devsecops-scan.yml # Security scanning pipeline
│   └── dependabot.yml    # Automated dependency updates
├── backend/              # Flask API backend
│   ├── api/              # API endpoints
│   ├── services/         # Business logic
│   ├── sql/              # Database initialization
│   └── app.py            # Flask application
├── config/               # Configuration files
│   ├── grafana/          # Grafana configuration
│   └── prometheus/       # Prometheus configuration
├── DevSecOps/            # Security scanning configuration
│   ├── opa-policies/     # OPA policy files
│   ├── .checkov.yml      # Checkov configuration
│   ├── .gitleaks.toml    # Gitleaks configuration
│   └── SECURITY.md       # Security policies
├── docs/                 # Documentation
│   ├── SCANNERS.md       # Security scanning guide
│   ├── TEAM_SETUP.md     # Team onboarding guide
│   ├── CONTRIBUTING.md   # Contribution guidelines
│   └── CHANGELOG.md      # Project changelog
├── infra/                # Infrastructure as Code (Terraform)
│   └── README.md         # Infrastructure setup guide
├── k8s/                  # Kubernetes manifests
│   └── README.md         # Kubernetes deployment guide
├── scripts/              # Utility scripts
│   └── setup.sh          # Setup script
├── src/                  # React frontend
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── guidelines/       # Development guidelines
│   └── styles/           # CSS styles
├── data/                 # Application data directory
├── logs/                 # Application logs directory
├── docker-compose.yml    # Docker orchestration with security scanners
├── Dockerfile           # Multi-stage container definition
├── Makefile             # DevSecOps scanning commands
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
└── env.example          # Environment variables template
```

## 🔐 AWS Integration Setup

### 1. AWS Credentials

Create a `.env` file from `env.example`:

```bash
cp env.example .env
```

Update the AWS credentials in `.env`:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### 2. AWS Services Integration

The dashboard integrates with:
- **IAM**: Identity and access management analysis
- **EC2**: Compute security scanning
- **S3**: Storage security analysis
- **Security Hub**: Centralized security findings
- **Config**: Compliance monitoring

### 3. Required AWS Permissions

Your AWS credentials need these permissions:
- `iam:ListUsers`, `iam:ListRoles`, `iam:ListPolicies`
- `ec2:DescribeInstances`, `ec2:DescribeSecurityGroups`
- `s3:ListBuckets`, `s3:GetBucketEncryption`
- `securityhub:GetFindings`, `securityhub:ListFindings`
- `config:GetComplianceSummaryByConfigRule`

## 📊 Monitoring & Observability

### Grafana Dashboards

Access Grafana at http://localhost:3000:
- Username: `admin`
- Password: `admin`

Pre-configured dashboards:
- System metrics
- Application performance
- Security findings
- Compliance status

### Prometheus Metrics

Access Prometheus at http://localhost:9090:
- Application metrics
- System metrics
- Custom business metrics

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5001, 3000, 5432, 6379, 9090 are available
2. **Docker issues**: Run `docker system prune` to clean up
3. **Permission issues**: Ensure Docker has proper permissions

### Useful Commands

```bash
# Check service status
docker-compose ps

# View specific service logs
docker-compose logs app
docker-compose logs db
docker-compose logs grafana

# Restart a service
docker-compose restart app

# Rebuild containers
docker-compose up --build

# Clean up everything
docker-compose down -v
```

## 👥 Team Collaboration

### Git Workflow

1. **Feature branches**: Create feature branches for new work
2. **Pull requests**: Use PRs for code review
3. **Environment consistency**: All team members use the same Docker setup

### Code Standards

- **Python**: Follow PEP 8, use Black for formatting
- **TypeScript**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages

### Testing

```bash
# Run all tests
docker-compose exec app pytest

# Run specific test file
docker-compose exec app pytest tests/test_aws_service.py

# Run with coverage
docker-compose exec app pytest --cov=backend
```

### Security Scanning

```bash
# Run all security scans
make scan

# Run individual scans
make opa         # OPA policy validation
make checkov     # Infrastructure security scan
make gitleaks    # Secret detection scan

# Check scan results
make show-results
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          docker-compose up -d
          docker-compose exec app pytest
```

## 📈 Performance Optimization

### Production Considerations

1. **Database**: Use managed PostgreSQL (RDS)
2. **Caching**: Use managed Redis (ElastiCache)
3. **Monitoring**: Use CloudWatch for AWS metrics
4. **Security**: Use IAM roles instead of access keys

### Scaling

- **Horizontal scaling**: Use multiple app instances
- **Load balancing**: Use ALB/NLB for traffic distribution
- **Database**: Use read replicas for read-heavy workloads

## 🆘 Support

### Getting Help

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Create GitHub issues for bugs
3. **Discussions**: Use GitHub discussions for questions
4. **Team chat**: Use your team communication channel

### Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)

---

## 🎯 Next Steps

1. **Set up your development environment** using the commands above
2. **Configure AWS credentials** for your team
3. **Run security scans** with `make scan` to understand the DevSecOps setup
4. **Explore the dashboard** and understand the current features
5. **Plan your integrations** with AWS services
6. **Start building** your cybersecurity features!

Happy coding! 🚀
