import React from 'react';

const TestIndex = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Shatam Care Foundation - Test Page
      </h1>
      <p className="text-center text-gray-600 mb-8">
        If you can see this, the basic React app is working!
      </p>
      <div className="max-w-md mx-auto bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
        <ul className="space-y-2 text-sm">
          <li>Environment: {import.meta.env.MODE}</li>
          <li>Production: {import.meta.env.PROD ? 'Yes' : 'No'}</li>
          <li>Base URL: {import.meta.env.BASE_URL}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestIndex;
