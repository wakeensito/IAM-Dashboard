/**
 * PDF Export Service
 * Generates PDF reports from scan results
 */

export interface ScanResultData {
  scan_id: string;
  scanner_type: string;
  region: string;
  status: string;
  timestamp: string;
  results?: any;
  findings?: any[];
  scan_summary?: {
    critical_findings?: number;
    high_findings?: number;
    medium_findings?: number;
    low_findings?: number;
    users?: number;
    roles?: number;
    policies?: number;
    groups?: number;
  };
}

/**
 * Generate a PDF from scan result data
 * Uses browser's print functionality as a simple solution
 * For production, consider using jspdf or react-pdf
 */
export function exportScanResultToPDF(data: ScanResultData, title: string = 'Security Scan Report'): void {
  // Create a temporary HTML element with the report content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups for this site.');
  }

  const htmlContent = generateReportHTML(data, title);
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Optionally close after printing
      // printWindow.close();
    }, 250);
  };
}

/**
 * Generate HTML content for the PDF report
 */
function generateReportHTML(data: ScanResultData, title: string): string {
  const date = new Date(data.timestamp).toLocaleString();
  const summary = data.scan_summary || {};

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      border-bottom: 3px solid #0066cc;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0066cc;
      margin: 0;
    }
    .meta-info {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #0066cc;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .summary-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    .summary-card h3 {
      margin: 0;
      font-size: 24px;
      color: #0066cc;
    }
    .summary-card p {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #666;
    }
    .critical { color: #ff0040; }
    .high { color: #ff6b35; }
    .medium { color: #ffb000; }
    .low { color: #00ff88; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 11px;
      color: #666;
      text-align: center;
    }
    @media print {
      body { margin: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="meta-info">
      <p><strong>Scan ID:</strong> ${data.scan_id}</p>
      <p><strong>Scanner Type:</strong> ${data.scanner_type.toUpperCase()}</p>
      <p><strong>Region:</strong> ${data.region}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Generated:</strong> ${date}</p>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <h3 class="critical">${summary.critical_findings || 0}</h3>
        <p>Critical Findings</p>
      </div>
      <div class="summary-card">
        <h3 class="high">${summary.high_findings || 0}</h3>
        <p>High Findings</p>
      </div>
      <div class="summary-card">
        <h3 class="medium">${summary.medium_findings || 0}</h3>
        <p>Medium Findings</p>
      </div>
      <div class="summary-card">
        <h3 class="low">${summary.low_findings || 0}</h3>
        <p>Low Findings</p>
      </div>
    </div>
  </div>

  ${data.scan_summary ? `
  <div class="section">
    <h2>Resource Summary</h2>
    <table>
      <tr>
        <th>Resource Type</th>
        <th>Count</th>
      </tr>
      ${summary.users ? `<tr><td>Users</td><td>${summary.users}</td></tr>` : ''}
      ${summary.roles ? `<tr><td>Roles</td><td>${summary.roles}</td></tr>` : ''}
      ${summary.policies ? `<tr><td>Policies</td><td>${summary.policies}</td></tr>` : ''}
      ${summary.groups ? `<tr><td>Groups</td><td>${summary.groups}</td></tr>` : ''}
    </table>
  </div>
  ` : ''}

  ${data.findings && data.findings.length > 0 ? `
  <div class="section">
    <h2>Detailed Findings</h2>
    <table>
      <thead>
        <tr>
          <th>Severity</th>
          <th>Type</th>
          <th>Resource</th>
          <th>Description</th>
          <th>Recommendation</th>
        </tr>
      </thead>
      <tbody>
        ${data.findings.map((finding: any) => `
          <tr>
            <td class="${finding.severity?.toLowerCase() || 'low'}">${finding.severity || 'N/A'}</td>
            <td>${finding.type || finding.finding_type || 'N/A'}</td>
            <td>${finding.resource_name || finding.resource_arn || 'N/A'}</td>
            <td>${finding.description || 'No description'}</td>
            <td>${finding.recommendation || 'No recommendation'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <h2>Scan Details</h2>
    <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(data.results || {}, null, 2)}
    </pre>
  </div>

  <div class="footer">
    <p>Generated by IAM Dashboard Security Scanner</p>
    <p>This report was automatically generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
}

/**
 * Download scan result as JSON file
 */
export function exportScanResultToJSON(data: ScanResultData, filename?: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `scan-${data.scan_id}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download scan result as CSV file
 */
export function exportScanResultToCSV(data: ScanResultData, filename?: string): void {
  if (!data.findings || data.findings.length === 0) {
    throw new Error('No findings to export');
  }

  const headers = ['Severity', 'Type', 'Resource Name', 'Resource ARN', 'Description', 'Recommendation'];
  const rows = data.findings.map((finding: any) => [
    finding.severity || '',
    finding.type || finding.finding_type || '',
    finding.resource_name || '',
    finding.resource_arn || '',
    (finding.description || '').replace(/,/g, ';'), // Replace commas to avoid CSV issues
    (finding.recommendation || '').replace(/,/g, ';')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `scan-${data.scan_id}-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


