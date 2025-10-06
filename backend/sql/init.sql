-- Initialize Cybersecurity Dashboard Database
-- This script sets up the initial database schema

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cybersecurity_db;

-- Use the database
\c cybersecurity_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_findings_severity ON security_findings(severity);
CREATE INDEX IF NOT EXISTS idx_security_findings_status ON security_findings(status);
CREATE INDEX IF NOT EXISTS idx_security_findings_created_at ON security_findings(created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_status_framework ON compliance_status(framework);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Create views for common queries
CREATE OR REPLACE VIEW security_findings_summary AS
SELECT 
    severity,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_resolution_hours
FROM security_findings
GROUP BY severity, status;

CREATE OR REPLACE VIEW compliance_summary AS
SELECT 
    framework,
    status,
    COUNT(*) as resource_count,
    AVG(score) as avg_score
FROM compliance_status
GROUP BY framework, status;

-- Insert sample data for development
INSERT INTO security_findings (finding_id, title, description, severity, status, resource_type, resource_id, region, account_id) VALUES
('FINDING-001', 'S3 Bucket Public Access', 'S3 bucket has public read access enabled', 'HIGH', 'NEW', 'AWS::S3::Bucket', 'my-bucket-123', 'us-east-1', '123456789012'),
('FINDING-002', 'EC2 Instance Without Encryption', 'EC2 instance has unencrypted EBS volumes', 'MEDIUM', 'NEW', 'AWS::EC2::Instance', 'i-1234567890abcdef0', 'us-east-1', '123456789012'),
('FINDING-003', 'IAM User Without MFA', 'IAM user does not have MFA enabled', 'HIGH', 'NEW', 'AWS::IAM::User', 'john.doe', 'us-east-1', '123456789012');

INSERT INTO compliance_status (framework, resource_id, status, score, findings_count, region, account_id) VALUES
('SOC2', 'account-123456789012', 'COMPLIANT', 85.5, 2, 'us-east-1', '123456789012'),
('PCI_DSS', 'account-123456789012', 'NON_COMPLIANT', 65.0, 5, 'us-east-1', '123456789012'),
('HIPAA', 'account-123456789012', 'COMPLIANT', 92.0, 1, 'us-east-1', '123456789012');

INSERT INTO performance_metrics (metric_name, value, unit, region, account_id) VALUES
('cpu_usage', 45.2, 'percent', 'us-east-1', '123456789012'),
('memory_usage', 67.8, 'percent', 'us-east-1', '123456789012'),
('disk_usage', 23.4, 'percent', 'us-east-1', '123456789012'),
('response_time', 125.6, 'milliseconds', 'us-east-1', '123456789012');
