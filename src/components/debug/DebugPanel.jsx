import React, { useState } from 'react';
import { Settings, X, RefreshCw } from 'lucide-react';
import useStore from '../../store/useStore';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, userType, transactions, loading, clearAllDemoData } = useStore();

  const handleClearData = () => {
    if (window.confirm('This will clear all demo data and reset the application. Continue?')) {
      clearAllDemoData();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50"
        title="Debug Panel"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Debug Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Debug Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current State */}
              <div>
                <h4 className="text-white font-medium mb-2">Current State:</h4>
                <div className="bg-slate-900 p-3 rounded text-sm text-gray-300">
                  <div>Loading: {loading ? 'true' : 'false'}</div>
                  <div>User: {user ? 'logged in' : 'not logged in'}</div>
                  <div>User Email: {user?.email || 'none'}</div>
                  <div>User Profile: {userProfile ? 'exists' : 'none'}</div>
                  <div>User Type: {userType || 'none'}</div>
                  <div>Transactions: {transactions?.length || 0}</div>
                </div>
              </div>

              {/* LocalStorage Data */}
              <div>
                <h4 className="text-white font-medium mb-2">LocalStorage Keys:</h4>
                <div className="bg-slate-900 p-3 rounded text-sm text-gray-300">
                  {Object.keys(localStorage)
                    .filter(key => key.startsWith('mtd-'))
                    .map(key => (
                      <div key={key}>{key}: {localStorage.getItem(key) ? 'exists' : 'empty'}</div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={handleClearData}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Clear All Data & Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
