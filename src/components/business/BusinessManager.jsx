import React, { useState } from 'react';
import { User, Building, Plus, Settings, Calendar, CheckCircle, Edit, Trash2, MoreVertical } from 'lucide-react';
import useStore from '../../store/useStore';
import AddBusinessForm from './AddBusinessForm';
import EditBusinessForm from './EditBusinessForm';

const BusinessManager = ({ onSelectBusiness }) => {
  const { 
    businesses, 
    businessTypes, 
    currentBusinessId, 
    selectBusiness, 
    deleteBusiness, 
    getBusinessesByType 
  } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);

  const handleSelectBusiness = (businessId) => {
    selectBusiness(businessId);
    if (onSelectBusiness) {
      onSelectBusiness(businessId);
    }
  };

  const handleEditBusiness = (business, event) => {
    event.stopPropagation();
    setEditingBusiness(business);
    setShowEditForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteBusiness = (business, event) => {
    event.stopPropagation();
    
    if (businesses.length === 1) {
      alert('You cannot delete your last business. You must have at least one business.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${business.name}"?\n\nThis will permanently delete:\n- The business settings\n- All transactions for this business\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      deleteBusiness(business.id);
    }
    
    setActiveDropdown(null);
  };

  const toggleDropdown = (businessId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === businessId ? null : businessId);
  };

  const getBusinessIcon = (type) => {
    return type === 'sole_trader' ? User : Building;
  };

  const getBusinessColor = (type) => {
    return type === 'sole_trader' ? 'blue' : 'green';
  };

  const formatTaxYear = (calendarElection) => {
    return calendarElection ? '1 Jan - 31 Dec' : '6 Apr - 5 Apr';
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Header */}
      <div className="flex items-center justify-center p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-white">MTD Transaction Tracker</h1>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
        {/* Business Types and Businesses */}
        <div className="space-y-8 mb-8">
          {/* Sole Trader Business Type */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-400" />
                Sole Trader Businesses
              </h2>
              <button
                onClick={() => {
                  setSelectedBusinessType('sole_trader');
                  setShowAddForm(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Sole Trader Business</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBusinessesByType('sole_trader').map((business) => {
                const isSelected = business.id === currentBusinessId;
                
                return (
                  <div
                    key={business.id}
                    className={`relative bg-slate-800 border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => handleSelectBusiness(business.id)}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-12">
                        <CheckCircle className="h-6 w-6 text-blue-400" />
                      </div>
                    )}

                    {/* Dropdown Menu */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => toggleDropdown(business.id, e)}
                        className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {activeDropdown === business.id && (
                        <div className="absolute right-0 top-8 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                          <button
                            onClick={(e) => handleEditBusiness(business, e)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left text-slate-200 hover:bg-slate-600 rounded-t-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Business</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteBusiness(business, e)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-400 hover:bg-red-900/20 rounded-b-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Business</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Business Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-full bg-blue-600">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{business.name}</h3>
                        <p className="text-slate-300 text-sm">Sole Trader</p>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="h-4 w-4" />
                        <span>Tax Year: {formatTaxYear(business.calendarElection)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Settings className="h-4 w-4" />
                        <span>
                          {business.calendarElection ? 'Calendar Year Election' : 'Standard UK Tax Year'}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        {isSelected ? 'Currently Selected' : 'Select Business'}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state for sole trader */}
              {getBusinessesByType('sole_trader').length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-400 mb-4">No sole trader businesses yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Landlord Business Type */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Building className="h-6 w-6 mr-2 text-green-400" />
                Rental Property Businesses
              </h2>
              <button
                onClick={() => {
                  setSelectedBusinessType('landlord');
                  setShowAddForm(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property Business</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getBusinessesByType('landlord').map((business) => {
                const isSelected = business.id === currentBusinessId;
                
                return (
                  <div
                    key={business.id}
                    className={`relative bg-slate-800 border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      isSelected 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => handleSelectBusiness(business.id)}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-12">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    )}

                    {/* Dropdown Menu */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => toggleDropdown(business.id, e)}
                        className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {activeDropdown === business.id && (
                        <div className="absolute right-0 top-8 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                          <button
                            onClick={(e) => handleEditBusiness(business, e)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left text-slate-200 hover:bg-slate-600 rounded-t-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Business</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteBusiness(business, e)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-400 hover:bg-red-900/20 rounded-b-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Business</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Business Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-full bg-green-600">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{business.name}</h3>
                        <p className="text-slate-300 text-sm">Rental Property</p>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="h-4 w-4" />
                        <span>Tax Year: {formatTaxYear(business.calendarElection)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Settings className="h-4 w-4" />
                        <span>
                          {business.calendarElection ? 'Calendar Year Election' : 'Standard UK Tax Year'}
                        </span>
                      </div>
                      {business.propertyReference && (
                        <div className="flex items-center space-x-2 text-slate-300">
                          <Building className="h-4 w-4" />
                          <span>Property: {business.propertyReference}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        {isSelected ? 'Currently Selected' : 'Select Business'}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state for landlord */}
              {getBusinessesByType('landlord').length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-400 mb-4">No rental property businesses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-400" />
                Sole Trader Business Type
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• One business type containing unlimited individual businesses</li>
                <li>• Each business has separate settings and transactions</li>
                <li>• Examples: IT Business, Car Loan, Tea Store, Freelancing</li>
                <li>• Each business can have different tax year settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-400" />
                Landlord Business Type
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• One business type containing unlimited property businesses</li>
                <li>• Each property business has separate settings and transactions</li>
                <li>• Examples: Property A, Property B, Commercial Units</li>
                <li>• Each property can have individual property references</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-300 text-center">
              <strong>How it works:</strong> You can have both Sole Trader AND Landlord business types. 
              Within each type, create as many individual businesses as you need.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Add Business Form Modal */}
      <AddBusinessForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedBusinessType(null);
        }}
        businessType={selectedBusinessType}
      />

      {/* Edit Business Form Modal */}
      <EditBusinessForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingBusiness(null);
        }}
        business={editingBusiness}
      />
    </div>
  );
};

export default BusinessManager;
