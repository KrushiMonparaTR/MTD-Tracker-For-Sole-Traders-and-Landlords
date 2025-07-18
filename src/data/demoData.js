// Demo data for testing the application
export const DEMO_TRANSACTIONS = [
  {
    id: 'demo-1',
    date: '2025-07-15',
    description: 'Client Payment - Web Development',
    amount: 2500,
    type: 'income',
    category: 'turnover',
    notes: 'Payment for website development project',
    createdAt: '2025-07-15T10:30:00.000Z',
    updatedAt: '2025-07-15T10:30:00.000Z'
  },
  {
    id: 'demo-2',
    date: '2025-07-14',
    description: 'Office Supplies - Stationery',
    amount: -45.99,
    type: 'expense',
    category: 'admin_expenses',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Pens, paper, folders for office',
    createdAt: '2025-07-14T14:20:00.000Z',
    updatedAt: '2025-07-14T14:20:00.000Z'
  },
  {
    id: 'demo-3',
    date: '2025-07-13',
    description: 'Fuel - Business Travel',
    amount: -78.50,
    type: 'expense',
    category: 'motor_expenses',
    privateUsePercentage: 20,
    isDisallowable: false,
    notes: 'Fuel for client visit to London',
    createdAt: '2025-07-13T09:15:00.000Z',
    updatedAt: '2025-07-13T09:15:00.000Z'
  },
  {
    id: 'demo-4',
    date: '2025-07-12',
    description: 'Consulting Fee',
    amount: 1200,
    type: 'income',
    category: 'turnover',
    notes: 'Business consultation services',
    createdAt: '2025-07-12T16:45:00.000Z',
    updatedAt: '2025-07-12T16:45:00.000Z'
  },
  {
    id: 'demo-5',
    date: '2025-07-10',
    description: 'Business Lunch',
    amount: -65.00,
    type: 'expense',
    category: 'entertainment',
    privateUsePercentage: 0,
    isDisallowable: true,
    notes: 'Lunch meeting with potential client',
    createdAt: '2025-07-10T12:30:00.000Z',
    updatedAt: '2025-07-10T12:30:00.000Z'
  },
  {
    id: 'demo-6',
    date: '2025-06-28',
    description: 'Quarterly Software Subscription',
    amount: -299.99,
    type: 'expense',
    category: 'general_admin',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Project management software quarterly payment',
    createdAt: '2025-06-28T09:00:00.000Z',
    updatedAt: '2025-06-28T09:00:00.000Z'
  },
  {
    id: 'demo-7',
    date: '2025-06-25',
    description: 'Client Payment - Mobile App',
    amount: 3200,
    type: 'income',
    category: 'turnover',
    notes: 'Payment for mobile app development',
    createdAt: '2025-06-25T15:30:00.000Z',
    updatedAt: '2025-06-25T15:30:00.000Z'
  },
  {
    id: 'demo-8',
    date: '2025-06-20',
    description: 'Internet & Phone Bill',
    amount: -85.50,
    type: 'expense',
    category: 'admin_expenses',
    privateUsePercentage: 30,
    isDisallowable: false,
    notes: 'Monthly business internet and phone charges',
    createdAt: '2025-06-20T11:15:00.000Z',
    updatedAt: '2025-06-20T11:15:00.000Z'
  }
];

export const DEMO_LANDLORD_TRANSACTIONS = [
  {
    id: 'demo-l1',
    date: '2025-07-01',
    description: 'Rental Income - Property 1',
    amount: 1500,
    type: 'income',
    category: 'income',
    notes: 'Monthly rent from 123 Main Street',
    createdAt: '2025-07-01T09:00:00.000Z',
    updatedAt: '2025-07-01T09:00:00.000Z'
  },
  {
    id: 'demo-l2',
    date: '2025-07-05',
    description: 'Property Maintenance',
    amount: -450.00,
    type: 'expense',
    category: 'repairs_maintenance',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Plumbing repair at rental property',
    createdAt: '2025-07-05T14:30:00.000Z',
    updatedAt: '2025-07-05T14:30:00.000Z'
  },
  {
    id: 'demo-l3',
    date: '2025-07-08',
    description: 'Property Insurance',
    amount: -325.00,
    type: 'expense',
    category: 'premises_costs',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Annual property insurance premium',
    createdAt: '2025-07-08T11:15:00.000Z',
    updatedAt: '2025-07-08T11:15:00.000Z'
  },
  {
    id: 'demo-l4',
    date: '2025-07-01',
    description: 'Rental Income - Property 2',
    amount: 1200,
    type: 'income',
    category: 'income',
    notes: 'Monthly rent from 456 Oak Avenue',
    createdAt: '2025-07-01T09:00:00.000Z',
    updatedAt: '2025-07-01T09:00:00.000Z'
  },
  {
    id: 'demo-l5',
    date: '2025-06-28',
    description: 'Property Management Fee',
    amount: -180.00,
    type: 'expense',
    category: 'admin_expenses',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Monthly property management fee',
    createdAt: '2025-06-28T14:00:00.000Z',
    updatedAt: '2025-06-28T14:00:00.000Z'
  },
  {
    id: 'demo-l6',
    date: '2025-06-15',
    description: 'Garden Maintenance',
    amount: -125.00,
    type: 'expense',
    category: 'repairs_maintenance',
    privateUsePercentage: 0,
    isDisallowable: false,
    notes: 'Monthly garden maintenance service',
    createdAt: '2025-06-15T10:30:00.000Z',
    updatedAt: '2025-06-15T10:30:00.000Z'
  }
];
