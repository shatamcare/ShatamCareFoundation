import React, { useEffect, useState } from 'react';
import { isProduction, getBaseUrl } from '../utils/url-helpers';

/**
 * Debug panel component that shows environment information
 * Only visible in development mode or when explicitly enabled
 */
const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [envInfo, setEnvInfo] = useState({
    isProduction: false,
    baseUrl: '',
    location: '',
    isGithubPages: false,
    repoName: '',
    localStorage: false,
  });

  useEffect(() => {
    // Determine if panel should be visible
    const forceShow = localStorage.getItem('debug_panel_enabled') === 'true';
    setIsVisible(!isProduction() || forceShow);
    
    // Gather environment information
    const isProd = isProduction();
    const base = getBaseUrl();
    const loc = window.location.href;
    const isGitHub = window.location.hostname.includes('github.io');
    const repo = isGitHub ? window.location.pathname.split('/')[1] || 'unknown' : '';
    
    // Check localStorage
    let storageAvailable = false;
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      storageAvailable = true;
    } catch (e) {
      console.warn('Local Storage not available:', e);
    }
    
    setEnvInfo({
      isProduction: isProd,
      baseUrl: base,
      location: loc,
      isGithubPages: isGitHub,
      repoName: repo,
      localStorage: storageAvailable,
    });
  }, []);

  // Hide if not visible
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 5px', color: '#61dafb' }}>Debug Information</h3>
      <div>
        <p style={{ margin: '2px 0' }}>
          <strong>Production:</strong> {envInfo.isProduction ? 'Yes' : 'No'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>Base URL:</strong> {envInfo.baseUrl || '<none>'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>GitHub Pages:</strong> {envInfo.isGithubPages ? 'Yes' : 'No'}
        </p>
        {envInfo.isGithubPages && (
          <p style={{ margin: '2px 0' }}>
            <strong>Repository:</strong> {envInfo.repoName}
          </p>
        )}
        <p style={{ margin: '2px 0' }}>
          <strong>localStorage:</strong> {envInfo.localStorage ? 'Available' : 'Not Available'}
        </p>
        <button 
          onClick={() => {
            localStorage.setItem('debug_panel_enabled', 'false');
            setIsVisible(false);
          }}
          style={{
            backgroundColor: '#61dafb',
            color: 'black',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '3px',
            marginTop: '5px',
            cursor: 'pointer',
          }}
        >
          Hide
        </button>
        <button 
          onClick={() => {
            console.log('Current environment:', envInfo);
            console.log('Current location:', window.location);
          }}
          style={{
            backgroundColor: '#61dafb',
            color: 'black',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '3px',
            marginTop: '5px',
            marginLeft: '5px',
            cursor: 'pointer',
          }}
        >
          Log to Console
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;
