# GitHub Issues Backlog — IAM Dashboard (Semester-Safe)

**Repo:** [AWS-IAM-Dashboard/IAM-Dashboard](https://github.com/AWS-IAM-Dashboard/IAM-Dashboard)

**Context**
- **Team size:** 24 total — **PMO:** 3; **Delivery teams:** Backend, Frontend, Security, DevOps, Data, AI (≈3–4 each)
- **Timeline:** ~9 weeks (Feb 17 – Apr 17)
- **Goal:** Ship a real, demoable platform — not a half-built enterprise product

This backlog is **intentionally scoped down** so every team ships something meaningful by semester end.

---

## Product goal (anchor this everywhere)

> **IAM Dashboard lets a student or junior security engineer log in, scan an AWS account, see trustworthy IAM risks, and get clear remediation guidance — even on mobile.**

If an issue doesn’t move this forward → it’s post-semester.

---

## Roadmap (semester: P0 + M1–M6)

| Phase | Weeks | Focus |
|-------|-------|--------|
| **P0** | Week 0 | Onboarding + first PRs |
| **M1** | Week 1 | CI green + dev stability |
| **M2** | Week 2 | Auth spine (Cognito + JWT) |
| **M3** | Week 3 | Landing + login UX |
| **M4** | Weeks 4–5 | Quality sprint (schema, FPs, dashboard, mobile) |
| **M5** | Weeks 6–7 | Multi-account *lite* + RBAC |
| **M6** | Weeks 8–9 | Data dashboards + AI v1 + DevOps polish |

---

## Team scopes (trimmed & locked)

### Backend (4 students)
**Ship:** Cognito OAuth + JWT middleware; unified findings schema; APIs: run scan, list findings, **latest scan (refresh-safe)**; single account + optional 1 extra account (stretch).  
**Do NOT ship:** AWS Org discovery; advanced caching layers; full API versioning system.  
**Definition of done:** Frontend can refresh the page and still show findings.

### Frontend (4 students)
**Ship:** Marketing landing page; login/signup flow; dashboard (findings table, severity chart, mobile responsive); persist results on refresh; simple account dropdown (if backend supports).  
**Do NOT ship:** Fancy animations; complex account grouping; deep accessibility audits beyond basics.  
**Definition of done:** A user can log in on their phone and understand their IAM risks.

### Security (4 students)
**Ship:** Top **10 IAM finding types**; severity scoring; false-positive reduction; deduplication; IAM relationships (user/group/role); OAuth + RBAC security review.  
**Do NOT ship:** Full compliance frameworks; coverage of every AWS service.  
**Definition of done:** Findings are accurate enough that someone would actually trust them.

### DevOps (3 students)
**Ship:** CI green; PR checks + linting; one deployable environment; Terraform cleaned up; health check + basic verification.  
**Do NOT ship:** Multi-env prod/staging; automated rollback systems.  
**Definition of done:** Nothing breaks when someone opens a PR.

### Data (3 students)
**Ship:** Prometheus scraping backend metrics; Grafana dashboards (findings over time, severity distribution); minimal alerting.  
**Do NOT ship:** Data warehouse; ETL pipelines; long-term retention logic.  
**Definition of done:** You can visually see security posture change over time.

### AI (3 students — intentionally small) — v1: Safe Remediation Assistant
**Ship ONLY:** Suggested remediation per finding; “Why this matters” explanation; confidence level (High/Medium/Low); backend API; frontend widget on finding detail.  
**Explicitly NOT allowed:** Auto-remediation; running commands; compliance frameworks; multi-agent systems.  
**Definition of done:** Clicking a finding tells you what to do next — safely.

### PMO (3 students)
**Own continuously:** Roadmap & sprint goals; dependency tracking; weekly demos; scope enforcement (saying “no”).  
**Do NOT overdo:** Heavy documentation; perfect Jira hygiene.  
**Definition of done:** No team is blocked, and every week ends with a demo.

---

## Issue breakdown (semester target)

**Total target: ~65–75 issues** (~3 per student, with buffer).

| Team | Issues |
|------|--------|
| Backend | 12–14 |
| Frontend | 12–14 |
| Security | 10–12 |
| DevOps | 8–10 |
| Data | 8–10 |
| AI | **8 (hard cap)** |
| PMO | 6 |
| **Total** | **~70** |

---

## AI backlog (semester — do not add more)

| ID | Title |
|----|--------|
| AI-1 | Define AI v1 use cases (remediation only) |
| AI-2 | Define AI input schema (finding → context) |
| AI-3 | Define AI guardrails and safety rules |
| AI-4 | Decide AI runtime (async worker recommended) |
| AI-5 | Generate remediation suggestions (top 10 IAM findings) |
| AI-6 | Add confidence scoring |
| AI-7 | Expose AI suggestions via backend API |
| AI-8 | Display AI suggestions in dashboard UI |

Everything else → **Post-Semester Backlog**.

---

## Explicit cuts (post–semester)

Out of scope this semester:
- AWS Organizations ingestion
- Compliance frameworks (CIS/NIST)
- Auto-remediation
- Data warehouse / ETL
- Multi-env CI/CD
- Multi-agent AI

---

## End-of-semester demo criteria

You win if you can demo this live:

1. Visit landing page  
2. Log in with Cognito  
3. Run a scan  
4. Refresh the page → findings still there  
5. See IAM risks with severity  
6. Click a finding → see remediation suggestion  
7. View severity trend chart in Grafana  

If it does those **cleanly**, this project is a success.

---

## Table of contents

| Section | Use |
|--------|-----|
| [Product goal](#product-goal-anchor-this-everywhere) | North star for scope |
| [Roadmap (P0 + M1–M6)](#roadmap-semester-p0--m1m6) | Phase focus |
| [Team scopes](#team-scopes-trimmed--locked) | Ship / Do NOT ship / DoD per team |
| [Issue breakdown](#issue-breakdown-semester-target) | ~70 issues, per-team targets |
| [AI backlog (8 only)](#ai-backlog-semester--do-not-add-more) | Semester AI issues |
| [Explicit cuts](#explicit-cuts-postsemester) | Post-semester backlog |
| [Demo criteria](#end-of-semester-demo-criteria) | Success checklist |
| [Draft timeline (Feb 17 – Apr 17)](#draft-roadmap-feb-17--apr-17-9-weeks) | Week-by-week |
| [How to use](#how-to-use-this-document) | Creating issues, reading by team |
| [Quick reference (all issues)](#quick-reference-all-issues-by-milestone) | Full list: Title, Team, Label, Milestone |
| [Foundation](#foundation--quick-wins-unblock-everyone) | F1–F6 |
| [PMO](#pmo-product--project-management) | P1–P5 |
| [Backend](#backend--cloud-platform) | B1–B19, B14b |
| [Frontend](#web-platform-frontend--ux) | W1–W18, W10b |
| [Security](#security-engineering-devsecops-core) | S1–S18 |
| [DevOps](#platform-automation-devops--cicd) | D1–D14 |
| [Data](#data--reporting-security-analytics) | A1–A15 |
| [AI (full backlog)](#ai-engineering) | I1–I17 (semester uses AI-1–AI-8 only) |
| [Dependencies & sequencing](#dependencies--sequencing-college-team) | What blocks what |
| [Milestones (full M1–M10)](#milestones-good-flow-order) | Reference |
| [Issue count](#issue-count-summary) | Totals by team |

---

## Draft roadmap: Feb 17 – Apr 17 (9 weeks)

Week-by-week timeline aligned to [Roadmap (P0 + M1–M6)](#roadmap-semester-p0--m1m6). Pick issues from [Quick reference](#quick-reference-all-issues-by-milestone) by phase; use [Team scopes](#team-scopes-trimmed--locked) to stay in scope.

| Period | Phase | Focus | Goal / "Something to do" |
|--------|--------|--------|---------------------------|
| **Feb 17** | **P0** | Onboarding | Intro, repo access, clone, first standup. No deliverables. |
| **Feb 24 – Mar 2** | **M1** | CI + dev stability | CI green (F1), Docker/docs (F2, F3, F4, F5, F6), roadmap + PR workflow (P1, P2), acceptance criteria (P4). |
| **Mar 3 – Mar 9** | **M2** | Auth spine | B1, B6, B7, B10. Cognito + OAuth + JWT. Frontend can prep W2/W3. |
| **Mar 10 – Mar 16** | **M3** | Landing + login UX | W1, W2, W3. Landing live; login/signup and session end-to-end. |
| **Mar 17 – Mar 30** | **M4** | Quality sprint | S1–S3, B13, B14b, B17, B18, A8, A9, W8–W11, W10b. Schema, FPs, dashboard, mobile. |
| **Mar 31 – Apr 13** | **M5** | Multi-account lite + RBAC | B2, B4, B8, B9, B11, B12, W5–W7, S15, S16, W4. Optional 1 extra account; RBAC + security review. |
| **Apr 14 – Apr 17** | **M6** | Data + AI v1 + DevOps polish | A1–A7, A8–A11, AI-1–AI-8, D1–D8, P3, P5. Dashboards, remediation suggestions, CI/lint/health. |

**How to use:** Stay within [Issue breakdown](#issue-breakdown-semester-target) (~70 issues total). AI team uses only [AI backlog (8 issues)](#ai-backlog-semester--do-not-add-more) this semester.

---

## How to Use This Document

### Reading

- **By team:** Use the department sections; each table has **#**, **Title**, **Description**, **Team**.
- **By flow:** Use [Quick reference](#quick-reference-all-issues-by-milestone) or [Milestones](#milestones-good-flow-order); issues are in milestone order.
- **By dependency:** Use [Dependencies & sequencing](#dependencies--sequencing-college-team).

### Creating GitHub issues (efficient workflow)

1. **Create milestones** in the repo: M1–M10 (names from [Milestones](#milestones-good-flow-order)).
2. **Create labels** (optional): e.g. `team: backend`, `team: frontend`, `team: devops`, `team: security`, `team: data`, `team: ai`, `team: pmo`, `team: foundation`.
3. **For each issue:**  
   - From [Quick reference](#quick-reference-all-issues-by-milestone), copy **Title** into the new issue.  
   - Copy **Description** from the same issue ID in its department section (Ctrl+F the ID, e.g. `B6`).  
   - Set **Labels** and **Milestone** from the Quick ref row.
4. **Optional:** In the issue body add `**Milestone:** M2` and `**Team:** Backend` for visibility.

### Other

- **Word:** Copy sections; use H1 for department, H2 for theme.
- **Estimate:** Add size (S/M/L) and priority (P0/P1/P2) in body or as labels when creating the issue.

---

## Quick reference: All issues by milestone

Use this table to create issues: copy **Title** into the issue, set **Label** and **Milestone** in GitHub. Copy **Description** from the issue’s row in the department section (search by ID).

**What is the Milestone column?**  
Milestones are **phases** (M1 = first, M10 = last). Each **M** is a batch of work that fits together (e.g. M2 = “Auth spine”, M4 = “Single-account quality”). When you create the issue in GitHub, assign it to that milestone so the team can track “what we’re doing this phase.” Issues with **—** have no suggested phase; schedule them in M4–M9 when you have capacity. Full list with goals: [Milestones](#milestones-good-flow-order).

| ID | Title | Team | Label | Milestone |
|---|--------|------|-------|-----------|
| F1 | Fix CI pipeline (GitHub Actions) | DevOps | team: devops | M1 |
| F2 | Fix Docker healthcheck | DevOps | team: devops | M1 |
| F3 | Pin Grafana and Prometheus image versions | DevOps | team: devops | M1 |
| F4 | Update TEAM_SETUP.md for GitHub Org | PMO / DevOps | team: pmo | M1 |
| F5 | Update CONTRIBUTING.md for GitHub Org | PMO | team: pmo | M1 |
| F6 | Document "who needs AWS credentials" | PMO | team: pmo | M1 |
| P1 | Create and maintain 4-week roadmap | PMO | team: pmo | M1 |
| P2 | Define PR workflow and CODEOWNERS | PMO | team: pmo | M1 |
| P4 | Create acceptance criteria for Landing + OAuth | PMO | team: pmo | M1 |
| B1 | Document AWS infra needed for OAuth + Cognito | Backend | team: backend | M2 |
| B6 | Add Amazon Cognito User Pool (Terraform) | Backend | team: backend | M2 |
| B7 | Implement OAuth login flow (Cognito Hosted UI) | Backend | team: backend | M2 |
| B10 | Secure API endpoints with JWT validation | Backend | team: backend | M2 |
| W1 | Design and build marketing landing page | Frontend | team: frontend | M3 |
| W2 | Create OAuth login/signup page | Frontend | team: frontend | M3 |
| W3 | Handle auth redirects and session persistence | Frontend | team: frontend | M3 |
| S1 | Audit current findings for false positives | Security | team: security | M4 |
| S2 | Tune IAM misconfiguration detection rules | Security | team: security | M4 |
| S3 | Add severity scoring logic | Security | team: security | M4 |
| B13 | Normalize scan results to unified findings schema | Backend | team: backend | M4 |
| B14b | API: latest scan results for frontend (survive refresh) | Backend | team: backend | M4 |
| B17 | Implement backend health check endpoint | Backend | team: backend | M4 |
| B18 | Add metrics endpoint for Prometheus | Backend | team: backend | M4 |
| A8 | Create dashboard: findings over time | Data | team: data | M4 |
| A9 | Create dashboard: severity distribution | Data | team: data | M4 |
| W8 | Improve findings visualization (severity, categories, trends) | Frontend | team: frontend | M4 |
| W9 | Add filtering, search, and pagination for findings | Frontend | team: frontend | M4 |
| W10 | Improve empty-state UX | Frontend | team: frontend | M4 |
| W10b | Persist scan results across page refresh | Frontend | team: frontend | M4 |
| W11 | Make all main views mobile-responsive | Frontend | team: frontend | M4 |
| B2 | Design multi-account ingestion (hub-and-spoke vs role-assumption) | Backend | team: backend | M5 |
| B4 | Implement cross-account role assumption flow | Backend | team: backend | M5 |
| B8 | Map users to AWS accounts and permissions | Backend | team: backend | M5 |
| B11 | Expand IAM scanning for multi-account | Backend | team: backend | M5 |
| B12 | Add account registration and lifecycle APIs | Backend | team: backend | M5 |
| W5 | Display account connection status in UI | Frontend | team: frontend | M6 |
| W6 | Redesign dashboard for multi-account visibility | Frontend | team: frontend | M6 |
| W7 | Add account switcher or account grouping UI | Frontend | team: frontend | M6 |
| B9 | Implement RBAC in backend | Backend | team: backend | M7 |
| S15 | Review OAuth and Cognito configuration | Security | team: security | M7 |
| S16 | Validate backend authorization enforcement | Security | team: security | M7 |
| W4 | Build onboarding flow for first-time users | Frontend | team: frontend | M7 |
| A1 | Define core security metrics and KPIs | Data | team: data | M8 |
| A2 | Build metrics ingestion pipeline | Data | team: data | M8 |
| A3 | Normalize findings for time-series analysis | Data | team: data | M8 |
| A4 | Design data retention strategy | Data | team: data | M8 |
| A5 | Separate real-time vs batch data paths | Data | team: data | M8 |
| A6 | Integrate Prometheus with backend metrics | Data | team: data | M8 |
| A7 | Configure Grafana datasources | Data | team: data | M8 |
| A10 | Create dashboard: account risk scoring | Data | team: data | M8 |
| A11 | Add alerting thresholds | Data | team: data | M8 |
| A12 | Support exportable reports (CSV/JSON) | Data | team: data | M8 |
| A13 | Add trend analysis views | Data | team: data | M8 |
| A14 | Align reporting with security team definitions | Data | team: data | M8 |
| A15 | Document metrics and dashboard usage | Data | team: data | M8 |
| D1 | Refactor GitHub Actions workflows | DevOps | team: devops | M9 |
| D2 | Add environment-specific pipelines | DevOps | team: devops | M9 |
| D3 | Improve build caching in pipelines | DevOps | team: devops | M9 |
| D4 | Enforce branch protection and PR checks | DevOps | team: devops | M9 |
| D5 | Add automated rollback or revert path | DevOps | team: devops | M9 |
| D6 | Polish Terraform and document provisioning | DevOps | team: devops | M9 |
| D7 | Automate contributor environment bootstrap | DevOps | team: devops | M9 |
| D8 | Add automated linting and formatting | DevOps | team: devops | M9 |
| D9 | Add security scanning gates in CI | DevOps | team: devops | M9 |
| D10 | Generate build artifacts in CI | DevOps | team: devops | M9 |
| D11 | Add CI/CD metrics and pipeline health | DevOps | team: devops | M9 |
| D12 | Optimize container build | DevOps | team: devops | M9 |
| D13 | Add deployment verification steps | DevOps | team: devops | M9 |
| D14 | Document CI/CD architecture | DevOps | team: devops | M9 |
| P3 | Define "console access" policy | PMO | team: pmo | M9 |
| P5 | Run sprint retro and publish next-phase goals | PMO | team: pmo | M9 |
| B3 | Define backend service boundaries | Backend | team: backend | — |
| B5 | Define API versioning strategy | Backend | team: backend | — |
| B14 | Add backend caching for repeated scans | Backend | team: backend | — |
| B15 | Improve error handling and retry for AWS calls | Backend | team: backend | — |
| B16 | Add structured logging and correlation IDs | Backend | team: backend | — |
| B19 | Document deployment and scaling assumptions | Backend | team: backend | — |
| W12 | Test dashboard on small screens and fix critical issues | Frontend | team: frontend | — |
| W13 | Improve accessibility (contrast, labels, keyboard) | Frontend | team: frontend | — |
| W14 | Optimize frontend performance for low-end devices | Frontend | team: frontend | — |
| W15 | Harden frontend API error handling | Frontend | team: frontend | — |
| W16 | Add loading states and progress indicators | Frontend | team: frontend | — |
| W17 | Align UI with security/analytics data models | Frontend | team: frontend | — |
| W18 | Document frontend architecture and setup | Frontend | team: frontend | — |
| S4 | Correlate findings across users/groups/roles | Security | team: security | — |
| S5 | Deduplicate or suppress noisy findings | Security | team: security | — |
| S6 | Document supported IAM entities | Security | team: security | — |
| S7 | Implement IAM relationship graph logic | Security | team: security | — |
| S8 | Add detection for privilege escalation paths | Security | team: security | — |
| S9 | Validate least-privilege violations | Security | team: security | — |
| S10 | Document multi-account IAM governance patterns | Security | team: security | — |
| S11 | Improve OPA policy coverage | Security | team: security | — |
| S12 | Tune Checkov for AWS IAM focus | Security | team: security | — |
| S13 | Add custom security rules not in OPA/Checkov | Security | team: security | — |
| S14 | Document security assumptions and threat model | Security | team: security | — |
| S17 | Harden secrets and credentials handling | Security | team: security | — |
| S18 | Create security review checklist for releases | Security | team: security | — |
| I1 | Document AI use cases | AI | team: ai | M10 |
| I2 | Define input schema for AI agents | AI | team: ai | M10 |
| I3 | Design guardrails for AI outputs | AI | team: ai | M10 |
| I4 | Decide where AI runs (API vs async vs batch) | AI | team: ai | M10 |
| I5 | Generate remediation suggestions per finding | AI | team: ai | M10 |
| I6 | Map findings to AWS best practices | AI | team: ai | M10 |
| I7 | Rank suggestions by impact and risk | AI | team: ai | M10 |
| I8 | Add confidence scoring to AI outputs | AI | team: ai | M10 |
| I9 | Prevent destructive or unsafe recommendations | AI | team: ai | M10 |
| I10 | Map findings to compliance frameworks | AI | team: ai | M10 |
| I11 | Auto-generate compliance summaries | AI | team: ai | M10 |
| I12 | Detect recurring misconfig patterns | AI | team: ai | M10 |
| I13 | Support explainability for AI suggestions | AI | team: ai | M10 |
| I14 | Expose AI insights via backend APIs | AI | team: ai | M10 |
| I15 | Integrate AI outputs into dashboards | AI | team: ai | M10 |
| I16 | Add feedback loop for suggestions | AI | team: ai | M10 |
| I17 | Document AI limitations and assumptions | AI | team: ai | M10 |

*Issues with **Milestone** = — have no fixed phase; schedule them in M4–M9 when capacity or dependencies allow.*

---

## Foundation / Quick Wins (Unblock Everyone)

These should be done early so the rest of the work can proceed.

| # | Title | Description | Team |
|---|--------|-------------|------|
| F1 | Fix CI pipeline (GitHub Actions) | Get the main GitHub Actions workflow green: fix failing steps (build, test, or deploy), document required secrets. | DevOps |
| F2 | Fix Docker healthcheck | Add `curl` to the app image or switch healthcheck to a Python-based check so container health works. | DevOps |
| F3 | Pin Grafana and Prometheus image versions | Replace `latest` with specific version tags in `docker-compose.yml` for reproducible builds. | DevOps |
| F4 | Update TEAM_SETUP.md for GitHub Org | Change clone/fork instructions to org workflow (clone org repo, branch, PR); remove upstream. | PMO / DevOps |
| F5 | Update CONTRIBUTING.md for GitHub Org | Same as F4: org clone, no fork; link to repo URL. | PMO |
| F6 | Document "who needs AWS credentials" | One-pager: which teams need AWS keys vs env-only; add to README or docs. | PMO |

---

## PMO (Product / Project Management)

| # | Title | Description | Team |
|---|--------|-------------|------|
| P1 | Create and maintain 4-week roadmap | Publish a simple roadmap (GitHub Project) with themes per week and link to issues. | PMO |
| P2 | Define PR workflow and CODEOWNERS | Document branch rules, who reviews what; add CODEOWNERS for key paths (e.g. infra, DevSecOps). | PMO |
| P3 | Define "console access" policy | Document who gets AWS/GitHub access and how (e.g. request process, least privilege). | PMO |
| P4 | Create acceptance criteria for Landing + OAuth | Write clear "done" criteria for landing page and OAuth flow for Frontend/Backend. | PMO |
| P5 | Run sprint retro and publish next-phase goals | After first month: retro, update roadmap, publish next-level goals (SaaS, multi-account, AI). | PMO |

---

## Backend & Cloud Platform

### Architecture & Infrastructure

| # | Title | Description | Team |
|---|--------|-------------|------|
| B1 | Document AWS infra needed for OAuth + Cognito | List AWS resources (Cognito User Pool, App Client, domain, redirect URIs) and add to docs. | Backend |
| B2 | Design multi-account ingestion (hub-and-spoke vs role-assumption) | Short design doc: options for multi-account scan ingestion and recommend one. | Backend |
| B3 | Define backend service boundaries | Document boundaries for auth, scans, reporting, and future AI inputs (APIs and ownership). | Backend |
| B4 | Implement cross-account role assumption flow | Implement secure STS assume-role for scanning multiple AWS accounts; document IAM requirements. | Backend |
| B5 | Define API versioning strategy | Document path or header versioning (e.g. `/api/v1`, `/api/v2`) and backward-compatibility rules. | Backend |

### Authentication & Authorization

| # | Title | Description | Team |
|---|--------|-------------|------|
| B6 | Add Amazon Cognito User Pool (Terraform) | Terraform (or CF) for Cognito User Pool, app client, and basic config. | Backend |
| B7 | Implement OAuth login flow (Cognito Hosted UI) | Backend: redirect to Cognito Hosted UI, handle callback, validate tokens. | Backend |
| B8 | Map users to AWS accounts and permissions | Data model and API: link users/roles to which AWS accounts they can see and what they can do. | Backend |
| B9 | Implement RBAC in backend | Enforce roles (e.g. admin, analyst, viewer) on API endpoints; return 403 when unauthorized. | Backend |
| B10 | Secure API endpoints with JWT validation | Middleware/filter: validate Cognito JWT on protected routes; reject invalid/expired tokens. | Backend |

### Backend Services

| # | Title | Description | Team |
|---|--------|-------------|------|
| B11 | Expand IAM scanning for multi-account | Extend IAM scan APIs to accept account ID/role and run in multi-account context. | Backend |
| B12 | Add account registration and lifecycle APIs | APIs: register linked AWS account, list accounts, optional deactivate. | Backend |
| B13 | Normalize scan results to unified findings schema | Define one findings schema (e.g. JSON) and normalize IAM/EC2/S3/Security Hub etc. into it. | Backend |
| B14 | Add backend caching for repeated scans | Cache scan results (e.g. Redis or in-memory) with TTL to avoid redundant AWS calls. | Backend |
| B14b | **API: latest scan results for frontend (survive refresh)** | Endpoint(s) to return latest scan result(s) by scanner type (or “last full scan”) so frontend can re-fetch on load and repopulate dashboard after refresh. | Backend |
| B15 | Improve error handling and retry for AWS calls | Consistent error handling and retry/backoff for boto3 calls; map errors to clear API responses. | Backend |

### Reliability & Observability

| # | Title | Description | Team |
|---|--------|-------------|------|
| B16 | Add structured logging and correlation IDs | Structured logs (JSON) with request/correlation ID for tracing. | Backend |
| B17 | Implement backend health check endpoint | `/health` (and optionally `/ready`) returning 200 when app and dependencies are OK. | Backend |
| B18 | Add metrics endpoint for Prometheus | Expose metrics (e.g. request count, latency) in Prometheus format. | Backend |
| B19 | Document deployment and scaling assumptions | Document how backend is deployed (e.g. ECS/EC2/Lambda), scaling, and limits. | Backend |

---

## Web Platform (Frontend / UX)

### Landing & Auth

| # | Title | Description | Team |
|---|--------|-------------|------|
| W1 | Design and build marketing landing page | New route/page: hero, value prop ("security team work haven"), CTA (Sign in / Sign up). | Frontend |
| W2 | Create OAuth login/signup page | Page that redirects to Cognito Hosted UI (or custom UI) and shows loading/error states. | Frontend |
| W3 | Handle auth redirects and session persistence | Handle callback after login; store token (e.g. memory/cookie); redirect to dashboard. | Frontend |
| W4 | Build onboarding flow for first-time users | Short onboarding (e.g. "Connect your first account", "Run first scan") after first login. | Frontend |
| W5 | Display account connection status in UI | Show which AWS accounts are linked and status (connected / error / disconnected). | Frontend |

### Dashboard & UX

| # | Title | Description | Team |
|---|--------|-------------|------|
| W6 | Redesign dashboard for multi-account visibility | Dashboard layout that shows data per account or aggregated; clear account context. | Frontend |
| W7 | Add account switcher or account grouping UI | Control to switch active account or filter by account/group. | Frontend |
| W8 | Improve findings visualization (severity, categories, trends) | Charts/tables for severity, category, and simple trends (e.g. over time). | Frontend |
| W9 | Add filtering, search, and pagination for findings | Filters (severity, service, account); search; paginated list. | Frontend |
| W10 | Improve empty-state UX | Clear messages and CTAs when no scans, no findings, or no accounts. | Frontend |
| W10b | **Persist scan results across page refresh** | On app load, fetch latest scan results from API and populate context so refresh doesn’t clear the dashboard. Requires backend endpoint for “latest scan(s)” or list by scanner type. | Frontend |

### Mobile & Accessibility

| # | Title | Description | Team |
|---|--------|-------------|------|
| W11 | Make all main views mobile-responsive | Responsive layout for dashboard, findings, and settings on small screens. | Frontend |
| W12 | Test dashboard on small screens and fix critical issues | Manual test on phone-sized viewport; fix layout/touch/readability issues. | Frontend |
| W13 | Improve accessibility (contrast, labels, keyboard) | Improve contrast, aria-labels, and keyboard navigation for main flows. | Frontend |
| W14 | Optimize frontend performance for low-end devices | Reduce bundle size or lazy-load heavy components; basic perf check. | Frontend |

### Integration & Polish

| # | Title | Description | Team |
|---|--------|-------------|------|
| W15 | Harden frontend API error handling | Consistent error handling and user-facing messages for API failures. | Frontend |
| W16 | Add loading states and progress indicators | Loading spinners/skeletons for API calls and long actions. | Frontend |
| W17 | Align UI with security/analytics data models | Ensure components consume normalized findings schema and account model. | Frontend |
| W18 | Document frontend architecture and setup | Short doc: app structure, routing, state, API usage, and how to run. | Frontend |

---

## Security Engineering (DevSecOps Core)

### Findings Quality

| # | Title | Description | Team |
|---|--------|-------------|------|
| S1 | Audit current findings for false positives | List top sources of FPs (OPA, Checkov, Gitleaks, Security Hub); document examples. | Security |
| S2 | Tune IAM misconfiguration detection rules | Adjust OPA/Checkov rules or code to reduce IAM FPs; add exclusions where justified. | Security |
| S3 | Add severity scoring logic | Implement or document severity scoring (e.g. Critical/High/Medium/Low) for findings. | Security |
| S4 | Correlate findings across users/groups/roles | Reduce noise by grouping or correlating findings by identity entity. | Security |
| S5 | Deduplicate or suppress noisy findings | Logic or config to merge/suppress duplicate or low-value findings. | Security |

### IAM & Governance

| # | Title | Description | Team |
|---|--------|-------------|------|
| S6 | Document supported IAM entities | Document which IAM entities are in scope (users, groups, roles, policies, accounts). | Security |
| S7 | Implement IAM relationship graph logic | Build or integrate logic for user→group→role→policy relationships. | Security |
| S8 | Add detection for privilege escalation paths | Rules or checks for high-risk permission combinations (e.g. iam:PassRole + ec2:RunInstances). | Security |
| S9 | Validate least-privilege violations | Checks or policies that flag overly broad actions/resources. | Security |
| S10 | Document multi-account IAM governance patterns | How IAM is managed across accounts (e.g. central vs delegated). | Security |

### Policy & Controls

| # | Title | Description | Team |
|---|--------|-------------|------|
| S11 | Improve OPA policy coverage | Add or extend OPA policies for IAM, Terraform, or app config. | Security |
| S12 | Tune Checkov for AWS IAM focus | Adjust `.checkov.yml` and rule set for IAM-relevant checks; skip noisy ones. | Security |
| S13 | Add custom security rules not in OPA/Checkov | One or more custom rules (e.g. script or small service) for project-specific checks. | Security |
| S14 | Document security assumptions and threat model | Short doc: what we protect, assumptions, and simple threat model. | Security |

### Platform Security

| # | Title | Description | Team |
|---|--------|-------------|------|
| S15 | Review OAuth and Cognito configuration | Security review of Cognito (policies, token TTL, redirects). | Security |
| S16 | Validate backend authorization enforcement | Verify every protected endpoint enforces RBAC/JWT. | Security |
| S17 | Harden secrets and credentials handling | Ensure no secrets in code; document use of env/Parameter Store/Secrets Manager. | Security |
| S18 | Create security review checklist for releases | Checklist (e.g. auth, secrets, dependencies) to run before each release. | Security |

---

## Platform Automation (DevOps & CI/CD)

### CI/CD

| # | Title | Description | Team |
|---|--------|-------------|------|
| D1 | Refactor GitHub Actions workflows | Simplify and fix workflows (build, test, scan); remove duplication. | DevOps |
| D2 | Add environment-specific pipelines | Separate or parameterized workflows for dev / staging / prod. | DevOps |
| D3 | Improve build caching in pipelines | Use actions/cache or similar for dependencies to speed up runs. | DevOps |
| D4 | Enforce branch protection and PR checks | Require PR, status checks, and optional reviews on main. | DevOps |
| D5 | Add automated rollback or revert path | Document or automate rollback (e.g. revert deploy, re-run previous job). | DevOps |

### Automation

| # | Title | Description | Team |
|---|--------|-------------|------|
| D6 | Polish Terraform and document provisioning | Clean up Terraform modules; document how to provision from scratch. | DevOps |
| D7 | Automate contributor environment bootstrap | Script or doc (e.g. `make dev`) so new contributors can run app and scanners. | DevOps |
| D8 | Add automated linting and formatting | Run lint/format in CI (e.g. Black, ESLint, Prettier) and fix or gate. | DevOps |
| D9 | Add security scanning gates in CI | Fail or warn on Gitleaks/Checkov/OPA when policy is violated. | DevOps |
| D10 | Generate build artifacts in CI | Produce frontend build and/or backend artifact in pipeline. | DevOps |

### Observability & Ops

| # | Title | Description | Team |
|---|--------|-------------|------|
| D11 | Add CI/CD metrics and pipeline health | Basic metrics or dashboard for pipeline success rate and duration. | DevOps |
| D12 | Optimize container build | Shrink Docker image (multi-stage, slim base, fewer layers). | DevOps |
| D13 | Add deployment verification steps | Post-deploy smoke checks (e.g. hit /health, check key page). | DevOps |
| D14 | Document CI/CD architecture | Diagram or doc: pipelines, environments, and deployment flow. | DevOps |

---

## Data & Reporting (Security Analytics)

### Metrics & Pipelines

| # | Title | Description | Team |
|---|--------|-------------|------|
| A1 | Define core security metrics and KPIs | Document metrics (e.g. open findings, mean time to remediate, by severity). | Data |
| A2 | Build metrics ingestion pipeline | Pipeline to get scan/finding data into storage (e.g. DynamoDB, PostgreSQL) for analytics. | Data |
| A3 | Normalize findings for time-series analysis | Schema and ETL so findings can be queried by time (e.g. for trends). | Data |
| A4 | Design data retention strategy | Document how long to keep scan results and findings; archival if needed. | Data |
| A5 | Separate real-time vs batch data paths | Design or doc: what is real-time vs batch and where each is stored. | Data |

### Prometheus & Grafana

| # | Title | Description | Team |
|---|--------|-------------|------|
| A6 | Integrate Prometheus with backend metrics | Backend exposes metrics; Prometheus scrapes; document scrape config. | Data |
| A7 | Configure Grafana datasources | Add Prometheus (and DB if used) as datasources in Grafana. | Data |
| A8 | Create dashboard: findings over time | Grafana dashboard with at least one "findings over time" chart. | Data |
| A9 | Create dashboard: severity distribution | Dashboard or panel for severity distribution (e.g. bar/pie). | Data |
| A10 | Create dashboard: account risk scoring | Dashboard or panel for per-account risk or score. | Data |
| A11 | Add alerting thresholds | Define and configure basic alerts (e.g. critical findings > N). | Data |

### Reporting UX

| # | Title | Description | Team |
|---|--------|-------------|------|
| A12 | Support exportable reports (CSV/JSON) | API or UI to export findings or summary as CSV/JSON. | Data |
| A13 | Add trend analysis views | UI view(s) for trends (e.g. findings over time, by service). | Data |
| A14 | Align reporting with security team definitions | Ensure report labels and severities match how SOC/security team talks. | Data |
| A15 | Document metrics and dashboard usage | Short doc: what each dashboard shows and how to use it. | Data |

---

## AI Engineering

### Foundations

| # | Title | Description | Team |
|---|--------|-------------|------|
| I1 | Document AI use cases | List use cases (e.g. remediation suggestions, compliance mapping) and priorities. | AI |
| I2 | Define input schema for AI agents | Schema for findings and context passed to AI (e.g. JSON). | AI |
| I3 | Design guardrails for AI outputs | Rules: no destructive actions, require confidence, human review for sensitive. | AI |
| I4 | Decide where AI runs (API vs async vs batch) | Short design: sync API vs queue vs batch job for AI features. | AI |

### Remediation Automation

| # | Title | Description | Team |
|---|--------|-------------|------|
| I5 | Generate remediation suggestions per finding | For a finding type, return one or more suggested actions (e.g. "Enable MFA"). | AI |
| I6 | Map findings to AWS best practices | Link findings to official or internal best-practice docs. | AI |
| I7 | Rank suggestions by impact and risk | Score or order suggestions by impact/risk; expose in API/UI. | AI |
| I8 | Add confidence scoring to AI outputs | Each suggestion has a confidence score; document how it's computed. | AI |
| I9 | Prevent destructive or unsafe recommendations | Guardrails: block suggestions that could break prod or violate policy. | AI |

### Compliance & Intelligence

| # | Title | Description | Team |
|---|--------|-------------|------|
| I10 | Map findings to compliance frameworks | Map finding types to CIS, NIST, or other frameworks. | AI |
| I11 | Auto-generate compliance summaries | Generate summary (e.g. "CIS 1.2: 3 failures") from findings. | AI |
| I12 | Detect recurring misconfig patterns | Simple pattern detection (e.g. same issue across accounts) and surface in UI/API. | AI |
| I13 | Support explainability for AI suggestions | "Why this matters" or short explanation for each suggestion. | AI |

### Integration

| # | Title | Description | Team |
|---|--------|-------------|------|
| I14 | Expose AI insights via backend APIs | REST endpoints for suggestions, compliance summary, or patterns. | AI |
| I15 | Integrate AI outputs into dashboards | Show suggestions or compliance widget in existing dashboard. | AI |
| I16 | Add feedback loop for suggestions | Mechanism to record "helpful / not helpful" or corrections for future tuning. | AI |
| I17 | Document AI limitations and assumptions | Doc: what AI does and doesn't do, and assumptions (e.g. English, AWS only). | AI |

---

## Dependencies & Sequencing (College Team)

**Are the tasks aligned?** Yes — they push the project toward landing page, OAuth, multi-account, and better UX/data. For a student team, **order matters**: some work blocks many others. Below: what relies on what, recommended order, and where bottlenecks can happen.

---

### Recommended order: phases

| Phase | Focus | Issues | Why this order |
|-------|--------|--------|-----------------|
| **0. Foundation** | Unblock everyone | F1–F6, P1, P2, P4 | Green CI and clear process so PRs and onboarding work. P4 (acceptance criteria) before teams build. |
| **1. Auth spine** | Login and identity | B1, B6, B7, B10, W2, W3 | Backend: Cognito + JWT first. Frontend: login UI and redirect/session after backend can issue/validate tokens. |
| **2. Single-account polish** | Fix current product before scaling | S1, S2, S3, B13, B17, B18, A8, A9, W8, W9, W10, W11 | False positives, one findings schema, health/metrics, and core dashboard/charts. No multi-account yet. |
| **3. Multi-account & accounts** | Scale to many accounts | B2, B4, B8, B11, B12, W6, W7, W5 | Design then implement cross-account and account APIs; then UI for account context and switcher. |
| **4. RBAC & security hardening** | Who can do what | B9, B8 (refine), S15, S16, W4, W5 | Roles and permissions; secure Cognito; then onboarding and account status. |
| **5. Data, reporting, AI** | Analytics and intelligence | A1–A15, I1–I17 | Data pipelines and dashboards can start once B13 exists. AI after findings schema and APIs are stable. |

---

### What relies on what (dependency map)

**Foundation**
- **F1 (CI)** → Blocks: confident merges, D2, D4, D10. *Bottleneck if broken: nobody can merge safely.*
- **F4, F5** → Unblock: every new contributor. Do in week 1.
- **P4 (Acceptance criteria for Landing + OAuth)** → Needed by: W1, W2, B7, so Backend/Frontend know “done.” Do in phase 0.

**Auth spine (critical path)**
- **B1** → B6 (need to know what to create).
- **B6 (Cognito Terraform)** → B7, B10, W2, W3 (no login without User Pool).
- **B7 (OAuth flow)** → W2, W3 (frontend needs backend endpoints and redirect URL).
- **B10 (JWT validation)** → B9 (RBAC), W3 (session only makes sense if backend enforces auth).

**Backend → Frontend**
- **B13 (unified findings schema)** → W8, W9, A2, A3, I2, I5 (everyone consumes the same shape).
- **B12 (account APIs)** → W5, W7 (UI shows/switches accounts from API).
- **B11 (multi-account scanning)** → W6, W7 (dashboard and switcher need multi-account data).
- **B14b (API: latest scan results)** → **W10b (persist scan results on refresh)**. Frontend needs an endpoint to re-fetch latest scans on load so refresh doesn’t clear the dashboard.

**Backend → Data**
- **B13** → A2, A3, A8, A9, A10 (pipelines and dashboards need a stable schema).
- **B18 (metrics endpoint)** → A6, A7 (Prometheus/Grafana scrape backend).

**Backend → AI**
- **B13** → I2, I5 (AI input schema and suggestions use same findings model).
- **B9/B10 (auth)** → I14 (AI APIs should be behind same auth).

**Security**
- **S1 (audit FPs)** → S2, S5 (tune and dedupe after you know sources).
- **B6/B7 (Cognito/OAuth)** → S15 (review config after it exists).

**DevOps**
- **F1 (CI green)** → D1, D2, D4 (refactor and branch protection build on working pipeline).
- **B6 (Cognito in Terraform)** → D6 (Terraform polish can include Cognito).

---

### Bottleneck risks and subtasks

| Risk | Why it’s a bottleneck | Mitigation / subtasks |
|------|------------------------|------------------------|
| **F1 (CI) stays red** | Blocks merges, demotivates, blocks D2/D4/D10. | **Subtasks:** (1) Get one job green (e.g. build or test). (2) Document secrets. (3) Fix deploy step. Assign one DevOps lead; unblock before starting D2. |
| **B6 (Cognito) delayed** | B7, B10, W2, W3, S15 all wait. | **Subtasks:** (1) User Pool only. (2) App client + redirect URIs. (3) Document for Frontend. Split Terraform (B6) and “doc for frontend” so Frontend can prep W2/W3 against mock or doc. |
| **B7 (OAuth flow) delayed** | W2, W3 can’t integrate with real login. | **Subtasks:** (1) Redirect to Hosted UI. (2) Callback endpoint + token exchange. (3) Return user/session to frontend. Backend and Frontend sync on callback URL and response shape in week 1. |
| **B13 (unified schema) delayed** | Data, Frontend, AI all need it. | **Subtasks:** (1) Propose schema (JSON) and get agreement. (2) Normalize one scanner (e.g. IAM). (3) Roll out to rest. Data/Frontend can start with “schema v0” doc before full backend implementation. |
| **Single person on auth** | One student owning B6+B7+B10 blocks many. | Assign 2–3 (e.g. one Terraform, one backend OAuth, one JWT middleware). P4 and B1 done first so they know the contract. |
| **Frontend waiting on backend** | W2, W3, W5, W7 block on B6/B7/B12. | **Parallel work:** W1 (landing) and W8, W9, W10, W11 (dashboard/mobile) need no auth. Do landing + dashboard polish while auth spine is built. |

---

### Tasks that don’t depend on others (good first picks)

Students can take these without waiting on another team:

- **F2, F3, F4, F5, F6** — DevOps/PMO.
- **P1, P2, P3** — PMO.
- **B5, B19** — Backend docs/design.
- **W1** — Landing page (static; CTA can point to “Sign in” that doesn’t work yet).
- **W10, W11, W12, W13, W14** — Empty states, mobile, a11y, perf (current dashboard).
- **S1, S6, S11, S12, S14** — Security audit, docs, OPA/Checkov tuning.
- **D6, D7, D8, D14** — Terraform, bootstrap, lint, CI/CD doc.
- **A1, A4, A5, A15** — Data: define metrics, retention, batch vs real-time, doc.
- **I1, I3, I4, I17** — AI: use cases, guardrails, where it runs, limitations.

---

### Critical path (short)

```
F1 → B1 → B6 → B7 → B10 → W2/W3 (first login working)
         ↓
      B13 → (Data + Frontend charts + AI inputs)
```

**Summary for students:** Do Foundation and P4 first. Then Backend auth (B1 → B6 → B7 → B10) in parallel with Frontend landing and dashboard polish. Unify findings (B13) as soon as possible so Data, Frontend, and AI can build without rework. Avoid putting the whole auth spine on one person; split B6/B7/B10 and align with P4 so Frontend and Backend stay in sync.

---

## Milestones (good flow order)

Use these as **GitHub Milestones** so issues are in order for flow. Each milestone is a coherent batch that unblocks the next.

| Milestone | Name | Issues | Goal |
|------------|------|--------|------|
| **M1** | Foundation & process | F1, F2, F3, F4, F5, F6, P1, P2, P4 | CI green, docs updated, acceptance criteria set. Everyone can clone, PR, and know “done” for Landing + OAuth. |
| **M2** | Auth spine (backend) | B1, B6, B7, B10 | Cognito exists; login flow and JWT validation work. Frontend can integrate. |
| **M3** | Auth + landing (frontend) | W1, W2, W3 | Landing page live; login/signup and session work end-to-end. |
| **M4** | Single-account quality | S1, S2, S3, B13, B14b, B17, B18, A8, A9, W8, W9, W10, **W10b**, W11 | Fewer FPs, one findings schema, **API for latest scans (refresh)**, health/metrics, core charts, **scan results persist on refresh**. |
| **M5** | Multi-account backend | B2, B4, B8, B11, B12 | Design + implement cross-account and account APIs. |
| **M6** | Multi-account frontend | W5, W6, W7 | Account status, switcher, and multi-account dashboard. |
| **M7** | RBAC & security review | B9, S15, S16, W4 | Roles enforced; Cognito and authz reviewed; onboarding flow. |
| **M8** | Data & reporting | A1–A7, A10–A15 | Metrics, pipelines, Grafana dashboards, export, docs. |
| **M9** | DevOps & ops polish | D1–D14, P3, P5 | Pipelines, envs, rollback, docs, access policy, retro. |
| **M10** | AI & intelligence | I1–I17 | Use cases, schema, guardrails, suggestions, compliance, dashboard integration, docs. |

**Flow:** M1 → M2 → M3 (first login) → M4 (quality) → M5 → M6 (multi-account) → M7 (RBAC) → M8/M9 in parallel → M10 when B13 and APIs are stable.

---

## Issue Count Summary

| Department | # of issues |
|------------|-------------|
| Foundation | 6 |
| PMO | 5 |
| Backend | 20 |
| Frontend | 19 |
| Security | 18 |
| DevOps | 14 |
| Data | 15 |
| AI | 17 |
| **Total** | **114** |

Use labels and project columns (e.g. "By team", "Priority", "Size") when creating issues. **This semester:** use [Issue breakdown](#issue-breakdown-semester-target) (~70 issues total) and [Team scopes](#team-scopes-trimmed--locked); the full list above is reference and post-semester backlog.

---

*Last updated: Semester-safe backlog (Feb 17 – Apr 17); adjust estimates and assignees when creating issues.*
