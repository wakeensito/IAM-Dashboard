# Kubernetes Manifests

This directory contains Kubernetes manifests for the IAM Dashboard.

## Overview

This directory is set up for future Kubernetes deployment. Currently, the IAM Dashboard runs in Docker containers, but this directory will contain:

- **Deployment manifests** for application components
- **Service definitions** for networking
- **ConfigMaps and Secrets** for configuration
- **Ingress resources** for external access
- **RBAC policies** for security

## Current Status

⚠️ **This directory is currently empty and not used for deployment.**

The IAM Dashboard is currently deployed using Docker Compose for local development and testing.

## Future Plans

When ready to deploy to Kubernetes, this directory will contain:

```
k8s/
├── namespace.yaml       # Namespace definition
├── configmap.yaml      # Configuration data
├── secrets.yaml        # Sensitive data (encrypted)
├── deployment.yaml     # Application deployment
├── service.yaml        # Service definition
├── ingress.yaml        # External access
├── rbac.yaml          # Role-based access control
├── monitoring/         # Monitoring resources
│   ├── prometheus.yaml
│   └── grafana.yaml
└── security/          # Security policies
    ├── network-policies.yaml
    └── pod-security-policies.yaml
```

## Security Scanning

This directory will be scanned by:
- **Checkov** - Kubernetes security scanning
- **OPA** - Policy validation using Kubernetes policies
- **kube-score** - Kubernetes best practices
- **Polaris** - Kubernetes configuration validation

## Getting Started

When ready to use this directory:

1. Install kubectl: https://kubernetes.io/docs/tasks/tools/
2. Configure cluster access
3. Apply manifests: `kubectl apply -f k8s/`
4. Check status: `kubectl get pods -n iam-dashboard`

## Security Notes

- Use Kubernetes secrets for sensitive data
- Enable RBAC for all resources
- Apply network policies for micro-segmentation
- Use Pod Security Standards
- Enable admission controllers
- Regular security scanning and updates

## Scalability Considerations

This directory is designed for future scalability when the IAM Dashboard needs to:
- Handle increased load
- Scale horizontally
- Integrate with Kubernetes ecosystem
- Support multi-tenant deployments



