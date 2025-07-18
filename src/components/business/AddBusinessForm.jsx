import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building, User, Calendar, Info } from 'lucide-react';
import useStore from '../../store/useStore';
import Modal from '../common/Modal';
import { LoadingButton } from '../common/Loading';

const AddBusinessForm = ({ isOpen, onClose, businessType = null }) => {
  const { addBusiness, createBusinessType } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      name: '',
      type: businessType || 'sole_trader',
      calendarElection: false,
      propertyReference: ''
    }
  });

  const watchType = businessType || watch('type');
  const watchCalendarElection = watch('calendarElection');

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure business type exists
      createBusinessType(watchType);
      
      const businessData = {
        name: data.name.trim(),
        type: watchType,
        calendarElection: data.calendarElection === 'true' || data.calendarElection === true,
        ...(watchType === 'landlord' && data.propertyReference && {
          propertyReference: data.propertyReference.trim()
        })
      };

      addBusiness(businessData);
      handleClose();
    } catch (error) {
      console.error('Error adding business:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getBusinessTypeDescription = (type) => {
    if (type === 'sole_trader') {
      return 'Create individual sole trader businesses. You can have unlimited separate sole trader businesses.';
    } else {
      return 'Create rental property businesses. You can have multiple property businesses for better organization.';
    }
  };

  const getTaxYearDescription = (calendarElection) => {
    if (calendarElection) {
      return 'Calendar Year: 1 April - 31 March (requires HMRC approval for first use)';
    } else {
      return 'Standard UK Tax Year: 6 April - 5 April (most common)';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={businessType 
        ? `Add New ${businessType === 'sole_trader' ? 'Sole Trader' : 'Property'} Business`
        : 'Add New Business'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Business Type Selection - only show if not pre-selected */}
        {!businessType && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Business Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sole Trader Option */}
              <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                watchType === 'sole_trader' 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}>
                <input
                  {...register('type')}
                  type="radio"
                  value="sole_trader"
                  className="sr-only"
                />
                <label className="cursor-pointer block">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-6 w-6 text-blue-400" />
                    <span className="font-medium text-slate-200">Sole Trader</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Individual self-employment business
                  </p>
                </label>
              </div>

              {/* Landlord Option */}
              <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                watchType === 'landlord' 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}>
                <input
                  {...register('type')}
                  type="radio"
                  value="landlord"
                  className="sr-only"
                />
                <label className="cursor-pointer block">
                  <div className="flex items-center space-x-3 mb-3">
                    <Building className="h-6 w-6 text-green-400" />
                    <span className="font-medium text-slate-200">Landlord</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Rental property business
                  </p>
                </label>
              </div>
            </div>
            
            {/* Business Type Description */}
            <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  {getBusinessTypeDescription(watchType)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Business Type Display - show if pre-selected */}
        {businessType && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Business Type
            </label>
            <div className={`border-2 rounded-lg p-4 ${
              businessType === 'sole_trader' 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-green-500 bg-green-900/20'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {businessType === 'sole_trader' ? (
                  <User className="h-6 w-6 text-blue-400" />
                ) : (
                  <Building className="h-6 w-6 text-green-400" />
                )}
                <span className="font-medium text-slate-200">
                  {businessType === 'sole_trader' ? 'Sole Trader' : 'Landlord'}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                {businessType === 'sole_trader' 
                  ? 'Individual self-employment business'
                  : 'Rental property business'
                }
              </p>
            </div>
            
            {/* Business Type Description */}
            <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  {getBusinessTypeDescription(businessType)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Business Name
          </label>
          <input
            {...register('name', { 
              required: 'Business name is required',
              minLength: { value: 2, message: 'Business name must be at least 2 characters' }
            })}
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={watchType === 'sole_trader' ? 'e.g., Tea Store, Farm House, Freelance Web Development' : 'e.g., Property A, Property B, Commercial Units'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Property Reference - only for landlord businesses */}
        {watchType === 'landlord' && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Property Reference (Optional)
            </label>
            <input
              {...register('propertyReference')}
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., 123 Main St, Flat A, Building 1"
            />
            <p className="mt-1 text-sm text-slate-400">
              Add a reference to help identify this property in reports and transactions
            </p>
          </div>
        )}

        {/* Calendar Election */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">
            <Calendar className="inline h-4 w-4 mr-1" />
            Tax Year Basis
          </label>
          <div className="space-y-3">
            {/* Standard Tax Year */}
            <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              !watchCalendarElection 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}>
              <label className="cursor-pointer block">
                <div className="flex items-start space-x-3">
                  <input
                    {...register('calendarElection')}
                    type="radio"
                    value={false}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">Standard UK Tax Year</div>
                    <div className="text-sm text-slate-300 mt-1">
                      6 April - 5 April (most businesses use this)
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* Calendar Year */}
            <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              watchCalendarElection 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}>
              <label className="cursor-pointer block">
                <div className="flex items-start space-x-3">
                  <input
                    {...register('calendarElection')}
                    type="radio"
                    value={true}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">Calendar Year</div>
                    <div className="text-sm text-slate-300 mt-1">
                      1 April - 31 March (requires HMRC approval for first use)
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Tax Year Description */}
          <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-600">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300">
                {getTaxYearDescription(watchCalendarElection)}
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className={`px-6 py-2 ${
              watchType === 'landlord' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-lg font-medium transition-colors`}
          >
            {businessType 
              ? `Add ${businessType === 'sole_trader' ? 'Sole Trader' : 'Property'} Business`
              : 'Add Business'
            }
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddBusinessForm;
