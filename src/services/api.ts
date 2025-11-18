/**
 * API Service for IAM Dashboard
 * Handles all communication with the AWS API Gateway endpoints
 */

// API Gateway base URL - can be overridden via environment variable
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://erh3a09d7l.execute-api.us-east-1.amazonaws.com/v1';

export type ScannerType = 
  | 'security-hub'
  | 'guardduty'
  | 'config'
  | 'inspector'
  | 'macie'
  | 'iam'
  | 'ec2'
  | 's3'
  | 'full';

export interface ScanRequest {
  region?: string;
  scan_parameters?: Record<string, any>;
}

export interface ScanResponse {
  scan_id: string;
  scanner_type: string;
  region: string;
  status: 'completed' | 'running' | 'failed';
  results?: any;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface APIError {
  error: string;
  message: string;
  scan_id?: string;
  scanner_type?: string;
}

/**
 * Make a request to the API Gateway
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData: APIError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: 'Request failed',
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    throw new Error(errorData.message || errorData.error || 'API request failed');
  }

  return response.json();
}

/**
 * Trigger a security scan
 */
export async function triggerScan(
  scannerType: ScannerType,
  request: ScanRequest = {}
): Promise<ScanResponse> {
  const body: ScanRequest = {
    region: request.region || 'us-east-1',
    ...request.scan_parameters,
  };

  return apiRequest<ScanResponse>(`/scan/${scannerType}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Security Hub scan
 */
export async function scanSecurityHub(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('security-hub', { region });
}

/**
 * GuardDuty scan
 */
export async function scanGuardDuty(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('guardduty', { region });
}

/**
 * AWS Config scan
 */
export async function scanConfig(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('config', { region });
}

/**
 * Inspector scan
 */
export async function scanInspector(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('inspector', { region });
}

/**
 * Macie scan
 */
export async function scanMacie(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('macie', { region });
}

/**
 * IAM scan
 */
export async function scanIAM(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('iam', { region });
}

/**
 * EC2 scan
 */
export async function scanEC2(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('ec2', { region });
}

/**
 * S3 scan
 */
export async function scanS3(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('s3', { region });
}

/**
 * Full scan (all scanners)
 */
export async function scanFull(region: string = 'us-east-1'): Promise<ScanResponse> {
  return triggerScan('full', { region });
}

/**
 * Get API base URL (useful for debugging)
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}


