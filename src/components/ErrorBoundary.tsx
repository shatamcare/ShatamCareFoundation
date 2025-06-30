import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-gray to-white p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <AlertTriangle className="h-20 w-20 text-sunrise-orange mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-dark-charcoal mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <Button 
              onClick={this.handleReload}
              className="bg-warm-teal hover:bg-warm-teal-600 text-white px-8 py-3 rounded-full font-medium"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If the problem persists, contact us at{" "}
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
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
