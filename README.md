# IAM Dashboard

A comprehensive cybersecurity dashboard for AWS cloud security monitoring, compliance tracking, and threat intelligence visualization.

## 🚀 Quick Start

### One-Command Setup

```bash
# 1. Fork the repository on GitHub first
# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/IAM-Dashboard.git

cd "IAM-Dashboard"

# 3. Add upstream remote
git remote add upstream https://github.com/wakeensito/IAM-Dashboard.git

# 4. Start the application
docker-compose up -d
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

## 🌐 Access Points

- **Main Dashboard**: http://localhost:5001
- **Grafana Monitoring**: http://localhost:3000 (admin/admin)
- **Prometheus Metrics**: http://localhost:9090

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

## 📁 Project Structure

```
├── backend/                 # Flask API backend
│   ├── api/                # API endpoints
│   │   ├── aws_iam.py      # IAM security analysis
│   │   ├── aws_ec2.py      # EC2 security analysis
│   │   ├── aws_s3.py       # S3 security analysis
│   │   ├── aws_security_hub.py # Security Hub integration
│   │   ├── aws_config.py   # Config compliance
│   │   ├── grafana.py      # Grafana integration
│   │   └── dashboard.py    # Dashboard API
│   ├── services/          # Business logic
│   │   ├── aws_service.py  # AWS SDK integration
│   │   ├── grafana_service.py # Grafana API
│   │   └── database_service.py # Database operations
│   └── app.py             # Flask application
├── config/                # Configuration files
│   ├── grafana/          # Grafana configuration
│   └── prometheus/       # Prometheus configuration
├── src/                   # React frontend
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   └── lib/              # Frontend utilities
├── docker-compose.yml    # Docker orchestration
├── Dockerfile           # Container definition
└── requirements.txt     # Python dependencies
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

- [Team Setup Guide](TEAM_SETUP.md) - Complete team onboarding
- [API Documentation](docs/api.md) - API endpoint reference
- [AWS Integration Guide](docs/aws-integration.md) - AWS service setup
- [Deployment Guide](docs/deployment.md) - Production deployment

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
