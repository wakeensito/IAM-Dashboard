"""
Flask API Resource for Security Scans (Checkov, Gitleaks, OPA)
"""

from flask_restful import Resource, reqparse
from flask import request
from services.security_scanner_service import SecurityScannerService
from services.database_service import DatabaseService
import json

scanner_service = SecurityScannerService()
db_service = DatabaseService()

class SecurityScanResource(Resource):
    def post(self):
        """Trigger a security scan (Checkov, Gitleaks, OPA) and store results"""
        parser = reqparse.RequestParser()
        parser.add_argument('scanner', type=str, required=True, help='Scanner type (checkov, gitleaks, opa)')
        parser.add_argument('target', type=str, required=True, help='Target path or repo')
        parser.add_argument('input_path', type=str, required=False, help='OPA input file (for OPA only)')
        args = parser.parse_args()

        scanner = args['scanner'].lower()
        target = args['target']
        input_path = args.get('input_path')

        if scanner == 'checkov':
            result = scanner_service.run_checkov(target)
            parsed = self.parse_checkov_result(result)
        elif scanner == 'gitleaks':
            result = scanner_service.run_gitleaks(target)
            parsed = self.parse_gitleaks_result(result)
        elif scanner == 'opa':
            if not input_path:
                return {'error': 'input_path required for OPA'}, 400
            result = scanner_service.run_opa(target, input_path)
            parsed = self.parse_opa_result(result)
        else:
            return {'error': 'Invalid scanner type'}, 400

        if result is None:
            return {'error': 'Scan failed'}, 500

        # Store parsed result in DB as JSON string
        db_service.create_scanner_result(scanner, target, json.dumps(parsed))
        return {'message': 'Scan completed and result stored', 'scanner': scanner, 'parsed': parsed}, 201

    def get(self):
        """Retrieve scan results (optionally filter by scanner)"""
        scanner = request.args.get('scanner')
        results = db_service.get_scanner_results(scanner=scanner)
        # Return as JSON
        return {'results': [
            {
                'id': r.id,
                'scanner': r.scanner,
                'target': r.target,
                'result': json.loads(r.result) if r.result else {},
                'created_at': r.created_at.isoformat()
            } for r in results
        ]}

    def parse_checkov_result(self, result):
        """Parse Checkov JSON output into summary and findings"""
        try:
            data = json.loads(result)
            summary = data.get('summary', {})
            results = data.get('results', {})
            failed = results.get('failed_checks', [])
            passed = results.get('passed_checks', [])
            return {
                'summary': summary,
                'failed_checks': failed,
                'passed_checks': passed
            }
        except Exception:
            return {'error': 'Invalid Checkov output'}

    def parse_gitleaks_result(self, result):
        """Parse Gitleaks JSON output into findings list"""
        try:
            findings = json.loads(result)
            return {
                'total_findings': len(findings),
                'findings': findings
            }
        except Exception:
            return {'error': 'Invalid Gitleaks output'}

    def parse_opa_result(self, result):
        """Parse OPA JSON output into decisions/results"""
        try:
            data = json.loads(result)
            result_set = data.get('result', [])
            return {
                'result': result_set
            }
        except Exception:
            return {'error': 'Invalid OPA output'}
