<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MTD Income/Expense Tracker - Custom Instructions

This is a React.js web application for MTD (Making Tax Digital) Income/Expense tracking for Sole Traders and Landlords.

## Project Structure
- **Frontend**: React.js with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for application state
- **Backend/Database**: Firebase Firestore for data persistence
- **Authentication**: Firebase Authentication
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Key Features
- User authentication with email/password
- User type selection (Sole Trader vs Landlord)
- Transaction management with categorization
- Receipt upload with placeholder for OCR
- Expense adjustments (private use, disallowable expenses)
- Dashboard with financial summaries
- MTD-compliant quarterly reporting
- Mobile-responsive design

## Development Guidelines
- Use functional components with React hooks
- Follow the established component structure in `src/components/`
- Utilize the Zustand store for state management
- Implement proper error handling with try/catch blocks
- Use custom modal components instead of browser alerts
- Ensure mobile responsiveness with Tailwind CSS
- Follow Firebase Firestore document structure: `/artifacts/{appId}/users/{userId}/...`

## Tax Categories
- Sole Trader categories are defined in `src/config/categories.js`
- Landlord categories are also defined in `src/config/categories.js`
- Categories are dynamically filtered based on user type

## File Upload
- Receipt upload functionality is implemented with placeholder for future OCR integration
- Supports image files (JPEG, PNG, GIF) and PDFs
- File size limit: 5MB

When making changes to this project, ensure:
1. All components are properly responsive
2. Error handling is implemented
3. User experience is smooth and intuitive
4. Firebase integration follows the established patterns
5. Tax category logic is maintained correctly
