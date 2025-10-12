# Contributing to IAM Dashboard

Thank you for your interest in contributing to the IAM Dashboard project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git installed
- Basic familiarity with command line
- Understanding of cybersecurity concepts

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/IAM-Dashboard.git
   cd IAM-Dashboard
   ```

2. **Set up development environment**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Run security scans
   make scan
   ```

3. **Verify everything is working**
   - Main Dashboard: http://localhost:5001
   - Grafana: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the coding standards below
- Add tests for new functionality
- Update documentation as needed
- Run security scans: `make scan`

### 3. Test Your Changes

```bash
# Run all tests
docker-compose exec app pytest

# Run security scans
make scan

# Check for linting issues
npm run lint  # Frontend
pytest --flake8  # Backend
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new security scanning feature"
git commit -m "fix: resolve OPA policy validation issue"
git commit -m "docs: update API documentation"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## 🎯 Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for all functions and classes
- Use Black for code formatting
- Use pytest for testing

```python
def analyze_iam_policy(policy: dict) -> dict:
    """
    Analyze IAM policy for security issues.
    
    Args:
        policy: IAM policy dictionary
        
    Returns:
        Dictionary containing analysis results
    """
    # Implementation here
    pass
```

### TypeScript/React (Frontend)

- Use ESLint and Prettier
- Follow React best practices
- Use TypeScript strict mode
- Write unit tests with Jest/React Testing Library

```typescript
interface SecurityFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const SecurityDashboard: React.FC = () => {
  // Component implementation
  return <div>Dashboard content</div>;
};
```

### Documentation

- Use clear, concise language
- Include code examples where helpful
- Update relevant documentation files
- Follow markdown best practices

## 🔒 Security Guidelines

### Before Contributing

1. **Run security scans** before submitting PRs
2. **Never commit secrets** or sensitive information
3. **Follow security best practices** in your code
4. **Review security policies** in `DevSecOps/opa-policies/`

### Security Scanning

```bash
# Run all security scans
make scan

# Run individual scans
make opa         # Policy validation
make checkov     # Infrastructure security
make gitleaks    # Secret detection
```

### Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Contact the security team directly
3. Include detailed information about the vulnerability
4. Allow 90 days for response before public disclosure

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
docker-compose exec app pytest

# Run with coverage
docker-compose exec app pytest --cov=backend

# Run specific test file
docker-compose exec app pytest tests/test_aws_service.py
```

### Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run linting
npm run lint
```

### Integration Testing

```bash
# Test full stack
docker-compose up -d
npm run test:integration
```

## 📝 Documentation

### Required Documentation

- Update `README.md` for major changes
- Add/update API documentation
- Update `docs/` files as needed
- Include inline code comments

### Documentation Structure

```
docs/
├── SCANNERS.md        # Security scanning guide
├── TEAM_SETUP.md      # Team onboarding guide
├── CONTRIBUTING.md    # This file
└── CHANGELOG.md       # Project changelog

DevSecOps/
└── SECURITY.md        # Security policies and practices

infra/
└── README.md          # Infrastructure setup guide

k8s/
└── README.md          # Kubernetes deployment guide
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, Docker version, etc.)
5. **Relevant logs** or error messages

## 💡 Feature Requests

When suggesting features:

1. **Check existing issues** first
2. **Describe the use case** clearly
3. **Explain the expected behavior**
4. **Consider security implications**
5. **Provide mockups** if applicable

## 🔄 Code Review Process

### For Contributors

1. **Address review feedback** promptly
2. **Ask questions** if feedback is unclear
3. **Be open to suggestions** and improvements
4. **Keep PRs focused** and reasonably sized

### For Reviewers

1. **Be constructive** and respectful
2. **Focus on code quality** and security
3. **Test the changes** when possible
4. **Provide clear feedback** and suggestions

## 📞 Getting Help

### Resources

- **Documentation**: Check `docs/` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub discussions for questions
- **Team Chat**: Use your team communication channel

### Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [AWS Security Best Practices](https://aws.amazon.com/security/security-resources/)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to IAM Dashboard! 🚀



