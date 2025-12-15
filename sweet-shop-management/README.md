# Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory, built with modern technologies and following Test-Driven Development (TDD) practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Development Process](#development-process)
- [License](#license)

## 🎯 Overview

The Sweet Shop Management System is a comprehensive application that allows users to:
- Register and authenticate securely
- Browse and search for sweets
- Purchase sweets (with inventory management)
- Admin users can add, edit, delete, and restock sweets

## ✨ Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Dashboard**: View all available sweets with their details
- **Search & Filter**: Search sweets by name, category, or price range
- **Purchase**: Purchase sweets with automatic inventory deduction

### Admin Features
- **CRUD Operations**: Create, read, update, and delete sweets
- **Inventory Management**: Restock sweets to increase quantity
- **User Management**: Full access to all user-facing features

### Technical Features
- **Test-Driven Development**: Comprehensive test coverage
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Responsive design with a clean, modern interface
- **RESTful API**: Well-structured backend API

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (can be easily switched to PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern design patterns

## 📁 Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   ├── database/           # Database configuration
│   │   ├── middleware/         # Authentication middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript type definitions
│   │   └── index.ts           # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components (if any)
│   │   ├── context/           # React contexts (Auth)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── test/              # Test setup
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git (for version control)

### Quick Start

1. **Clone the repository** (if from GitHub):
   ```bash
   git clone https://github.com/YOUR_USERNAME/sweet-shop-management.git
   cd sweet-shop-management
   ```

2. **Or if working locally**, navigate to the project directory:
   ```bash
   cd "c:\project(ml)\sweet shop"
   ```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
DB_PATH=./sweet-shop.db
```

4. Start the development server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be running on `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Sweets (Protected - Requires JWT Token)

- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search?name=...&category=...&minPrice=...&maxPrice=...` - Search sweets
- `POST /api/sweets` - Create a new sweet (Protected)
- `PUT /api/sweets/:id` - Update a sweet (Protected)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected - Requires JWT Token)

- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
  ```json
  {
    "quantity": "number"
  }
  ```

- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)
  ```json
  {
    "quantity": "number"
  }
  ```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📸 Screenshots

_Screenshots of the application will be added here once the application is running._

### Login Page
The login page features a clean design with email and password fields.

### Dashboard
The dashboard displays all sweets in a grid layout with search and filter functionality.

### Admin Panel
Admin users can manage sweets through intuitive modals for adding, editing, and restocking.

## 🤖 My AI Usage

This section is required as per the assignment guidelines to document AI tool usage throughout the development process.

### AI Tools Used

I utilized **Cursor AI** (powered by Claude/GPT-4) extensively throughout the development of this project. The AI assistant was instrumental in:

1. **Code Generation and Boilerplate**
   - Generated initial project structure and configuration files (package.json, tsconfig.json, vite.config.ts)
   - Created database setup code and table schemas
   - Generated API route structures and middleware setup

2. **Test-Driven Development**
   - Helped write comprehensive test cases following TDD principles
   - Generated test setups and mocked data structures
   - Assisted in creating test scenarios for edge cases

3. **Component Development**
   - Generated React components with TypeScript interfaces
   - Created modal components and form structures
   - Assisted with CSS styling and responsive design patterns

4. **Code Review and Debugging**
   - Identified potential bugs and type errors
   - Suggested improvements for code organization
   - Helped refactor code for better readability

5. **Documentation**
   - Assisted in writing comprehensive README sections
   - Generated API endpoint documentation
   - Helped structure the AI usage documentation

### How AI Impacted My Workflow

**Positive Impacts:**
- **Speed**: Significantly accelerated development by generating boilerplate code and standard patterns
- **Learning**: AI suggestions helped me understand best practices and modern patterns
- **Consistency**: Ensured consistent code style and patterns throughout the project
- **Error Prevention**: AI caught potential bugs and type errors before runtime

**Challenges and Learning:**
- **Over-reliance Risk**: Had to be mindful not to blindly accept AI suggestions without understanding the code
- **Context Management**: Sometimes needed to provide more context for AI to generate appropriate code
- **Review Process**: Always reviewed and tested AI-generated code to ensure it met requirements

**Reflection:**
AI tools, particularly Cursor AI, acted as a powerful pair programming partner. They helped me maintain focus on high-level architecture while handling repetitive tasks. However, I made sure to:
- Understand every piece of code before using it
- Test all AI-generated code thoroughly
- Customize AI suggestions to fit project-specific requirements
- Learn from AI suggestions to improve my own coding skills

The transparency in AI usage, as demonstrated by this section, is crucial for maintaining trust and understanding in the development process. AI is a tool that augments human capability, not replaces it.

### Interview Discussion Points

I am prepared to discuss:
- Specific instances where AI was used vs. manual coding
- How I ensured code quality when using AI assistance
- The balance between AI assistance and personal learning
- How AI tools fit into modern software development workflows
- Best practices for using AI responsibly in software development

## 🔄 Development Process

This project was developed following **Test-Driven Development (TDD)** principles:

1. **Red Phase**: Write failing tests first
2. **Green Phase**: Write minimal code to make tests pass
3. **Refactor Phase**: Improve code while keeping tests green

### Key Development Steps

1. **Project Setup**: Created backend and frontend structures with TypeScript
2. **Database Design**: Designed SQLite schema for users and sweets
3. **Authentication**: Implemented JWT-based authentication with tests
4. **API Development**: Built RESTful endpoints following TDD
5. **Frontend Development**: Created React components with modern UI
6. **Integration**: Connected frontend to backend API
7. **Testing**: Ensured comprehensive test coverage

### Git Commits

This project uses Git with descriptive commit messages following conventional commits:
- `feat:` for new features
- `test:` for adding tests
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `docs:` for documentation

Each commit where AI was used includes a co-author tag as per requirements.

## 🔐 Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Input validation on all endpoints
- SQL injection protection through parameterized queries
- CORS configured for frontend-backend communication

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to:
- Heroku
- AWS (EC2, Lambda)
- DigitalOcean
- Railway
- Render

Ensure to:
- Set environment variables in production
- Use a production database (PostgreSQL recommended)
- Enable HTTPS

### Frontend Deployment

The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Update the `VITE_API_URL` environment variable to point to your production backend.

## 📝 License

This project is part of a coding assignment/kata and is provided as-is for educational purposes.

## 👤 Author

Developed as part of the Sweet Shop Management System TDD Kata.

## 🚀 Deployment

This application can be deployed to various platforms:

- **Backend**: Railway, Render, Heroku, or AWS
- **Frontend**: Vercel, Netlify, or GitHub Pages

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📦 GitHub Repository

To push this project to GitHub:

1. Create a new repository on GitHub
2. Follow the instructions in [GITHUB_SETUP.md](./GITHUB_SETUP.md)
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management.git
   git branch -M main
   git push -u origin main
   ```

## 📖 Additional Documentation

- [SETUP.md](./SETUP.md) - Quick setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub setup guide
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Admin user guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Troubleshooting tips

---

**Note**: This project demonstrates modern full-stack development practices, test-driven development, and effective use of AI tools in software development.

