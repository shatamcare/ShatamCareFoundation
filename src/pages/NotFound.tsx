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
    const baseUrl = getBaseUrl();
    const strippedPath = currentPath.replace(baseUrl, "");
    
    // Redirect home if we're at root path
    if (strippedPath === "/" || strippedPath === "") {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={goBack} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={goHome} variant="default" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
