import React from 'react';
import { User, Building, ArrowRight, CheckCircle, Calendar, PoundSterling, FileText, Car, ArrowLeft, Home, DollarSign, List } from 'lucide-react';

const BusinessTypeSelector = ({ onSelectBusinessType, showBackButton = true, onBack, currentBusinessType = null }) => {
  const businessTypes = [
    {
      id: 'sole_trader',
      title: 'Sole Trader',
      description: 'Track business income and expenses for self-employment',
      icon: User,
      color: 'blue',
      features: [
        'Turnover tracking',
        'Business expenses', 
        'Motor & travel costs',
        'Professional fees'
      ]
    },
    {
      id: 'landlord',
      title: 'Landlord',
      description: 'Manage rental income and property expenses',
      icon: Building,
      color: 'green',
      features: [
        'Rental income',
        'Property maintenance',
        'Recurring transactions',
        'Finance costs'
      ]
    }
  ];

  const getColorClasses = (color, isSelected = false) => {
    const colors = {
      blue: {
        bg: isSelected ? 'bg-blue-600' : 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        border: 'border-blue-300',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50'
      },
      green: {
        bg: isSelected ? 'bg-green-600' : 'bg-green-500', 
        hover: 'hover:bg-green-600',
        border: 'border-green-300',
        text: 'text-green-600',
        bgLight: 'bg-green-50'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-white">MTD Transaction Tracker</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <DollarSign className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <List className="h-4 w-4" />
            <span>View Transactions</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
          {/* Back Button */}
          {showBackButton && onBack && (
            <div className="flex justify-start mb-6">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white ml-3">MTD Transaction Tracker</h1>
          </div>
          <p className="text-xl text-gray-300">
            {currentBusinessType 
              ? 'Switch to a different business type' 
              : 'Choose your business type to get started'
            }
          </p>
          {currentBusinessType && (
            <p className="text-sm text-gray-400 mt-2">
              Currently using: <span className="text-blue-400 font-medium">
                {businessTypes.find(bt => bt.id === currentBusinessType)?.title}
              </span>
            </p>
          )}
        </div>

        {/* Business Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {businessTypes.map((businessType) => {
            const colors = getColorClasses(businessType.color);
            const Icon = businessType.icon;
            
            return (
              <div
                key={businessType.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 transform hover:scale-105"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${colors.bg} mb-4`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{businessType.title}</h2>
                  <p className="text-gray-300">{businessType.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {businessType.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-200">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    console.log('Business type selected:', businessType.id);
                    onSelectBusinessType(businessType.id);
                  }}
                  className={`w-full ${colors.bg} ${colors.hover} text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 group`}
                >
                  <span>Start as {businessType.title}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>

        {/* About MTD Compliance */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">About MTD Compliance</h3>
              <p className="text-gray-300">
                Making Tax Digital (MTD) requires quarterly submissions to HMRC. This tracker helps you:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Track quarterly deadlines</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Categorize using HMRC codes</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <PoundSterling className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Export data for accountants</h4>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">AI receipt scanning</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BusinessTypeSelector;
