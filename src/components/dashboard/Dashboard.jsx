import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PoundSterling, 
  Calendar,
  FileText,
  AlertCircle,
  Building
} from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, getCurrentQuarter, calculateQuarterSummary } from '../../utils/helpers';
import { getUserCategories, BUSINESS_TYPES } from '../../config/categories';
import MTDDeadlineWidget from './MTDDeadlineWidget';

const Dashboard = () => {
  const { transactions, businesses, currentBusinessId, getCurrentBusiness } = useStore();
  
  const currentBusiness = getCurrentBusiness();
  const userType = currentBusiness?.type || 'sole_trader';
  
  // Get user's calendar election preference
  const useCalendarElection = currentBusiness?.calendarElection || false;
  
  const currentQuarter = getCurrentQuarter(useCalendarElection);
  const userCategories = getUserCategories(userType);
  const quarterSummary = calculateQuarterSummary(transactions, currentQuarter, userCategories);

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(quarterSummary.totalIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(quarterSummary.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Tax Deductible Expenses',
      value: formatCurrency(quarterSummary.totalTaxDeductibleExpenses),
      icon: PoundSterling,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Net Position',
      value: formatCurrency(quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses),
      icon: FileText,
      color: quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses >= 0 ? 'border-green-200' : 'border-red-200'
    }
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* No Business State */}
      {!currentBusiness && businesses.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <div className="text-slate-400 mb-4">
            <Building className="h-12 w-12 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No Businesses Found</h3>
            <p className="text-slate-300">Create your first business to start tracking your MTD transactions.</p>
          </div>
        </div>
      )}

      {/* Business Header */}
      {currentBusiness && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{currentBusiness.name}</h2>
              <p className="text-slate-300 text-sm">
                {currentBusiness.type === 'sole_trader' ? 'Sole Trader Business' : 'Rental Property Business'} • 
                Tax Year: {currentBusiness.calendarElection ? '1 Jan - 31 Dec' : '6 Apr - 5 Apr'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs">Current Period</p>
              <p className="text-white font-medium">{currentQuarter.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content - Only show when businesses exist */}
      {businesses.length > 0 && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-300 mt-1">
                Overview for {currentQuarter.label} • {currentBusiness?.type === 'sole_trader' ? 'Sole Trader' : 'Landlord Business'}
                {useCalendarElection && <span className="text-blue-400"> • Calendar Election</span>}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{currentQuarter.label}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 border-l-4 border-l-blue-500 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-slate-700 text-blue-400 p-3 rounded-full">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bank Feed Notice - Only show when businesses exist */}
      {businesses.length > 0 && (
        <>
          <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-200">Bank Feed Integration Coming Soon</h3>
                <p className="text-sm text-amber-300 mt-1">
                  Direct bank feed integration is a future enhancement. For now, all transactions are manually entered.
                  We're working on connecting your bank accounts to automatically import transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{transaction.description}</p>
                    <p className="text-sm text-slate-400">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </p>
                  </div>
                  <div className={`text-right ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    <p className="font-semibold">
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-600" />
              <p>No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          )}
        </div>

        {/* MTD Deadlines Widget */}
        <div className="lg:col-span-1">
          <MTDDeadlineWidget 
            currentBusiness={currentBusiness}
            currentQuarter={currentQuarter}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Category Breakdown</h2>
          
          {Object.entries(quarterSummary.categoryBreakdown)
            .filter(([_, data]) => data.transactionCount > 0)
            .sort((a, b) => b[1].amount - a[1].amount)
            .slice(0, 6)
            .map(([categoryId, data]) => (
              <div key={categoryId} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-white">{data.label}</p>
                  <p className="text-sm text-slate-400">
                    {data.transactionCount} transaction{data.transactionCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${data.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(data.amount)}
                  </p>
                  {data.type === 'expense' && data.taxDeductibleAmount !== data.amount && (
                    <p className="text-xs text-slate-400">
                      Deductible: {formatCurrency(data.taxDeductibleAmount)}
                    </p>
                  )}
                </div>
              </div>
            )).length > 0 ? null : (
              <div className="text-center py-8 text-slate-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                <p>No category data yet</p>
                <p className="text-sm">Add transactions to see category breakdown</p>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
