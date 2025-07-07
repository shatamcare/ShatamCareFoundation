import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

/**
 * Component that monitors and reports Web Vitals performance metrics
 * Only shown in development mode or when explicitly enabled
 */
const PerformanceMonitor: React.FC<{ visible?: boolean }> = ({ visible = false }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (import.meta.env.DEV || visible) {
      setIsVisible(true);
      
      // Measure Time To First Byte (TTFB)
      if (performance && performance.getEntriesByType) {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          setMetrics(prev => ({
            ...prev,
            ttfb: navEntry.responseStart
          }));
        }
      }
      
      // First Contentful Paint (FCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({
              ...prev,
              fcp: entry.startTime
            }));
          }
        });
      });
      
      try {
        observer.observe({ type: 'paint', buffered: true });
      } catch (e) {
        console.error('PerformanceObserver not supported in this browser');
      }
      
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime
          }));
        }
      });
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.error('LCP observation not supported');
      }
      
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-input') {
            setMetrics(prev => ({
              ...prev,
              fid: (entry as PerformanceEventTiming).processingStart - entry.startTime
            }));
          }
        });
      });
      
      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.error('FID observation not supported');
      }
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      let clsEntries: PerformanceEntry[] = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        clsEntries = clsEntries.concat(list.getEntries());
        
        // Calculate CLS
        let sessionValue = 0;
        let sessionEntries: PerformanceEntry[] = [];
        let sessionGap = 0;
        
        clsEntries.forEach(entry => {
          // @ts-ignore - layout-shift specific properties
          const entryValue = entry.value;
          
          if (sessionValue && entry.startTime - sessionGap > 5000) {
            sessionValue = 0;
            sessionEntries = [];
          }
          
          sessionValue += entryValue;
          sessionGap = entry.startTime;
          sessionEntries.push(entry);
          
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            setMetrics(prev => ({
              ...prev,
              cls: clsValue
            }));
          }
        });
      });
      
      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.error('CLS observation not supported');
      }
      
      // Clean up observers
      return () => {
        try {
          observer.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        } catch (e) {
          console.error('Error disconnecting observers', e);
        }
      };
    }
  }, [visible]);
  
  if (!isVisible) return null;
  
  // Helper to format milliseconds
  const formatMs = (ms: number | null) => {
    if (ms === null) return 'Measuring...';
    return `${Math.round(ms)}ms`;
  };
  
  // Helper to get performance rating
  const getRating = (metric: string, value: number | null) => {
    if (value === null) return 'neutral';
    
    switch(metric) {
      case 'fcp':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value < 600 ? 'good' : value < 1000 ? 'needs-improvement' : 'poor';
      default:
        return 'neutral';
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 p-3 text-xs font-mono">
      <div className="flex justify-between items-center">
        <div className="font-semibold">Performance Metrics (Dev Only)</div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close performance monitor"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-2">
        <div className={`p-2 rounded ${getRating('ttfb', metrics.ttfb) === 'good' ? 'bg-green-100' : getRating('ttfb', metrics.ttfb) === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <div className="font-medium">TTFB</div>
          <div>{formatMs(metrics.ttfb)}</div>
        </div>
        <div className={`p-2 rounded ${getRating('fcp', metrics.fcp) === 'good' ? 'bg-green-100' : getRating('fcp', metrics.fcp) === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <div className="font-medium">FCP</div>
          <div>{formatMs(metrics.fcp)}</div>
        </div>
        <div className={`p-2 rounded ${getRating('lcp', metrics.lcp) === 'good' ? 'bg-green-100' : getRating('lcp', metrics.lcp) === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <div className="font-medium">LCP</div>
          <div>{formatMs(metrics.lcp)}</div>
        </div>
        <div className={`p-2 rounded ${getRating('fid', metrics.fid) === 'good' ? 'bg-green-100' : getRating('fid', metrics.fid) === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <div className="font-medium">FID</div>
          <div>{formatMs(metrics.fid)}</div>
        </div>
        <div className={`p-2 rounded ${getRating('cls', metrics.cls) === 'good' ? 'bg-green-100' : getRating('cls', metrics.cls) === 'needs-improvement' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <div className="font-medium">CLS</div>
          <div>{metrics.cls === null ? 'Measuring...' : metrics.cls.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;