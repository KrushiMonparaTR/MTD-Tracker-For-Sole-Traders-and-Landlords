import React, { useState, useEffect } from 'react';
import useStore from './store/useStore';
import BusinessManager from './components/business/BusinessManager';
import AuthForm from './components/auth/AuthForm';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import TransactionForm from './components/transactions/TransactionForm';
import TransactionList from './components/transactions/TransactionList';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import { LoadingScreen } from './components/common/Loading';
import { Toast } from './components/common/Modal';
import DebugPanel from './components/debug/DebugPanel';

function App() {
  const { user, businesses, currentBusinessId, loading, error, initializeAuth, setError } = useStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showBusinessManager, setShowBusinessManager] = useState(true); // Always start with business manager
  const [hasSelectedBusiness, setHasSelectedBusiness] = useState(false); // Track if user has selected a business

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe && unsubscribe();
  }, [initializeAuth]);

  // Reset business selection state when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      // User logged out - reset states
      setHasSelectedBusiness(false);
      setShowBusinessManager(true);
    } else {
      // User logged in - start with business manager
      setShowBusinessManager(true);
      setHasSelectedBusiness(false);
    }
  }, [user]);

  // Show toast notifications for errors
  useEffect(() => {
    if (error) {
      setToast({
        show: true,
        message: error,
        type: 'error'
      });
      setError(null); // Clear the error after showing toast
    }
  }, [error, setError]);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const handleBusinessSelection = (businessId) => {
    setShowBusinessManager(false);
    setHasSelectedBusiness(true);
    showToast('Business selected successfully!', 'success');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen message="Loading MTD Tracker..." />;
  }

  // Debug: Log current state
  console.log('App State:', { 
    user: !!user, 
    businesses: businesses?.length || 0,
    currentBusinessId,
    showBusinessManager,
    hasSelectedBusiness,
    loading 
  });

  // Debug: Log render decision
  if (loading) {
    console.log('Rendering: LoadingScreen');
    return <LoadingScreen message="Loading MTD Tracker..." />;
  }

  if (!user) {
    console.log('Rendering: AuthForm');
    return <AuthForm />;
  }

  // Always show BusinessManager first when user logs in, until they select a business
  if (user && (!hasSelectedBusiness || showBusinessManager)) {
    console.log('Rendering: BusinessManager');
    return (
      <BusinessManager 
        onSelectBusiness={handleBusinessSelection}
      />
    );
  }

  console.log('Rendering: Main App');

  // Render main application content
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSwitchBusinessType={() => {
          setShowBusinessManager(true);
          setHasSelectedBusiness(false); // Reset selection when switching
        }}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-3 lg:p-4">
          {/* Mobile Header - Only visible on mobile */}
          <div className="lg:hidden mb-4 pt-16">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">MTD Tracker</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('transactions')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'transactions'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setCurrentView('reports')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'reports'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'settings'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {renderCurrentView()}
        </main>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />

      {/* Mobile Menu Overlay Click Handler */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default App;
