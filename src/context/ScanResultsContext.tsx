/**
 * Scan Results Context
 * Stores scan results from all scanner components for use in Reports
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ScanResponse } from '../services/api';

export interface StoredScanResult {
  scan_id: string;
  scanner_type: string;
  region: string;
  status: string;
  timestamp: string;
  results: any;
  scan_summary?: {
    critical_findings?: number;
    high_findings?: number;
    medium_findings?: number;
    low_findings?: number;
    users?: number;
    roles?: number;
    policies?: number;
    groups?: number;
    [key: string]: any;
  };
  findings?: any[];
}

interface ScanResultsContextType {
  scanResults: Map<string, StoredScanResult>;
  addScanResult: (result: ScanResponse) => void;
  getScanResult: (scannerType: string) => StoredScanResult | null;
  getAllScanResults: () => StoredScanResult[];
  clearScanResults: () => void;
}

const ScanResultsContext = createContext<ScanResultsContextType | undefined>(undefined);

export function ScanResultsProvider({ children }: { children: ReactNode }) {
  const [scanResults, setScanResults] = useState<Map<string, StoredScanResult>>(new Map());

  const addScanResult = (result: ScanResponse) => {
    setScanResults(prev => {
      const newMap = new Map(prev);
      
      // Extract scan summary - try multiple locations
      let scanSummary = result.results?.scan_summary;
      if (!scanSummary) {
        scanSummary = extractScanSummary(result.results);
      }
      
      // Extract findings - try multiple locations
      let findings = result.results?.findings;
      if (!findings || findings.length === 0) {
        // For IAM scans, findings might be in a different format
        findings = result.results?.findings || [];
      }
      
      const storedResult: StoredScanResult = {
        scan_id: result.scan_id,
        scanner_type: result.scanner_type,
        region: result.region,
        status: result.status,
        timestamp: result.timestamp,
        results: result.results,
        scan_summary: scanSummary,
        findings: findings
      };
      newMap.set(result.scanner_type, storedResult);
      return newMap;
    });
  };

  const getScanResult = (scannerType: string): StoredScanResult | null => {
    return scanResults.get(scannerType) || null;
  };

  const getAllScanResults = (): StoredScanResult[] => {
    return Array.from(scanResults.values());
  };

  const clearScanResults = () => {
    setScanResults(new Map());
  };

  return (
    <ScanResultsContext.Provider
      value={{
        scanResults,
        addScanResult,
        getScanResult,
        getAllScanResults,
        clearScanResults
      }}
    >
      {children}
    </ScanResultsContext.Provider>
  );
}

export function useScanResults() {
  const context = useContext(ScanResultsContext);
  if (context === undefined) {
    throw new Error('useScanResults must be used within a ScanResultsProvider');
  }
  return context;
}

/**
 * Extract scan summary from various result formats
 */
function extractScanSummary(results: any): StoredScanResult['scan_summary'] {
  if (!results) return undefined;

  // Try to find summary in different possible locations
  if (results.scan_summary) {
    return results.scan_summary;
  }

  // For IAM scans
  if (results.users || results.roles) {
    return {
      users: results.users?.total || 0,
      roles: results.roles?.total || 0,
      policies: results.policies?.total || 0,
      groups: results.groups?.total || 0
    };
  }

  // For S3 scans
  if (results.buckets) {
    return {
      critical_findings: results.buckets.public || 0,
      high_findings: results.buckets.unencrypted || 0
    };
  }

  // For EC2 scans
  if (results.instances) {
    return {
      critical_findings: results.instances.public || 0,
      high_findings: results.instances.without_imdsv2 || 0
    };
  }

  // For findings-based scans
  if (Array.isArray(results.findings)) {
    const findings = results.findings;
    return {
      critical_findings: findings.filter((f: any) => f.severity === 'Critical').length,
      high_findings: findings.filter((f: any) => f.severity === 'High').length,
      medium_findings: findings.filter((f: any) => f.severity === 'Medium').length,
      low_findings: findings.filter((f: any) => f.severity === 'Low').length
    };
  }

  return undefined;
}

