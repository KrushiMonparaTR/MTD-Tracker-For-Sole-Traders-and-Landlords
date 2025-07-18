import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Calendar, DollarSign, Tag, FileText, AlertCircle, Image, Building } from 'lucide-react';
import useStore from '../../store/useStore';
import Modal from '../common/Modal';
import { LoadingButton } from '../common/Loading';
import { getUserCategories } from '../../config/categories';
import { validateRequired, validateAmount } from '../../utils/helpers';

const TransactionForm = () => {
  const {
    showTransactionForm,
    setShowTransactionForm,
    editingTransaction,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
    businesses,
    currentBusinessId,
    selectBusiness
  } = useStore();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [privateUsePercentage, setPrivateUsePercentage] = useState(0);
  const [isDisallowable, setIsDisallowable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: '',
      amount: '',
      description: '',
      category: '',
      notes: '',
      businessId: currentBusinessId || '',
      propertyReference: ''
    }
  });

  // Set form values when editing transaction
  React.useEffect(() => {
    if (editingTransaction) {
      setValue('date', editingTransaction.date);
      setValue('type', editingTransaction.type);
      setValue('amount', Math.abs(editingTransaction.amount));
      setValue('description', editingTransaction.description);
      setValue('category', editingTransaction.category);
      setValue('notes', editingTransaction.notes || '');
      setValue('businessId', editingTransaction.businessId || currentBusinessId || '');
      setValue('propertyReference', editingTransaction.propertyReference || '');
      setPrivateUsePercentage(editingTransaction.privateUsePercentage || 0);
      setIsDisallowable(editingTransaction.isDisallowable || false);
    } else {
      // For new transactions, default to current business
      setValue('businessId', currentBusinessId || '');
      setValue('propertyReference', '');
    }
  }, [editingTransaction, setValue, currentBusinessId]);

  const watchType = watch('type');
  const watchAmount = watch('amount');
  const watchBusinessId = watch('businessId');

  const selectedBusiness = businesses.find(b => b.id === (watchBusinessId || currentBusinessId));
  const userCategories = getUserCategories(selectedBusiness?.type || 'sole_trader');
  const availableCategories = userCategories.filter(cat => 
    watchType === 'income' ? cat.type === 'income' : cat.type === 'expense'
  );

  const handleClose = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
    setUploadedFile(null);
    setPrivateUsePercentage(0);
    setIsDisallowable(false);
    reset();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF) or PDF');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setUploadedFile(file);
      
      // For demo purposes, we'll show a placeholder for OCR extraction
      // In a real implementation, this would integrate with OCR services
      if (file.type.startsWith('image/')) {
        // Simulate OCR extraction with placeholder data
        setTimeout(() => {
          const demoData = {
            date: new Date().toISOString().split('T')[0],
            description: 'Receipt from ' + file.name.split('.')[0],
            amount: '25.99'
          };
          
          setValue('date', demoData.date);
          setValue('description', demoData.description);
          setValue('amount', demoData.amount);
        }, 1500);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Ensure we have a business selected
      const businessId = data.businessId || currentBusinessId;
      if (!businessId) {
        alert('Please select a business for this transaction');
        return;
      }

      // If business changed, update current selection
      if (businessId !== currentBusinessId) {
        selectBusiness(businessId);
      }
      
      const transactionData = {
        ...data,
        businessId,
        amount: parseFloat(data.amount),
        type: watchType,
        privateUsePercentage: watchType === 'expense' ? privateUsePercentage : 0,
        isDisallowable: watchType === 'expense' ? isDisallowable : false,
        receiptFileName: uploadedFile?.name || null,
        propertyReference: selectedBusiness?.type === 'landlord' ? (data.propertyReference || '') : ''
      };

      // Ensure amount is positive for income, negative for expense
      if (watchType === 'expense') {
        transactionData.amount = -Math.abs(transactionData.amount);
      } else {
        transactionData.amount = Math.abs(transactionData.amount);
      }

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={showTransactionForm}
      onClose={handleClose}
      title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Receipt Upload Section */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-800">Receipt Upload</h3>
              <p className="text-sm text-blue-700 mt-1">
                Upload a receipt image to automatically extract transaction details. 
                <span className="font-medium"> (OCR feature coming soon)</span>
              </p>
              
              <div className="mt-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Receipt
                </button>
                
                {uploadedFile && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-700">
                    <Image className="h-4 w-4" />
                    <span>{uploadedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              <Building className="inline h-4 w-4 mr-1" />
              Business
            </label>
            <select
              {...register('businessId', { required: 'Please select a business' })}
              className="input-field"
            >
              <option value="">Select business</option>
              
              {/* Group businesses by type for better organization */}
              {businesses.filter(b => b.type === 'sole_trader').length > 0 && (
                <>
                  <optgroup label="Sole Trader Businesses">
                    {businesses.filter(b => b.type === 'sole_trader').map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
              
              {businesses.filter(b => b.type === 'landlord').length > 0 && (
                <>
                  <optgroup label="Property Businesses">
                    {businesses.filter(b => b.type === 'landlord').map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                        {business.propertyReference && ` (${business.propertyReference})`}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
            {errors.businessId && (
              <p className="mt-1 text-sm text-red-600">{errors.businessId.message}</p>
            )}
          </div>

          {/* Property Reference (only for landlord businesses) */}
          {selectedBusiness?.type === 'landlord' && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                <Building className="inline h-4 w-4 mr-1" />
                Property Reference
              </label>
              <input
                {...register('propertyReference')}
                type="text"
                className="input-field"
                placeholder="e.g., Property A, 123 Main St"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Identify which property this transaction relates to
              </p>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="input-field"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              <Tag className="inline h-4 w-4 mr-1" />
              Type
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              className="input-field"
            >
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            <FileText className="inline h-4 w-4 mr-1" />
            Description
          </label>
          <input
            {...register('description', { 
              required: 'Description is required',
              validate: value => validateRequired(value) || 'Description cannot be empty'
            })}
            type="text"
            className="input-field"
            placeholder="Enter transaction description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Amount (£)
            </label>
            <input
              {...register('amount', { 
                required: 'Amount is required',
                validate: value => validateAmount(value) || 'Please enter a valid amount'
              })}
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              <Tag className="inline h-4 w-4 mr-1" />
              Category
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input-field"
            >
              <option value="">Select category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Expense Adjustments (only for expenses) */}
        {watchType === 'expense' && (
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3 mb-4">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Expense Adjustments</h3>
                <p className="text-sm text-yellow-700">
                  Adjust the tax-deductible amount for this expense
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Private Use Percentage */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Private Use Percentage: {privateUsePercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={privateUsePercentage}
                  onChange={(e) => setPrivateUsePercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% (Full business use)</span>
                  <span>100% (Full private use)</span>
                </div>
                {privateUsePercentage > 0 && watchAmount && (
                  <p className="text-sm text-yellow-700 mt-2">
                    Private amount: £{((parseFloat(watchAmount) || 0) * privateUsePercentage / 100).toFixed(2)}
                    <br />
                    Deductible amount: £{((parseFloat(watchAmount) || 0) * (100 - privateUsePercentage) / 100).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Disallowable Expense */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="disallowable"
                  checked={isDisallowable}
                  onChange={(e) => setIsDisallowable(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="disallowable" className="text-sm font-medium text-slate-200">
                  Mark as disallowable expense (not tax deductible)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="input-field"
            placeholder="Additional notes or details about this transaction"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="btn-primary"
          >
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
