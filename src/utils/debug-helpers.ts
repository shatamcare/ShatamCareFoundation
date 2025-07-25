/**
 * debug-helpers.ts
 * Debug utilities for development and troubleshooting
 */

import { isProduction, getBaseUrl } from './url-helpers';

/**
 * Logs detailed environment information to help debug URL-related issues
 */
export function logEnvironmentInfo(): void {
  if (!isProduction()) {
    console.group('📊 Environment Information');
    console.log('🌎 isProduction:', isProduction());
    console.log('🔗 Base URL:', getBaseUrl());
    console.log('📍 Current location:', window.location.href);
    
    if (window.location.hostname.includes('github.io')) {
      console.log('🚀 GitHub Pages detected');
      console.log('📁 Repository name:', window.location.pathname.split('/')[1] || 'unknown');
    }
    
    // Check storage availability
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      console.log('💾 Local Storage: Available');
    } catch (e) {
      console.warn('💾 Local Storage: Not available', e);
    }

    console.groupEnd();
  }
}

/**
 * Logs information about image URL resolution
 */
export function logImageUrlDebug(originalUrl: string, resolvedUrl: string, source: string): void {
  if (!isProduction()) {
    console.group(`🖼️ Image URL Resolution (${source})`);
    console.log('Original URL:', originalUrl);
    console.log('Resolved URL:', resolvedUrl);
    console.log('Base URL:', getBaseUrl());
    console.groupEnd();
  }
}
