/**
 * Logging utility that reduces console spam in production
 * while maintaining important error and warning messages
 */

/**
 * Determines if we should show debug logs
 * Only shows debug logs in development mode
 */
const shouldShowDebugLogs = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Debug log - only shows in development
 */
export const debugLog = (...args: any[]): void => {
  if (shouldShowDebugLogs()) {
    console.log(...args);
  }
};

/**
 * Info log - shows in both dev and production for important info
 */
export const infoLog = (...args: any[]): void => {
  console.log(...args);
};

/**
 * Warning log - always shows as these are important
 */
export const warnLog = (...args: any[]): void => {
  console.warn(...args);
};

/**
 * Error log - always shows as these are critical
 */
export const errorLog = (...args: any[]): void => {
  console.error(...args);
};

/**
 * Image-specific debug logging
 */
export const imageDebugLog = (message: string, data?: any): void => {
  if (shouldShowDebugLogs()) {
    console.log(`[Image Debug] ${message}`, data || '');
  }
};
