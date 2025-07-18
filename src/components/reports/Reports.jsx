import React, { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  PoundSterling,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';
import useStore from '../../store/useStore';
import { 
  formatCurrency, 
  getCurrentQuarter, 
  getTaxYearQuarters, 
  calculateQuarterSummary,
  getCurrentTaxYear
} from '../../utils/helpers';
import { getUserCategories } from '../../config/categories';

const Reports = () => {
  const { transactions, userType, userProfile } = useStore();
  const [selectedQuarter, setSelectedQuarter] = useState(() => {
    const current = getCurrentQuarter(userProfile?.calendarElection);
    return current.value;
  });

  const currentTaxYear = getCurrentTaxYear();
  const quarters = getTaxYearQuarters(currentTaxYear, userProfile?.calendarElection);
  const selectedQuarterData = quarters.find(q => q.value === selectedQuarter) || getCurrentQuarter(userProfile?.calendarElection);
  
  const userCategories = getUserCategories(userType);
  const quarterSummary = calculateQuarterSummary(transactions, selectedQuarterData, userCategories);

  const exportMTDReport = () => {
    const report = {
      quarter: selectedQuarterData.label,
      period: `${selectedQuarterData.start.toISOString().split('T')[0]} to ${selectedQuarterData.end.toISOString().split('T')[0]}`,
      taxYear: `${currentTaxYear}/${String(currentTaxYear + 1).slice(-2)}`,
      calendarElection: userProfile?.calendarElection || false,
      userType: userProfile?.userType === 'sole_trader' ? 'Sole Trader' : 'Landlord',
      summary: {
        totalIncome: quarterSummary.totalIncome,
        totalExpenses: quarterSummary.totalExpenses,
        totalTaxDeductibleExpenses: quarterSummary.totalTaxDeductibleExpenses,
        netPosition: quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses
      },
      categoryBreakdown: quarterSummary.categoryBreakdown
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mtd-report-${currentTaxYear}-${selectedQuarterData.label.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const incomeCategories = Object.entries(quarterSummary.categoryBreakdown)
    .filter(([_, data]) => data.type === 'income' && data.transactionCount > 0)
    .sort((a, b) => b[1].amount - a[1].amount);

  const expenseCategories = Object.entries(quarterSummary.categoryBreakdown)
    .filter(([_, data]) => data.type === 'expense' && data.transactionCount > 0)
    .sort((a, b) => b[1].amount - a[1].amount);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MTD Reports</h1>
          <p className="text-gray-600 mt-1">
            Tax Year {currentTaxYear}/{String(currentTaxYear + 1).slice(-2)} • {userProfile?.calendarElection ? 'Calendar Election' : 'Standard UK Tax Year'}
          </p>
        </div>
        <button
          onClick={exportMTDReport}
          className="mt-4 sm:mt-0 btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Quarter Selection */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Select Reporting Period</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose a quarter to view detailed financial summary
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="input-field min-w-48"
            >
              {quarters.map((quarter) => (
                <option key={quarter.value} value={quarter.value}>
                  {quarter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MTD Summary */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">MTD Quarterly Summary</h2>
            <p className="text-blue-700 text-sm">
              {selectedQuarterData.label} • {userProfile?.userType === 'sole_trader' ? 'Sole Trader' : 'Landlord'}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Period: {selectedQuarterData.start.toLocaleDateString()} - {selectedQuarterData.end.toLocaleDateString()}
              {userProfile?.calendarElection && ' (Calendar Election)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {formatCurrency(quarterSummary.totalIncome)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {formatCurrency(quarterSummary.totalExpenses)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Deductible</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {formatCurrency(quarterSummary.totalTaxDeductibleExpenses)}
                </p>
              </div>
              <PoundSterling className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Position</p>
                <p className={`text-xl font-bold mt-1 ${
                  quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses)}
                </p>
              </div>
              <BarChart3 className={`h-8 w-8 ${
                quarterSummary.totalIncome - quarterSummary.totalTaxDeductibleExpenses >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Income Breakdown</h2>
            <div className="text-sm text-gray-500">
              {incomeCategories.length} categories
            </div>
          </div>

          {incomeCategories.length > 0 ? (
            <div className="space-y-3">
              {incomeCategories.map(([categoryId, data]) => (
                <div key={categoryId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{data.label}</p>
                    <p className="text-sm text-gray-600">
                      {data.transactionCount} transaction{data.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(data.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {quarterSummary.totalIncome > 0 
                        ? `${((data.amount / quarterSummary.totalIncome) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No income recorded</p>
              <p className="text-sm">Add income transactions to see breakdown</p>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Expense Breakdown</h2>
            <div className="text-sm text-gray-500">
              {expenseCategories.length} categories
            </div>
          </div>

          {expenseCategories.length > 0 ? (
            <div className="space-y-3">
              {expenseCategories.map(([categoryId, data]) => (
                <div key={categoryId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{data.label}</p>
                    <p className="text-sm text-gray-600">
                      {data.transactionCount} transaction{data.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {formatCurrency(data.amount)}
                    </p>
                    {data.taxDeductibleAmount !== data.amount && (
                      <p className="text-xs text-blue-600">
                        Deductible: {formatCurrency(data.taxDeductibleAmount)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {quarterSummary.totalExpenses > 0 
                        ? `${((data.amount / quarterSummary.totalExpenses) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingDown className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No expenses recorded</p>
              <p className="text-sm">Add expense transactions to see breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* MTD Compliance Notice */}
      <div className="card bg-gray-50 border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">MTD Submission Guidance</h3>
            <div className="text-sm text-gray-700 mt-2 space-y-2">
              <p>
                This report provides a summary of your income and expenses for the selected quarter, 
                formatted to assist with Making Tax Digital (MTD) submissions.
              </p>
              <p>
                <strong>Important:</strong> This application generates summaries suitable for MTD reporting 
                but does not submit data directly to HMRC. You'll need to use your MTD-compatible 
                software or HMRC's online services for official submissions.
              </p>
              <p>
                The tax deductible amounts shown include adjustments for private use and disallowable expenses 
                as configured in your transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
