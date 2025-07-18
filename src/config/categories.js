// Tax categories for different user types
export const SOLE_TRADER_CATEGORIES = [
  { id: 'turnover', label: 'Turnover', type: 'income' },
  { id: 'other_income', label: 'Other Income', type: 'income' },
  { id: 'cost_of_goods', label: 'Cost of Goods', type: 'expense' },
  { id: 'other_direct_costs', label: 'Other Direct Costs', type: 'expense' },
  { id: 'construction_subcontractor', label: 'Construction Industry Subcontractor Costs', type: 'expense' },
  { id: 'employee_costs', label: 'Employee Costs', type: 'expense' },
  { id: 'motor_expenses', label: 'Motor Expenses', type: 'expense' },
  { id: 'travel_subsistence', label: 'Travel and Subsistence', type: 'expense' },
  { id: 'premises_costs', label: 'Premises Costs', type: 'expense' },
  { id: 'repairs', label: 'Repairs', type: 'expense' },
  { id: 'admin_expenses', label: 'General Administrative Expenses', type: 'expense' },
  { id: 'entertainment', label: 'Business Entertainment Costs', type: 'expense' },
  { id: 'advertising', label: 'Advertising and Promotion Costs', type: 'expense' },
  { id: 'interest', label: 'Interest', type: 'expense' },
  { id: 'financial_charges', label: 'Other Financial Charges', type: 'expense' },
  { id: 'bad_debts', label: 'Bad Debts', type: 'expense' },
  { id: 'legal_professional', label: 'Legal and Professional Costs', type: 'expense' },
  { id: 'depreciation', label: 'Depreciation and Loss/Profit on Sale of Assets', type: 'expense' },
  { id: 'other_business', label: 'Other Business Expenses', type: 'expense' }
];

export const LANDLORD_CATEGORIES = [
  { id: 'income', label: 'Income', type: 'income' },
  { id: 'other_income', label: 'Other Income', type: 'income' },
  { id: 'lease_premiums', label: 'Lease Premiums', type: 'income' },
  { id: 'reverse_premiums', label: 'Reverse Premiums', type: 'income' },
  { id: 'premises_costs', label: 'Premises Costs', type: 'expense' },
  { id: 'repairs_maintenance', label: 'Repairs and Maintenance', type: 'expense' },
  { id: 'financial_costs', label: 'Financial Costs', type: 'expense' },
  { id: 'professional_fees', label: 'Professional Fees', type: 'expense' },
  { id: 'cost_of_services', label: 'Cost of Services', type: 'expense' },
  { id: 'travel_costs', label: 'Travel Costs', type: 'expense' },
  { id: 'other_costs', label: 'Other Costs', type: 'expense' },
  { id: 'residential_finance', label: 'Residential Finance Costs for Current Period', type: 'expense' }
];

export const BUSINESS_TYPES = {
  sole_trader: 'Sole Trader',
  landlord: 'Landlord'
};export const getUserCategories = (userType) => {
  switch (userType) {
    case 'sole_trader':
      return SOLE_TRADER_CATEGORIES;
    case 'landlord':
      return LANDLORD_CATEGORIES;
    default:
      return SOLE_TRADER_CATEGORIES;
  }
};

export const getCategoryById = (userType, categoryId) => {
  const categories = getUserCategories(userType);
  return categories.find(cat => cat.id === categoryId);
};
