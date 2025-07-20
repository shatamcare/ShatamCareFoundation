import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Index from "./pages/Index";
import OurPrograms from "./pages/OurPrograms";
import OurImpact from "./pages/OurImpact";
import EventsPage from "./pages/EventsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

// Lazy load the admin login page
const AdminLoginPage = lazy(() => import("./components/admin/AdminLoginPage"));
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
  const [isLoading, setIsLoading] = useState(false); // Start with false - no loading screen
  
  // Determine basename for router
  const basename = import.meta.env.PROD ? '/ShatamCareFoundation' : undefined;

  // Minimal loading state management - only if needed
  useEffect(() => {
    // If for some reason we need to show loading, make it very brief
    if (isLoading) {
      const emergencyTimeout = setTimeout(() => {
        console.log('Emergency: Forcing loading to complete');
        setIsLoading(false);
      }, 200);

      return () => {
        if (emergencyTimeout) clearTimeout(emergencyTimeout);
      };
    }
  }, [isLoading]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {isLoading ? (
            <div className="flex items-center justify-center h-screen w-full bg-background">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <BrowserRouter basename={basename}>
              <Header />
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/programs" element={<OurPrograms />} />
                  <Route path="/impact" element={<OurImpact />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route 
                    path="/admin/login" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ErrorBoundary>
                          <AdminLoginPage />
                        </ErrorBoundary>
                      </Suspense>
                    } 
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
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
