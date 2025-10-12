# IAM Dashboard

A comprehensive cybersecurity dashboard for AWS cloud security monitoring, compliance tracking, and threat intelligence visualization.

## 🚀 Quick Start

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
```

### Manual Setup

```bash
# Start the entire stack
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🌐 Access Points

- **Main Dashboard**: http://localhost:5001
- **Grafana Monitoring**: http://localhost:3000 (admin/admin)
- **Prometheus Metrics**: http://localhost:9090

## 🔍 Run DevSecOps Scans

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

- Docker and Docker Compose installed
- No local tool installation required

### Troubleshooting

**Docker Issues:**
```bash
# Check Docker status
make check-docker

# Clean up containers
make clean-scans

# Restart Docker service (if needed)
sudo systemctl restart docker  # Linux
sudo service docker restart    # macOS
```

**Permission Issues:**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Reset Docker permissions (macOS)
sudo chown -R $USER ~/.docker
```

**Common Issues:**
- **Port conflicts**: Ensure ports 5001, 3000, 5432, 6379, 9090 are available
- **Docker not running**: Start Docker Desktop or Docker daemon
- **Permission denied**: Check Docker group membership
- **Out of space**: Run `docker system prune` to clean up

## 🏗️ Architecture

This project provides a complete cybersecurity monitoring solution with:

### Frontend (React + TypeScript)
- Modern React dashboard with TypeScript
- Responsive design with dark theme
- Real-time data visualization
- Interactive security analysis tools

### Backend (Flask + Python)
- RESTful API for AWS integrations
- Security scanning and analysis
- Compliance monitoring
- Performance metrics collection

### Infrastructure
- **PostgreSQL**: Primary database for security findings
- **Redis**: Caching and session management
- **Grafana**: Data visualization and monitoring
- **Prometheus**: Metrics collection and alerting

## 🔐 AWS Integrations

### Security Services
- **IAM Analysis**: User, role, and policy security scanning
- **EC2 Security**: Instance and security group analysis
- **S3 Security**: Bucket encryption and access control
- **Security Hub**: Centralized security findings
- **Config**: Compliance and configuration monitoring

### Required AWS Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:ListUsers",
        "iam:ListRoles",
        "iam:ListPolicies",
        "ec2:DescribeInstances",
        "ec2:DescribeSecurityGroups",
        "s3:ListBuckets",
        "s3:GetBucketEncryption",
        "securityhub:GetFindings",
        "config:GetComplianceSummaryByConfigRule"
      ],
      "Resource": "*"
    }
  ]
}
```

## 📊 Features

### Security Dashboard
- Real-time security findings overview
- Compliance status tracking
- Risk assessment and scoring
- Automated security recommendations

### AWS Service Analysis
- **IAM Security**: MFA enforcement, access key rotation
- **EC2 Security**: Encryption status, security group analysis
- **S3 Security**: Public access blocking, encryption verification
- **Network Security**: VPC configuration analysis

### Monitoring & Alerting
- Grafana dashboards for system metrics
- Prometheus metrics collection
- Custom security alerts
- Performance monitoring

### Compliance Tracking
- SOC2, PCI-DSS, HIPAA compliance
- Automated compliance scoring
- Regulatory reporting
- Audit trail management

## 🛠️ Development

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Development
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask development server
python backend/app.py

# Run tests
pytest
```

### Full-Stack Development
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
├── .github/              # GitHub configuration
│   ├── workflows/        # GitHub Actions workflows
│   │   └── devsecops-scan.yml # Security scanning pipeline
│   └── dependabot.yml    # Automated dependency updates
├── backend/              # Flask API backend
│   ├── api/              # API endpoints
│   │   ├── aws_iam.py    # IAM security analysis
│   │   ├── aws_ec2.py    # EC2 security analysis
│   │   ├── aws_s3.py     # S3 security analysis
│   │   ├── aws_security_hub.py # Security Hub integration
│   │   ├── aws_config.py # Config compliance
│   │   ├── grafana.py    # Grafana integration
│   │   ├── dashboard.py  # Dashboard API
│   │   └── health.py     # Health check endpoint
│   ├── services/         # Business logic
│   │   ├── aws_service.py # AWS SDK integration
│   │   ├── grafana_service.py # Grafana API
│   │   └── database_service.py # Database operations
│   ├── sql/              # Database initialization
│   │   └── init.sql      # Database schema
│   └── app.py            # Flask application
├── config/               # Configuration files
│   ├── grafana/          # Grafana configuration
│   │   ├── provisioning/ # Auto-provisioning configs
│   │   └── dashboards/   # Custom dashboards
│   └── prometheus/       # Prometheus configuration
│       └── prometheus.yml # Prometheus config
├── DevSecOps/            # Security scanning and policies
│   ├── opa-policies/     # OPA policy files
│   │   ├── iam-policies.rego # IAM security policies
│   │   ├── security.rego # General security policies
│   │   ├── terraform.rego # Terraform policies
│   │   └── kubernetes.rego # Kubernetes policies
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
│   │   ├── ui/           # Reusable UI components
│   │   └── figma/        # Figma design components
│   ├── hooks/            # Custom React hooks
│   ├── guidelines/       # Development guidelines
│   ├── styles/           # CSS styles
│   ├── App.tsx           # Main React app
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── data/                 # Application data directory
├── logs/                 # Application logs directory
├── docker-compose.yml    # Docker orchestration with security scanners
├── Dockerfile           # Multi-stage container definition
├── Makefile             # DevSecOps scanning commands
├── requirements.txt     # Python dependencies
├── package.json         # Node.js dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── env.example          # Environment variables template
```

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db:5432/cybersecurity_db
REDIS_URL=redis://redis:6379/0

# Security Configuration
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

### Grafana Configuration
- Pre-configured datasources for Prometheus, PostgreSQL, Redis
- Custom dashboards for security metrics
- Automated provisioning

### Prometheus Configuration
- Application metrics collection
- System metrics monitoring
- Custom security metrics

## 🧪 Testing

### Run Tests
```bash
# Run all tests
docker-compose exec app pytest

# Run specific test file
docker-compose exec app pytest tests/test_aws_service.py

# Run with coverage
docker-compose exec app pytest --cov=backend
```

### Test Coverage
- Unit tests for all API endpoints
- Integration tests for AWS services
- End-to-end tests for critical workflows

## 📈 Performance

### Optimization
- Redis caching for frequently accessed data
- Database indexing for query performance
- Async processing for long-running tasks
- Connection pooling for database access

### Monitoring
- Application performance metrics
- System resource monitoring
- Database performance tracking
- API response time monitoring

## 🔒 Security

### Security Features
- JWT-based authentication
- Role-based access control
- API rate limiting
- Input validation and sanitization
- Secure credential management

### Best Practices
- Environment variable configuration
- Secure database connections
- HTTPS enforcement
- Security headers
- Audit logging

## 🚀 Deployment

### Production Deployment
1. Use managed databases (RDS, ElastiCache)
2. Configure load balancers
3. Set up monitoring and alerting
4. Implement backup strategies
5. Configure security groups

### Scaling
- Horizontal scaling with multiple app instances
- Database read replicas
- CDN for static assets
- Auto-scaling based on metrics

## 📚 Documentation

- [Team Setup Guide](docs/TEAM_SETUP.md) - Complete team onboarding
- [Security Scanning Guide](docs/SCANNERS.md) - DevSecOps scanning setup
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute to the project
- [Security Policies](DevSecOps/SECURITY.md) - Security policies and practices
- [Infrastructure Guide](infra/README.md) - Infrastructure as Code setup
- [Kubernetes Guide](k8s/README.md) - Kubernetes deployment guide
- [API Documentation](docs/api.md) - API endpoint reference (coming soon)
- [AWS Integration Guide](docs/aws-integration.md) - AWS service setup (coming soon)
- [Deployment Guide](docs/deployment.md) - Production deployment (coming soon)

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Submit pull request
5. Code review
6. Merge to main

### Code Standards
- Python: PEP 8, Black formatting
- TypeScript: ESLint, Prettier
- Commits: Conventional commit messages
- Documentation: Inline comments and docstrings

## 📞 Support

### Getting Help
- Check documentation and inline comments
- Create GitHub issues for bugs
- Use GitHub discussions for questions
- Team communication channels

### Useful Resources
- [Docker Documentation](https://docs.docker.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS Security services for comprehensive cloud security
- Grafana for powerful data visualization
- React and TypeScript communities
- Open source security tools and libraries

---

**Ready to secure your AWS infrastructure?** 🚀

Start with `./setup.sh` and begin your cybersecurity journey!
