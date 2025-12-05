/**
 * Shared UI utility functions for consistent styling across components
 */

/**
 * Get badge color class for severity levels
 * Handles both uppercase and capitalized severity strings
 */
export function getSeverityColor(severity: string | number): string {
  const severityStr = typeof severity === 'number' 
    ? severity >= 8 ? 'Critical' : severity >= 6 ? 'High' : severity >= 4 ? 'Medium' : 'Low'
    : severity;
  
  const normalized = severityStr.toUpperCase();
  
  switch (normalized) {
    case 'CRITICAL':
      return 'bg-[#ff0040] text-white';
    case 'HIGH':
      return 'bg-[#ff6b35] text-white';
    case 'MEDIUM':
      return 'bg-[#ffb000] text-black';
    case 'LOW':
      return 'bg-[#00ff88] text-black';
    case 'INFORMATIONAL':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Get badge color class for status values
 */
export function getStatusColor(status: string): string {
  const normalized = status.toUpperCase();
  
  switch (normalized) {
    case 'ACTIVE':
    case 'NEW':
      return 'bg-[#ff0040] text-white';
    case 'ACKNOWLEDGED':
    case 'NOTIFIED':
      return 'bg-[#ffb000] text-black';
    case 'RESOLVED':
      return 'bg-[#00ff88] text-black';
    case 'SUPPRESSED':
    case 'CLOSED':
      return 'bg-gray-500 text-white';
    case 'IN PROGRESS':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Get badge color class for EC2 instance states
 */
export function getStateColor(state: string): string {
  const normalized = state.toLowerCase();
  
  switch (normalized) {
    case 'running':
      return 'bg-[#00ff88] text-black';
    case 'stopped':
      return 'bg-[#94a3b8] text-white';
    case 'pending':
      return 'bg-[#ffb000] text-black';
    case 'terminated':
      return 'bg-[#ff0040] text-white';
    case 'stopping':
      return 'bg-[#ff6b35] text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Format timestamp to readable date string
 */
export function formatTimestamp(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 * This is the format used in Dashboard and ComplianceDashboard
 */
export function formatRelativeTime(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) {
      return typeof timestamp === 'string' ? timestamp : 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  } catch {
    return typeof timestamp === 'string' ? timestamp : 'Invalid date';
  }
}

