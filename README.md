# MTD Income/Expense Tracker

A comprehensive web application for tracking income and expenses for Sole Traders and Landlords, designed to assist with Making Tax Digital (MTD) compliance.

## Features

### 🔐 User Authentication
- Secure Firebase Authentication with email/password
- User profile management
- User type selection (Sole Trader or Landlord)

### 💰 Transaction Management
- Manual transaction entry with comprehensive forms
- Income and expense categorization based on user type
- Receipt upload functionality with placeholder for OCR scanning
- Expense adjustments for private use and disallowable expenses
- Real-time transaction list with filtering and sorting

### 📊 Dashboard & Reporting
- Financial overview with current quarter summaries
- Category-wise breakdown of income and expenses
- MTD-compliant quarterly reports
- Export functionality for reports and transaction data

### 📱 Responsive Design
- Mobile-first design approach
- Tailwind CSS for modern, responsive UI
- Touch-friendly interface for mobile devices
- Progressive web app capabilities

## Technology Stack

- **Frontend**: React.js 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Form Handling**: React Hook Form
- **Date Management**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `src/config/firebase.js` with your Firebase project configuration
   - Replace the placeholder values with your actual Firebase config

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Firebase Configuration

Update the following file with your Firebase project settings:

```javascript
// src/config/firebase.js
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Firestore Security Rules

Set up the following security rules in your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── dashboard/      # Dashboard and overview
│   ├── layout/         # Navigation and layout
│   ├── reports/        # MTD reporting components
│   └── transactions/   # Transaction management
├── config/             # Configuration files
├── services/           # Firebase and external services
├── store/              # Zustand state management
└── utils/              # Helper functions and utilities
```

## Tax Categories

The application supports different tax categories based on user type:

### Sole Trader Categories
- Income: Turnover, Other income
- Expenses: Cost of goods, Employee costs, Motor expenses, Travel and subsistence, Premises costs, Repairs, Administrative expenses, and more

### Landlord Categories
- Income: Income, Other income, Lease premiums, Reverse premiums
- Expenses: Premises costs, Repairs and maintenance, Financial costs, Professional fees, Travel costs, and more

## Key Features

### Transaction Management
- Add, edit, and delete transactions
- Categorize transactions by MTD-compliant categories
- Upload receipts (with future OCR capability)
- Apply expense adjustments for private use
- Mark expenses as disallowable

### Reporting
- Quarterly financial summaries
- Category-wise breakdowns
- Tax-deductible expense calculations
- Export reports in JSON format
- MTD-compliant data structure

### User Experience
- Intuitive form validation
- Real-time data updates
- Mobile-responsive design
- Toast notifications for user feedback
- Confirmation modals for destructive actions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

The application follows a modular component architecture:

- **Components**: Organized by feature (auth, dashboard, transactions, etc.)
- **State Management**: Centralized Zustand store with actions and selectors
- **Utilities**: Helper functions for calculations, formatting, and validation
- **Configuration**: Firebase setup and tax category definitions

### Contributing

1. Follow the established component structure
2. Use TypeScript-style JSDoc comments
3. Implement proper error handling
4. Ensure mobile responsiveness
5. Write meaningful commit messages

## Security

- User data is stored in Firestore with proper security rules
- Authentication is handled by Firebase Auth
- All user data is scoped to individual user IDs
- No sensitive financial data is stored in localStorage

## Future Enhancements

- OCR integration for receipt scanning
- Bank feed integration
- Direct MTD submission to HMRC
- Multi-year reporting
- Advanced analytics and insights
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions about this application, please refer to the documentation or create an issue in the project repository.
