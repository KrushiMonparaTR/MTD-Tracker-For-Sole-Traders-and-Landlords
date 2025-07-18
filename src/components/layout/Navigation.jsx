import React from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  Upload,
  Smartphone,
  Menu,
  X,
  Building
} from 'lucide-react';
import useStore from '../../store/useStore';
import { BUSINESS_TYPES } from '../../config/categories';

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen, currentView, setCurrentView, onSwitchBusinessType }) => {
  const { user, businesses, currentBusinessId, getCurrentBusiness, signOut, setShowTransactionForm, userProfile } = useStore();
  
  const currentBusiness = getCurrentBusiness();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard', view: 'dashboard' },
    { icon: PlusCircle, label: 'Add Transaction', id: 'add-transaction', onClick: () => setShowTransactionForm(true) },
    { icon: Upload, label: 'Upload Receipt', id: 'upload-receipt' },
    { icon: FileText, label: 'Reports', id: 'reports', view: 'reports' },
    { icon: Settings, label: 'Settings', id: 'settings', view: 'settings' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-600 text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-600">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">MTD Transaction Tracker</h1>
                <p className="text-xs text-gray-400">
                  {currentBusiness?.name || 'No Business Selected'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.view) {
                    setCurrentView(item.view);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-primary-600 text-white border-l-4 border-primary-400'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="p-4 border-t border-slate-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-600">
                {userProfile?.profilePhoto ? (
                  <img 
                    src={userProfile.profilePhoto} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400">
                  {currentBusiness?.type === 'sole_trader' ? 'Sole Trader' : 'Landlord'} Business
                </p>
              </div>
            </div>
            
            {/* Switch Business Button */}
            <button
              onClick={() => onSwitchBusinessType && onSwitchBusinessType()}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200 mb-2"
            >
              <Building className="h-5 w-5" />
              <span className="font-medium">Manage Businesses</span>
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Mobile Indicator */}
          <div className="lg:hidden p-4 border-t border-slate-600 bg-slate-700">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Smartphone className="h-4 w-4" />
              <span>Mobile View</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
