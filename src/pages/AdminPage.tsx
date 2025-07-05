import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-dark-charcoal">Shatam Care Foundation</h1>
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Website</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
