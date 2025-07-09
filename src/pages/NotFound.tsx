import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { isProduction, getBaseUrl } from "@/utils/url-helpers";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're at a legitimate 404 vs just hitting the fallback route
    const currentPath = location.pathname;
    const isRootPath = currentPath === "/" || currentPath === "";
    const isBasePath = isProduction() && currentPath === getBaseUrl();
    
    // Don't show 404 if we're at root paths - these should redirect to home
    if (isRootPath || isBasePath) {
      console.log('Redirecting from root/base path to home');
      navigate('/', { replace: true });
      return;
    }
    
    // Only log actual 404 errors, not redirects
    console.warn(
      "404 Error: User attempted to access non-existent route:",
      currentPath
    );
    
    // Set page title for SEO
    document.title = "Page Not Found - Shatam Care Foundation";
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-gray to-white">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-warm-teal/20 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-dark-charcoal mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => {
              // Use the root path based on environment
              const rootPath = isProduction() ? `${getBaseUrl()}/` : '/';
              navigate(rootPath);
              console.log("Navigating to root path:", rootPath);
            }}
            className="bg-warm-teal hover:bg-warm-teal-600 text-white px-8 py-3 rounded-full font-medium w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="border-warm-teal text-warm-teal hover:bg-warm-teal/5 px-8 py-3 rounded-full font-medium w-full sm:w-auto ml-0 sm:ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a 
              href="mailto:shatamcare@gmail.com" 
              className="text-warm-teal hover:text-warm-teal-600 underline"
            >
              shatamcare@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
