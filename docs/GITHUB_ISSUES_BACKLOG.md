# GitHub Issues Backlog — IAM Dashboard (Semester-Safe)

**Repo:** https://github.com/AWS-IAM-Dashboard/IAM-Dashboard

## Context
- **Team size:** 24 total  
  - **PMO:** 3  
  - **Delivery teams:** Backend, Frontend, Security, DevOps, Data, AI (≈3–4 each)
- **Timeline:** ~9 weeks (**Feb 17 – Apr 17**)
- **Goal:** Ship a real, demoable platform.

---

# 🚨 Semester Backlog Rule (Non-Negotiable)

**Only issues labeled `(SEMESTER)` are created and worked on this term.**  
Anything labeled `(POST)` is a parking lot for after Apr 17 and **must not** be created as a GitHub issue this semester.

If unsure → mark it `(POST)`.

---

# Product Goal (North Star)

> **IAM Dashboard lets a student or junior security engineer log in, scan an AWS account, see trustworthy IAM risks, get clear remediation guidance (with confidence), and export a review-ready report — even on mobile.**

---

# End-of-Semester Demo Criteria (Definition of Success)

We win if we can demo this live:

1. Visit landing page  
2. Log in with Cognito  
3. Run a scan  
4. Refresh page → findings persist  
5. See IAM risks with severity  
6. Click a finding → remediation + why it matters + confidence  
7. View severity trends in Grafana  
8. **Export a PDF security summary**

---

# Roadmap (Semester Milestones — Locked)

| Milestone | Weeks | Focus |
|---|---|---|
| **P0** | Week 0 | Onboarding + first PRs |
| **M1** | Week 1 | CI green + dev stability |
| **M2** | Week 2 | Auth spine (Cognito + JWT) |
| **M3** | Week 3 | Landing + login UX |
| **M4** | Weeks 4–5 | Quality sprint (schema, FPs, dashboard, mobile, refresh-safe) |
| **M5** | Weeks 6–7 | Multi-account *lite* + RBAC |
| **M6** | Weeks 8–9 | Data reporting + AI v1 + DevOps polish |

---

# Team Scopes (Locked by `(SEMESTER)` labels)

## Backend (≈4)
- Cognito OAuth + JWT validation
- Unified findings schema
- APIs: run scan, list findings, **latest scan (refresh-safe)**
- Single AWS account + optional **1 extra account**
- RBAC (admin/viewer)
- Health + metrics endpoints

## Frontend (≈4)
- Marketing landing page
- Login/signup flow
- Dashboard (findings table + severity chart)
- Mobile responsive layout
- Persist scan results on refresh
- Simple account switcher (if backend supports)
- First-time onboarding

## Security (≈4)
- Top **10 IAM finding types**
- Severity scoring
- False-positive reduction + deduplication
- IAM relationships (user / group / role)
- OAuth + RBAC security review

## DevOps (≈3)
- CI green
- PR checks + linting
- One deployable environment
- Terraform cleanup
- Health check + deployment verification

## Data (≈3)
- Prometheus scraping backend metrics
- Grafana dashboards:
  - Findings over time
  - Severity distribution
- **PDF security summary export**
- **CSV export of findings**
- Minimal alerting

## AI (≈3) — v1: Safe Remediation Assistant
- Remediation suggestions per finding
- “Why this matters” explanation
- Confidence score (High / Medium / Low)
- Backend API
- Frontend widget

## PMO (3)
- Roadmap & sprint goals
- Dependency tracking
- Weekly demos
- Scope enforcement

---

# Issue Count Target (Semester)

**Target:** ~70 `(SEMESTER)` issues total  
(~3 per student with buffer)

---

# How to Create Issues (Fast)

1. Create milestones **P0, M1–M6** in GitHub.
2. Create labels:  
   `team: backend`, `team: frontend`, `team: security`, `team: devops`, `team: data`, `team: ai`, `team: pmo`, `team: foundation`
3. Create issues **only** from the **Quick Reference — (SEMESTER)** below.

---

# Quick Reference — (SEMESTER) Issues Only
> **Create GitHub Issues only from this list.**

### Foundation / PMO
| ID | Title | Team | Milestone |
|---|---|---|---|
| F1 | (SEMESTER) Fix CI pipeline (GitHub Actions) | DevOps | M1 |
| F2 | (SEMESTER) Fix Docker healthcheck | DevOps | M1 |
| F3 | (SEMESTER) Pin Prometheus/Grafana image versions | DevOps | M1 |
| F4 | (SEMESTER) Update TEAM_SETUP.md for GitHub Org | PMO | M1 |
| F5 | (SEMESTER) Update CONTRIBUTING.md for GitHub Org | PMO | M1 |
| F6 | (SEMESTER) Document who needs AWS credentials | PMO | M1 |
| P1 | (SEMESTER) Maintain 4-week roadmap + sprint goals | PMO | M1 |
| P2 | (SEMESTER) Define PR workflow + CODEOWNERS | PMO | M1 |
| P4 | (SEMESTER) Acceptance criteria for Landing + OAuth | PMO | M1 |
| P5 | (SEMESTER) Sprint retro + publish next-phase goals | PMO | M6 |

### Backend
| ID | Title | Milestone |
|---|---|---|
| B1 | (SEMESTER) Document AWS infra for OAuth + Cognito | M2 |
| B6 | (SEMESTER) Add Cognito User Pool via Terraform | M2 |
| B7 | (SEMESTER) Implement OAuth login flow (Hosted UI) | M2 |
| B10 | (SEMESTER) Secure APIs with JWT validation | M2 |
| B17 | (SEMESTER) Backend health endpoint (/health) | M3 |
| B13 | (SEMESTER) Normalize scans to unified findings schema | M4 |
| B14b | (SEMESTER) API: latest scan results (refresh-safe) | M4 |
| B18 | (SEMESTER) Metrics endpoint for Prometheus | M4 |
| B2 | (SEMESTER) Design multi-account *lite* (2 accounts max) | M5 |
| B4 | (SEMESTER) Cross-account role assumption | M5 |
| B11 | (SEMESTER) Multi-account scanning (*lite*) | M5 |
| B12 | (SEMESTER) Account registration & lifecycle APIs | M5 |
| B9 | (SEMESTER) RBAC (admin/viewer) | M5 |

### Frontend
| ID | Title | Milestone |
|---|---|---|
| W1 | (SEMESTER) Marketing landing page | M3 |
| W2 | (SEMESTER) OAuth login/signup page | M3 |
| W3 | (SEMESTER) Auth redirects + session persistence | M3 |
| W8 | (SEMESTER) Improve findings visualization | M4 |
| W9 | (SEMESTER) Filters/search/pagination | M4 |
| W10 | (SEMESTER) Empty-state UX | M4 |
| W10b | (SEMESTER) Persist scan results on refresh | M4 |
| W11 | (SEMESTER) Mobile responsiveness | M4 |
| W5 | (SEMESTER) Account connection status UI | M5 |
| W7 | (SEMESTER) Simple account switcher | M5 |
| W4 | (SEMESTER) First-time onboarding | M5 |

### Security
| ID | Title | Milestone |
|---|---|---|
| S1 | (SEMESTER) Audit false positives | M4 |
| S2 | (SEMESTER) Tune IAM detection rules | M4 |
| S3 | (SEMESTER) Severity scoring | M4 |
| S5 | (SEMESTER) Deduplicate/suppress noise | M4 |
| S15 | (SEMESTER) Review OAuth/Cognito config | M3 |
| S16 | (SEMESTER) Validate backend authz enforcement | M5 |

### Data & Reporting (Expanded)
| ID | Title | Milestone |
|---|---|---|
| A6 | (SEMESTER) Prometheus scrape backend metrics | M4 |
| A7 | (SEMESTER) Configure Grafana datasources | M4 |
| A8 | (SEMESTER) Grafana: findings over time | M4 |
| A9 | (SEMESTER) Grafana: severity distribution | M4 |
| A12 | (SEMESTER) Generate PDF security summary | M6 |
| A13 | (SEMESTER) Auditor-friendly PDF layout | M6 |
| A14 | (SEMESTER) CSV export of findings | M6 |
| A15 | (SEMESTER) Document reports & audiences | M6 |

### DevOps
| ID | Title | Milestone |
|---|---|---|
| D8 | (SEMESTER) Lint/format gates in CI | M6 |
| D12 | (SEMESTER) Optimize Docker images | M6 |
| D13 | (SEMESTER) Deployment verification (/health) | M6 |

### AI (v1 only)
| ID | Title | Milestone |
|---|---|---|
| AI-1 | (SEMESTER) AI v1 use cases (remediation only) | M6 |
| AI-2 | (SEMESTER) AI input schema (finding → context) | M6 |
| AI-3 | (SEMESTER) AI guardrails & safety rules | M6 |
| AI-4 | (SEMESTER) Decide AI runtime (async preferred) | M6 |
| AI-5 | (SEMESTER) Generate remediation suggestions (top 10) | M6 |
| AI-6 | (SEMESTER) Confidence scoring (H/M/L) | M6 |
| AI-7 | (SEMESTER) Backend API for recommendations | M6 |
| AI-8 | (SEMESTER) Frontend widget for recommendations | M6 |

---

# Dependencies & Work Rules

- **If blocked by another milestone, do not wait.** Pick another `(SEMESTER)` issue in the same milestone.
- Backend publishes early contracts (auth responses, findings schema v0) to unblock Frontend/Data/AI.
- PMO enforces scope via labels and milestones.

---

# Post-Semester Parking Lot (POST — Do NOT Create Issues)

- AWS Organizations ingestion
- Compliance frameworks (CIS/NIST)
- Auto-remediation
- Multi-agent AI
- Data warehouse / ETL
- Multi-environment CI/CD
- Advanced caching or full API versioning

---

*Last updated: Semester-safe version.  
Create issues only from the `(SEMESTER)` Quick Reference above.*
