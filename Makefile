# DevSecOps Security Scanning Makefile for IAM Dashboard
# Cross-platform Makefile for running security scans with Docker

.PHONY: help scan opa checkov gitleaks clean-scans check-docker

# Default target
help: ## Show available commands
	@echo "DevSecOps Security Scanning Commands"
	@echo "===================================="
	@echo ""
	@echo "Main Commands:"
	@echo "  make scan        - Run all security scans (OPA + Checkov + Gitleaks)"
	@echo "  make opa         - Run OPA policy validation"
	@echo "  make checkov     - Run Checkov infrastructure scan"
	@echo "  make gitleaks    - Run Gitleaks secret detection"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make clean-scans - Clean up scan results and containers"
	@echo "  make check-docker - Check if Docker is available"
	@echo "  make help        - Show this help message"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Docker and Docker Compose installed"
	@echo "  - Run 'make check-docker' to verify setup"

# Check if Docker is available
check-docker: ## Check if Docker is available
	@echo "Checking Docker availability..."
	@docker --version >/dev/null 2>&1 || (echo "❌ Docker is not installed or not in PATH" && echo "Please install Docker: https://docs.docker.com/get-docker/" && exit 1)
	@docker compose version >/dev/null 2>&1 || docker-compose --version >/dev/null 2>&1 || (echo "❌ Docker Compose is not installed or not in PATH" && echo "Please install Docker Compose: https://docs.docker.com/compose/install/" && exit 1)
	@echo "✅ Docker and Docker Compose are available"
	@docker --version
	@docker compose version 2>/dev/null || docker-compose --version

# Run all security scans
scan: check-docker ## Run all security scans (OPA + Checkov + Gitleaks)
	@mkdir -p scanner-results
	@echo "🔍 Running all security scans..."
	@echo "================================="
	@echo ""
	@echo "1️⃣ Running OPA policy validation..."
	@-$(MAKE) opa || true
	@echo ""
	@echo "2️⃣ Running Checkov infrastructure scan..."
	@-$(MAKE) checkov || true
	@echo ""
	@echo "3️⃣ Running Gitleaks secret detection..."
	@-$(MAKE) gitleaks || true
	@echo ""
	@echo "✅ All security scans completed!"
	@echo "Check scanner-results/ directory for detailed results."

# Run OPA policy validation
opa: check-docker ## Run OPA policy validation
	@mkdir -p scanner-results
	@echo "🔍 Running OPA policy validation..."
	@docker-compose --profile scanners run --rm opa-scanner > scanner-results/opa-results.json 2>&1; \
	EXIT_CODE=$$?; \
	if [ $$EXIT_CODE -eq 0 ]; then \
		echo "✅ OPA policy validation passed (no test failures)"; \
	else \
		echo "⚠️  OPA found policy violations (check scanner-results/opa-results.json)"; \
		echo "✅ OPA scan completed - results saved to scanner-results/opa-results.json"; \
	fi

# Run Checkov infrastructure scan
checkov: check-docker ## Run Checkov infrastructure scan
	@mkdir -p scanner-results
	@echo "🔍 Running Checkov infrastructure scan..."
	@docker-compose --profile scanners run --rm checkov-scanner > scanner-results/checkov-results.json 2>&1; \
	EXIT_CODE=$$?; \
	if [ $$EXIT_CODE -eq 0 ]; then \
		echo "✅ Checkov scan passed (no security issues found)"; \
	else \
		echo "⚠️  Checkov found security misconfigurations (check scanner-results/checkov-results.json)"; \
		echo "✅ Checkov scan completed - results saved to scanner-results/checkov-results.json"; \
	fi

# Run Gitleaks secret detection
gitleaks: check-docker ## Run Gitleaks secret detection
	@mkdir -p scanner-results
	@echo "🔍 Running Gitleaks secret detection..."
	@docker-compose --profile scanners run --rm gitleaks-scanner > scanner-results/gitleaks-results.json 2>&1; \
	EXIT_CODE=$$?; \
	if [ $$EXIT_CODE -eq 0 ]; then \
		echo "✅ Gitleaks scan passed (no secrets detected)"; \
	else \
		echo "⚠️  Gitleaks detected potential secrets (check scanner-results/gitleaks-results.json)"; \
		echo "✅ Gitleaks scan completed - results saved to scanner-results/gitleaks-results.json"; \
	fi

# Clean up scan results and containers
clean-scans: ## Clean up scan results and containers
	@echo "🧹 Cleaning up scan results and containers..."
	@docker-compose --profile scanners down --remove-orphans 2>/dev/null || echo "No containers to clean"
	@rm -rf scanner-results/*.json 2>/dev/null || echo "No scan results to clean"
	@echo "✅ Cleanup completed"

# Quick scan for pre-commit checks
quick-scan: check-docker ## Quick scan for pre-commit checks (Gitleaks only)
	@echo "⚡ Running quick pre-commit scan (Gitleaks)..."
	@$(MAKE) gitleaks

# Individual scan targets for specific use cases
scan-iac: check-docker ## Scan only Infrastructure as Code (Checkov)
	@echo "🏗️ Running Infrastructure as Code scan..."
	@$(MAKE) checkov

scan-policies: check-docker ## Scan only OPA policies
	@echo "📋 Running OPA policy scan..."
	@$(MAKE) opa

scan-secrets: check-docker ## Scan only for secrets (Gitleaks)
	@echo "🔐 Running secret detection scan..."
	@$(MAKE) gitleaks

# Development targets
dev-setup: check-docker ## Set up development environment
	@echo "🚀 Setting up development environment..."
	@echo "✅ Docker environment ready for development"
	@echo "Run 'make scan' to perform security scans"

# Show scan results
show-results: ## Show recent scan results
	@echo "📊 Recent scan results:"
	@if [ -f scanner-results/opa-results.json ]; then echo "📁 OPA results: scanner-results/opa-results.json"; else echo "❌ No OPA results found"; fi
	@if [ -f scanner-results/checkov-results.json ]; then echo "📁 Checkov results: scanner-results/checkov-results.json"; else echo "❌ No Checkov results found"; fi
	@if [ -f scanner-results/gitleaks-results.json ]; then echo "📁 Gitleaks results: scanner-results/gitleaks-results.json"; else echo "❌ No Gitleaks results found"; fi
	@if [ ! -f scanner-results/opa-results.json ] && [ ! -f scanner-results/checkov-results.json ] && [ ! -f scanner-results/gitleaks-results.json ]; then \
		echo "📁 No scan results found. Run 'make scan' first."; \
	fi

# Status check
status: check-docker ## Show current status
	@echo "📊 DevSecOps Scanner Status"
	@echo "=========================="
	@echo "Docker: ✅ Available"
	@echo "Docker Compose: ✅ Available"
	@echo "Scanner Services: Ready to run"
	@echo ""
	@echo "Available commands:"
	@echo "  make scan     - Run all scans"
	@echo "  make opa      - Run OPA only"
	@echo "  make checkov  - Run Checkov only"
	@echo "  make gitleaks - Run Gitleaks only"



