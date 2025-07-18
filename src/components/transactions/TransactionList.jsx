import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  FileText, 
  Calendar, 
  Tag, 
  AlertCircle,
  Filter,
  Search,
  Download
} from 'lucide-react';
import useStore from '../../store/useStore';
import { ConfirmModal } from '../common/Modal';
import { formatDate, formatCurrency, calculateTaxDeductibleAmount } from '../../utils/helpers';
import { getUserCategories, getCategoryById } from '../../config/categories';

const TransactionList = () => {
  const {
    transactions,
    userType,
    deleteTransaction,
    setEditingTransaction,
    setShowTransactionForm
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const userCategories = getUserCategories(userType);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.propertyReference?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Description', 'Type', 'Category', 'Amount', 'Tax Deductible Amount', 'Notes'].join(','),
      ...filteredTransactions.map(transaction => {
        const category = getCategoryById(userType, transaction.category);
        const taxDeductibleAmount = calculateTaxDeductibleAmount(transaction);
        
        return [
          transaction.date,
          `"${transaction.description}"`,
          transaction.type,
          `"${category?.label || transaction.category}"`,
          Math.abs(transaction.amount),
          transaction.type === 'expense' ? taxDeductibleAmount : Math.abs(transaction.amount),
          `"${transaction.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
        <button
          onClick={exportTransactions}
          className="mt-4 sm:mt-0 btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Search transactions..."
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="inline h-4 w-4 mr-1" />
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Tag className="inline h-4 w-4 mr-1" />
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {userCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field flex-1"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="description">Description</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn-secondary px-3"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table/List */}
      {filteredTransactions.length > 0 ? (
        <div className="card p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Deductible
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => {
                  const category = getCategoryById(userType, transaction.category);
                  const taxDeductibleAmount = calculateTaxDeductibleAmount(transaction);
                  const hasAdjustments = transaction.type === 'expense' && 
                    (transaction.privateUsePercentage > 0 || transaction.isDisallowable);

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        {transaction.propertyReference && (
                          <div className="text-xs text-blue-600 mt-1">
                            Property: {transaction.propertyReference}
                          </div>
                        )}
                        {transaction.notes && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {transaction.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category?.label || transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(taxDeductibleAmount)}
                        </div>
                        {hasAdjustments && (
                          <div className="flex items-center text-xs text-yellow-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Adjusted
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-primary-600 hover:text-primary-700 p-1 rounded-full hover:bg-primary-50"
                            title="Edit transaction"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(transaction)}
                            className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => {
              const category = getCategoryById(userType, transaction.category);
              const taxDeductibleAmount = calculateTaxDeductibleAmount(transaction);
              const hasAdjustments = transaction.type === 'expense' && 
                (transaction.privateUsePercentage > 0 || transaction.isDisallowable);

              return (
                <div key={transaction.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category?.label || transaction.category}
                        </span>
                      </div>
                      
                      {transaction.propertyReference && (
                        <div className="mt-1 text-xs text-blue-600">
                          Property: {transaction.propertyReference}
                        </div>
                      )}
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(transaction.date)}
                        </div>
                      </div>

                      {transaction.notes && (
                        <p className="mt-2 text-sm text-gray-600">{transaction.notes}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Tax Deductible</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(taxDeductibleAmount)}
                          </div>
                          {hasAdjustments && (
                            <div className="flex items-center text-xs text-yellow-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Adjusted
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-primary-600 hover:text-primary-700 p-2 rounded-full hover:bg-primary-50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(transaction)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters to see more transactions.'
                : 'Get started by adding your first transaction.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default TransactionList;
