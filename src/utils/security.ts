/**
 * Security utility functions for masking sensitive data
 */

/**
 * Masks AWS ARNs to prevent exposure of account IDs and sensitive resource identifiers
 * ARN format: arn:aws:service:region:account-id:resource-type/resource-id
 * Shows: arn:aws:service:region:****:resource-type/...xxxx (masks account ID and part of resource ID)
 */
export function maskARN(value: string | undefined | null): string {
  if (!value) return value || '';
  
  // AWS ARN pattern: arn:aws:service:region:account-id:resource-type/resource-id
  const arnPattern = /(arn:aws:[^:]+:[^:]*:)([0-9]{12}|[a-z0-9-]+)(:)([^/]+)(\/)(.+)/gi;
  
  return value.replace(arnPattern, (match, prefix, accountId, colon, resourceType, slash, resourceId) => {
    // Mask account ID (12 digits or alphanumeric)
    const maskedAccountId = accountId.length === 12 
      ? '****' 
      : accountId.length > 4 
        ? `${accountId.substring(0, 2)}...${accountId.substring(accountId.length - 2)}`
        : '****';
    
    // Mask resource ID if it's long (show first 4 and last 4 chars)
    let maskedResourceId = resourceId;
    if (resourceId.length > 12) {
      maskedResourceId = `${resourceId.substring(0, 4)}...${resourceId.substring(resourceId.length - 4)}`;
    } else if (resourceId.length > 8) {
      maskedResourceId = `${resourceId.substring(0, 2)}...${resourceId.substring(resourceId.length - 2)}`;
    }
    
    return `${prefix}${maskedAccountId}${colon}${resourceType}${slash}${maskedResourceId}`;
  });
}

/**
 * Masks AWS access keys to prevent exposure
 * AWS access keys are 20 characters: AKIA + 16 alphanumeric
 * Shows: AKIA...xxxx (first 4 + last 4 characters)
 */
export function maskAccessKey(value: string | undefined | null): string {
  if (!value) return value || '';
  
  // AWS access key pattern: AKIA followed by 16 alphanumeric characters
  const accessKeyPattern = /(AKIA[0-9A-Z]{16})/gi;
  
  return value.replace(accessKeyPattern, (match) => {
    if (match.length === 20) {
      // Show first 4 and last 4 characters
      return `${match.substring(0, 4)}...${match.substring(16)}`;
    }
    return match;
  });
}

/**
 * Masks both access keys and ARNs in a string
 */
export function maskSensitiveData(value: string | undefined | null): string {
  if (!value) return value || '';
  let masked = maskARN(value);
  masked = maskAccessKey(masked);
  return masked;
}

/**
 * Checks if a string contains an AWS access key
 */
export function containsAccessKey(value: string | undefined | null): boolean {
  if (!value) return false;
  return /AKIA[0-9A-Z]{16}/gi.test(value);
}

/**
 * Checks if a string contains an AWS ARN
 */
export function containsARN(value: string | undefined | null): boolean {
  if (!value) return false;
  return /arn:aws:[^:]+:[^:]*:[^:]+:[^/]+\/.+/gi.test(value);
}

