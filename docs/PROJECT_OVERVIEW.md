# Project Overview — IAM Dashboard

## 1. High-level summary
IAM Dashboard is a full-stack cybersecurity dashboard focused on AWS security posture, compliance tracking, and threat visualization. It combines a React frontend, Flask backend, containerized services, monitoring (Prometheus/Grafana), persistent storage (Postgres, Redis), and DevSecOps scanning (OPA, Checkov, Gitleaks).

## 2. Purpose and primary use cases
- Continuous visibility over AWS IAM, S3, EC2 security configuration.
- Automated policy checks and infra scanning.
- Centralized findings and compliance scoring.
- Local development via Docker Compose and CI scans via GitHub Actions.

## 3. Architecture & runtime components
- Frontend: React + TypeScript served via the app container (port 5001).
- Backend: Flask API (Python) exposing AWS integrations and scan orchestration.
- Data stores: PostgreSQL (primary), Redis (cache).
- Observability: Prometheus (metrics) + Grafana (dashboards).
- DevSecOps scanning: OPA policies, Checkov (IaC), Gitleaks (secrets) run in containers.
- Orchestration: docker-compose for local dev; infra IaC via Terraform (infra/).

## 4. Important files and directories (what they do)
- `README.md` — project quick start and run instructions.
- `docs/` — user-facing documentation; this file lives here.
- `backend/` — Flask application
  - `backend/app.py` — Flask startup and route registration
  - `backend/api/*.py` — service-specific endpoints (`aws_iam.py`, `aws_ec2.py`, `aws_s3.py`, etc.)
  - `backend/services/` — business logic and AWS SDK wrappers
- `src/` — React frontend source
  - `src/App.tsx`, `src/main.tsx` — app entry points
  - `src/components/` — UI components and visualization
- `docker-compose.yml` — local environment orchestration for all services and scanners
- `Dockerfile` — multi-stage image build for the application
- `Makefile` — developer shortcuts (`make scan`, `make check-docker`, etc.)
- `DevSecOps/`
  - `opa-policies/` — Rego policies for OPA
  - `.checkov.yml` — Checkov rules
  - `.gitleaks.toml` — Gitleaks rules
- `infra/` — Terraform code (infrastructure provisioning)
- `env.example` — environment variable template; copy to `.env`
- `.github/workflows/devsecops-scan.yml` — CI pipeline for security scans

## 5. How to run locally (quick)
1. Copy `env.example` -> `.env` and fill required values.
2. Start services:
   - `docker-compose up -d`
3. Access UI: `http://localhost:5001`
4. Run scans:
   - `make scan`

Windows notes:
- Prefer Git Bash or WSL for POSIX shell compatibility; Makefile includes Windows-friendly checks for PowerShell/cmd.

## 6. Dev workflow
- Branch per feature, run unit tests, run Makefile scans locally.
- Use `docker-compose logs -f` and `docker-compose exec <service> bash` for debugging.
- Submit PR; CI runs devsecops-scan workflow.

## 7. Testing & CI
- Unit tests: `pytest` in backend
- Frontend tests: configured via jest/React testing libs (see `package.json`)
- CI: GitHub Actions runs scanners and test suites; `devsecops-scan.yml` controls security checks.

## 8. Deployment considerations
- Use managed services (RDS, ElastiCache) in production.
- Use secure secrets management (Key Vault / Secrets Manager).
- Harden containers and implement build-time scanning.
- Centralized logging and alerting for production.

## 9. Security & permissions
- AWS permissions follow least privilege; used for reading IAM, S3, EC2, Security Hub, Config as documented in `README.md`.
- Scanning pipeline enforces policy compliance and secret detection.

## 10. Recommended topics to be well versed in
- Docker & docker-compose (container lifecycle, networking, volumes)
- GNU Make and cross-platform shell differences (POSIX vs PowerShell/cmd)
- Git and GitHub workflows (branching, PRs, Actions)
- Python Flask (REST API design, WSGI)
- React + TypeScript (component patterns, state management)
- PostgreSQL & Redis basics (schema, backups, caching patterns)
- Prometheus & Grafana (metrics instrumentation and dashboards)
- Terraform (IaC fundamentals, state management)
- OPA (Rego) for policy-as-code
- Checkov & Gitleaks (IaC/secret scanning)
- AWS core services and security concepts: IAM, S3, EC2, Security Hub, Config
- Container security and image scanning best practices
- CI/CD principles and pipeline security
- Logging, monitoring, and incident response basics
- Basic Linux shell, networking, and permissions

## 11. Suggested next steps for a new contributor
- Read `docs/PROJECT_OVERVIEW.md` and `README.md`
- Run `docker-compose up` locally and explore the frontend and API
- Run `make scan` and inspect scanner outputs in `DevSecOps/`
- Read `backend/api/aws_*.py` to understand AWS integrations
- Review OPA policies in `DevSecOps/opa-policies`
- Run unit tests: `pytest`
- Open a small issue and implement a minor fix to learn the flow

## 12. Useful commands (summary)
- Start: `docker-compose up -d`
- Logs: `docker-compose logs -f`
- Scan: `make scan`
- Tests: `docker-compose exec app pytest`
- Clean scans: `make clean-scans`

---

This document is intended as a focused onboarding reference; keep it updated as components or workflows change.
