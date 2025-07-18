import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building, User, Calendar, Info } from 'lucide-react';
import useStore from '../../store/useStore';
import Modal from '../common/Modal';
import { LoadingButton } from '../common/Loading';

const EditBusinessForm = ({ isOpen, onClose, business }) => {
  const { updateBusiness, businesses } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user already has a landlord business (excluding current business)
  const hasOtherLandlordBusiness = businesses.some(b => b.type === 'landlord' && b.id !== business?.id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: business?.name || '',
      type: business?.type || 'sole_trader',
      calendarElection: business?.calendarElection || false
    }
  });

  // Reset form when business changes
  React.useEffect(() => {
    if (business) {
      reset({
        name: business.name,
        type: business.type,
        calendarElection: business.calendarElection
      });
    }
  }, [business, reset]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const businessData = {
        name: data.name.trim(),
        type: data.type,
        calendarElection: data.calendarElection === 'true' || data.calendarElection === true
      };

      updateBusiness(business.id, businessData);
      handleClose();
    } catch (error) {
      console.error('Error updating business:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getBusinessTypeDescription = (type) => {
    if (type === 'sole_trader') {
      return 'Individual self-employment business. You can have multiple sole trader businesses.';
    } else {
      return 'UK rental property business. This covers all your rental properties as one business.';
    }
  };

  const getTaxYearDescription = (calendarElection) => {
    if (calendarElection) {
      return 'Calendar Year: 1 April - 31 March (requires HMRC approval for first use)';
    } else {
      return 'Standard UK Tax Year: 6 April - 5 April (most common)';
    }
  };

  if (!business) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Business Details"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Business Type Display (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">
            Business Type
          </label>
          <div className="border-2 border-slate-600 bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              {business.type === 'sole_trader' ? (
                <User className="h-6 w-6 text-blue-400" />
              ) : (
                <Building className="h-6 w-6 text-green-400" />
              )}
              <span className="font-medium text-slate-200">
                {business.type === 'sole_trader' ? 'Sole Trader' : 'Landlord'}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {getBusinessTypeDescription(business.type)}
            </p>
          </div>
          
          {/* Note about changing business type */}
          <div className="mt-3 p-3 bg-amber-900/20 border border-amber-600 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-200">
                Business type cannot be changed after creation. If you need a different type, please create a new business.
              </p>
            </div>
          </div>
        </div>

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
            placeholder={business.type === 'sole_trader' ? 'e.g., Freelance Web Development' : 'e.g., Property Rental Business'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Calendar Election */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">
            <Calendar className="inline h-4 w-4 mr-1" />
            Tax Year Basis
          </label>
          <div className="space-y-3">
            {/* Standard Tax Year */}
            <div className="border-2 border-slate-600 bg-slate-800 rounded-lg p-4">
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
            <div className="border-2 border-slate-600 bg-slate-800 rounded-lg p-4">
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
                      1 January - 31 December (requires HMRC approval for first use)
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
                {getTaxYearDescription(business.calendarElection)}
              </p>
            </div>
          </div>

          {/* Warning about changing tax year */}
          <div className="mt-3 p-3 bg-orange-900/20 border border-orange-600 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-200">
                <strong>Important:</strong> Changing the tax year basis may affect your MTD submissions and reporting periods. 
                Consult with your accountant before making this change if you have already submitted returns.
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Update Business
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default EditBusinessForm;
