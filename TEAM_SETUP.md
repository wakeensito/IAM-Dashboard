# Cybersecurity Dashboard - Team Setup Guide

## 🚀 Quick Start

Welcome Team ! ! !

### Prerequisites

- Docker and Docker Compose installed
- Git installed
- Basic familiarity with command line

### One-Command Setup

```bash
# 1. Fork the repository on GitHub first
# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/IAM-Dashboard.git

cd "Dashboard"

# 3. Add upstream remote
git remote add upstream https://github.com/wakeensito/IAM-Dashboard.git

# 4. Start the application
docker-compose up -d
```

That's it! The dashboard will be available at:
- **Main Dashboard**: http://localhost:5000
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

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

### For Frontend Developers

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### For Backend Developers

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask development server
python backend/app.py

# Run tests
pytest
```

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
Dashboard/
├── backend/                 # Flask API backend
│   ├── api/                # API endpoints
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   └── utils/             # Utility functions
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

1. **Port conflicts**: Ensure ports 5000, 3000, 5432, 6379, 9090 are available
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
3. **Explore the dashboard** and understand the current features
4. **Plan your integrations** with AWS services
5. **Start building** your cybersecurity features!

Happy coding! 🚀
