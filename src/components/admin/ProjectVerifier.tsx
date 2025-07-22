import React, { useState } from 'react';

const ProjectVerifier: React.FC = () => {
  const [info, setInfo] = useState<any>(null);

  const checkProject = () => {
    const envInfo = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      expectedProject: 'uumavtvxuncetfqwlgvp',
      actualProject: import.meta.env.VITE_SUPABASE_URL?.includes('uumavtvxuncetfqwlgvp'),
      fullUrl: import.meta.env.VITE_SUPABASE_URL
    };
    
    setInfo(envInfo);
  };

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded">
      <h3 className="font-bold text-red-800">🚨 PROJECT VERIFICATION</h3>
      <p className="text-sm text-red-600 mb-3">
        Your bucket exists in SQL but API returns 400. This suggests wrong project connection.
      </p>
      
      <button 
        onClick={checkProject}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
      >
        🔍 Check Project Connection
      </button>

      {info && (
        <div className="mt-3 text-xs space-y-1">
          <div className={info.actualProject ? 'text-green-700' : 'text-red-700'}>
            <strong>Project Match:</strong> {info.actualProject ? '✅ CORRECT' : '❌ WRONG PROJECT!'}
          </div>
          <div>
            <strong>Expected:</strong> uumavtvxuncetfqwlgvp
          </div>
          <div>
            <strong>Your URL:</strong> {info.fullUrl || 'MISSING'}
          </div>
          <div>
            <strong>API Key:</strong> {info.hasAnonKey ? '✅ Present' : '❌ Missing'}
          </div>
          
          {!info.actualProject && (
            <div className="bg-red-100 p-2 rounded mt-2">
              <strong>🚨 ISSUE FOUND:</strong> You're connected to the wrong Supabase project!<br/>
              <strong>Fix:</strong> Update your .env file with the correct project URL.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectVerifier;
