import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import TestIndex from "./pages/TestIndex";
import OurPrograms from "./pages/OurPrograms";
import OurImpact from "./pages/OurImpact";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { getBaseUrl } from "./utils/url-helpers";
import LoadingSpinner from "./components/LoadingSpinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const isDev = import.meta.env.DEV;

const App = () => {
  const baseUrl = getBaseUrl();
  const [isLoading, setIsLoading] = useState(true);

  // More robust loading state management
  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;

    const handleLoad = () => {
      // Clear any existing timeout
      if (loadingTimeout) clearTimeout(loadingTimeout);
      
      // Small delay to ensure CSS and fonts are applied
      loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Multiple checks for loaded state
    const checkLoadingState = () => {
      if (document.readyState === 'complete') {
        handleLoad();
      } else if (document.readyState === 'interactive') {
        // DOM is ready, but resources might still be loading
        setTimeout(handleLoad, 100);
      }
    };

    // Immediate check
    checkLoadingState();

    // Fallback - force loading to complete after 2 seconds
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback: Forcing loading to complete');
      setIsLoading(false);
    }, 2000);

    // Event listeners
    window.addEventListener('load', handleLoad);
    document.addEventListener('DOMContentLoaded', handleLoad);

    // Cleanup
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('DOMContentLoaded', handleLoad);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {isLoading ? (
            <div className="flex items-center justify-center h-screen w-full bg-background">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <BrowserRouter basename={baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/programs" element={<OurPrograms />} />
                <Route path="/impact" element={<OurImpact />} />
                <Route path="/test" element={<TestIndex />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
