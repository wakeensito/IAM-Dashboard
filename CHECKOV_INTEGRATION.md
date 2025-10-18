# Checkov Integration for IAM Dashboard

## Overview

The Checkov integration has been successfully implemented in the AWS IAM Security Scan component. Users can now click the "Start Checkov IAM Scan" button to run automated security scans using Checkov.

## Features Implemented

### 1. Interactive Checkov Scan Button

- **Location**: AWS IAM Scan component (`src/components/AWSIAMScan.tsx`)
- **Button Text**: "Start Checkov IAM Scan" (changes to "Scanning..." during execution)
- **Functionality**: Triggers actual Checkov scan via backend API

### 2. Backend API Integration

- **Endpoint**: `POST /api/v1/run-checkov`
- **Location**: `backend/app.py`
- **Functionality**:
  - Runs Checkov command: `checkov -d . --output json --output-file-path ../scanner-results/checkov-results.json`
  - Creates scanner-results directory if it doesn't exist
  - Returns success/error status

### 3. Results Display

- **New Tab**: "Checkov Results" tab in the scan results section
- **Features**:
  - Summary cards showing passed/failed/skipped checks and resource count
  - Checkov version information
  - Detailed failed checks with file paths and descriptions
  - Success message when no issues are found

### 4. File Serving

- **Endpoint**: `GET /scanner-results/<filename>`
- **Functionality**: Serves Checkov result files from the scanner-results directory

## How It Works

### User Flow

1. User navigates to the IAM Security section
2. User clicks "Start Checkov IAM Scan"
3. Backend executes Checkov scan on the current directory
4. Results are saved to `scanner-results/checkov-results.json`
5. Frontend fetches and displays results in the "Checkov Results" tab

### Technical Implementation

1. **Frontend**: Modified `AWSIAMScan.tsx` to call Checkov API and display results
2. **Backend**: Enhanced `app.py` with Checkov execution and file serving endpoints
3. **Data Flow**:
   ```
   UI Button → Backend API → Checkov Command → JSON Results → UI Display
   ```

## File Structure

```
IAM-Dashboard/
├── scanner-results/
│   └── checkov-results.json          # Checkov scan results
├── backend/
│   └── app.py                        # Enhanced with Checkov endpoints
└── src/components/
    └── AWSIAMScan.tsx               # Enhanced with Checkov integration
```

## Usage Instructions

### Prerequisites

- Checkov must be installed: `pip install checkov`
- Backend server running on `http://127.0.0.1:5000`
- Frontend development server running

### Running a Scan

1. Start the backend: `cd backend && python app.py`
2. Start the frontend: `npm run dev`
3. Navigate to the IAM Security section
4. Click "Start Checkov IAM Scan"
5. Wait for scan completion (progress bar shows status)
6. View results in the "Checkov Results" tab

## Result Format

The Checkov results JSON includes:

```json
{
  "check_type": "dockerfile",
  "results": {
    "failed_checks": []
  },
  "summary": {
    "passed": 133,
    "failed": 0,
    "skipped": 0,
    "parsing_errors": 0,
    "resource_count": 1,
    "checkov_version": "3.1.25"
  }
}
```

## Benefits

- **Automated Security Scanning**: No manual command-line execution needed
- **Interactive Results**: Visual display of security findings
- **Integrated Workflow**: Seamlessly integrated into existing IAM dashboard
- **Real-time Progress**: Progress bar and status updates during scan
- **Detailed Reporting**: Comprehensive view of passed/failed checks

## Future Enhancements

- Add filtering options for specific check types
- Implement scan scheduling/automation
- Add export functionality for reports
- Integrate with CI/CD pipelines
- Add more granular error handling and retry logic

