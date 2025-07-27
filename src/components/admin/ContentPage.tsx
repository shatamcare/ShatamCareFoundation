import React from 'react';
import { FileText } from 'lucide-react';

const ContentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage website content, pages, and components</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-warm-teal to-sage-600 text-white p-6 rounded-lg border-l-4 border-sunrise-orange">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Dynamic Content Management - Coming Soon!</h3>
            <p className="text-white/90 mt-1">
              We're working on connecting the content management system to the website pages. 
              Currently, the website pages use hardcoded content. This feature will allow you to:
            </p>
            <ul className="mt-3 text-white/90 space-y-1">
              <li>• Edit homepage content dynamically</li>
              <li>• Update "About Us" and other page sections</li>
              <li>• Manage content without code changes</li>
              <li>• Real-time content updates</li>
            </ul>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="bg-sunrise-orange text-white px-3 py-1 rounded-full">
                In Development
              </div>
              <span className="text-white/80">Expected: Next Update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future implementation */}
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Content Management Interface</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The dynamic content management system will be available here once the integration 
            with website pages is complete. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
