# Quick Setup Guide

This guide will help you quickly set up and run the Sweet Shop Management System.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Quick Start

### 1. Clone or Navigate to Project

```bash
cd "C:\project(ml)\sweet shop"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
DB_PATH=./sweet-shop.db
```

Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

### 4. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the login page
3. Register a new account or log in
4. Once logged in, you'll see the dashboard with sweets

## Creating an Admin User

By default, users are created with the 'user' role. To create an admin user, you can:

1. Register a regular user first
2. Manually update the database using SQLite:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

Or use a SQLite client to modify the `sweet-shop.db` file in the backend directory.

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Troubleshooting

### Backend won't start
- Make sure port 3001 is not in use
- Check that all dependencies are installed (`npm install`)
- Verify the `.env` file exists and has correct values

### Frontend won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed (`npm install`)
- Verify the backend is running on port 3001

### Database issues
- Delete the `sweet-shop.db` file in the backend directory to reset
- The database will be automatically recreated on next startup

### Authentication issues
- Clear browser localStorage
- Make sure JWT_SECRET is set in the backend `.env` file
- Verify tokens are being sent in API requests

## Next Steps

- Review the main README.md for detailed documentation
- Check the API endpoints documentation
- Review the test coverage report
- Explore the codebase to understand the architecture

Happy coding! 🍬

