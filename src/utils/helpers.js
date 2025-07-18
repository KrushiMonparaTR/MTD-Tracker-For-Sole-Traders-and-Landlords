import { format, startOfQuarter, endOfQuarter, parseISO } from 'date-fns';

// Date formatting utilities
export const formatDate = (date) => {
  if (typeof date === 'string') {
    return format(parseISO(date), 'MMM dd, yyyy');
  }
  return format(date, 'MMM dd, yyyy');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(Math.abs(amount));
};

// Quarter utilities - UK Tax Year based
export const getCurrentTaxYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based
  const currentDay = now.getDate();
  
  // UK tax year starts on 6 April
  if (currentMonth > 3 || (currentMonth === 3 && currentDay >= 6)) {
    // After 6 April, so we're in the tax year starting this year
    return currentYear;
  } else {
    // Before 6 April, so we're in the tax year starting last year
    return currentYear - 1;
  }
};

export const getTaxYearQuarters = (taxYear, useCalendarElection = false) => {
  const quarters = [];
  
  if (useCalendarElection) {
    // Calendar election quarters
    quarters.push({
      start: new Date(taxYear, 3, 1), // 1 April
      end: new Date(taxYear, 5, 30), // 30 June  
      label: `Q1 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q1-calendar`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 1), // 1 April
      end: new Date(taxYear, 8, 30), // 30 September
      label: `Q2 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q2-calendar`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 1), // 1 April  
      end: new Date(taxYear, 11, 31), // 31 December
      label: `Q3 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q3-calendar`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 1), // 1 April
      end: new Date(taxYear + 1, 2, 31), // 31 March next year
      label: `Q4 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q4-calendar`
    });
  } else {
    // Standard UK tax year quarters
    quarters.push({
      start: new Date(taxYear, 3, 6), // 6 April
      end: new Date(taxYear, 6, 5), // 5 July
      label: `Q1 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q1`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 6), // 6 April
      end: new Date(taxYear, 9, 5), // 5 October  
      label: `Q2 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q2`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 6), // 6 April
      end: new Date(taxYear + 1, 0, 5), // 5 January next year
      label: `Q3 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q3`
    });
    
    quarters.push({
      start: new Date(taxYear, 3, 6), // 6 April
      end: new Date(taxYear + 1, 3, 5), // 5 April next year
      label: `Q4 ${taxYear}/${String(taxYear + 1).slice(-2)}`,
      value: `${taxYear}-Q4`
    });
  }
  
  return quarters;
};

export const getCurrentQuarter = (useCalendarElection = false) => {
  const taxYear = getCurrentTaxYear();
  const quarters = getTaxYearQuarters(taxYear, useCalendarElection);
  const now = new Date();
  
  // Find which quarter we're currently in
  for (let i = 0; i < quarters.length; i++) {
    if (now >= quarters[i].start && now <= quarters[i].end) {
      return quarters[i];
    }
  }
  
  // If not found, return Q1 as default
  return quarters[0];
};

export const getQuartersList = (taxYear = getCurrentTaxYear(), useCalendarElection = false) => {
  return getTaxYearQuarters(taxYear, useCalendarElection);
};

// Transaction utilities
export const calculateTaxDeductibleAmount = (transaction) => {
  if (transaction.type === 'income') return transaction.amount;
  
  let deductibleAmount = Math.abs(transaction.amount);
  
  // Apply private use reduction
  if (transaction.privateUsePercentage > 0) {
    const privateAmount = (deductibleAmount * transaction.privateUsePercentage) / 100;
    deductibleAmount -= privateAmount;
  }
  
  // If marked as disallowable, return 0
  if (transaction.isDisallowable) {
    deductibleAmount = 0;
  }
  
  return deductibleAmount;
};

export const filterTransactionsByQuarter = (transactions, quarter) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= quarter.start && transactionDate <= quarter.end;
  });
};

export const calculateQuarterSummary = (transactions, quarter, userCategories) => {
  const quarterTransactions = filterTransactionsByQuarter(transactions, quarter);
  
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalTaxDeductibleExpenses: 0,
    categoryBreakdown: {}
  };
  
  // Initialize category breakdown
  userCategories.forEach(category => {
    summary.categoryBreakdown[category.id] = {
      label: category.label,
      type: category.type,
      amount: 0,
      taxDeductibleAmount: 0,
      transactionCount: 0
    };
  });
  
  quarterTransactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount);
    const taxDeductibleAmount = calculateTaxDeductibleAmount(transaction);
    
    if (transaction.type === 'income') {
      summary.totalIncome += amount;
    } else {
      summary.totalExpenses += amount;
      summary.totalTaxDeductibleExpenses += taxDeductibleAmount;
    }
    
    // Update category breakdown
    if (summary.categoryBreakdown[transaction.category]) {
      summary.categoryBreakdown[transaction.category].amount += amount;
      summary.categoryBreakdown[transaction.category].taxDeductibleAmount += taxDeductibleAmount;
      summary.categoryBreakdown[transaction.category].transactionCount += 1;
    }
  });
  
  return summary;
};

// File upload utilities
export const validateFileType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num !== 0;
};
