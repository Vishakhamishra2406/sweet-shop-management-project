# Deployment Guide - Sweet Shop Management System

This guide covers deploying the application and setting it up on GitHub.

## 📋 Table of Contents

1. [GitHub Setup](#github-setup)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Frontend](#deploy-frontend)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

## 🐙 GitHub Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd "c:\project(ml)\sweet shop"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial commit - Sweet Shop Management System

- Backend API with Express, TypeScript, SQLite
- Frontend React app with TypeScript and Vite
- User authentication with JWT
- Admin and user roles
- CRUD operations for sweets
- Inventory management (purchase/restock)
- Comprehensive test suite
- Admin dashboard and user interface

Co-authored-by: AI Assistant <AI@users.noreply.github.com>"
```

### Step 2: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Create a new repository**:
   - Repository name: `sweet-shop-management`
   - Description: "Full-stack Sweet Shop Management System with React and Node.js"
   - Visibility: Public (or Private)
   - **Don't** initialize with README, .gitignore, or license (we already have these)

3. **Click "Create repository"**

### Step 3: Connect and Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management.git

# Rename main branch if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify on GitHub

- Go to your repository on GitHub
- Verify all files are uploaded correctly
- Check that README.md displays properly

## 🚀 Deploy Backend

### Option 1: Railway (Recommended - Easy)

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Add Service** → Select "Empty Service"
6. **Configure**:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: Railway will auto-detect

7. **Add Environment Variables**:
   ```
   PORT=3001
   JWT_SECRET=your-production-secret-key-change-this
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   DB_PATH=/data/sweet-shop.db
   ```

8. **Deploy**: Railway will automatically deploy

9. **Get Backend URL**: 
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL for frontend configuration

### Option 2: Render

1. **Go to Render**: https://render.com
2. **Sign up/Login**
3. **New** → "Web Service"
4. **Connect GitHub repository**
5. **Configure**:
   - Name: `sweet-shop-backend`
   - Environment: Node
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

6. **Add Environment Variables** (same as Railway)

7. **Deploy**

### Option 3: Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name-backend`
4. **Set environment variables**:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set JWT_EXPIRES_IN=24h
   heroku config:set NODE_ENV=production
   ```
5. **Deploy**: `git push heroku main`

### Option 4: AWS/DigitalOcean

For more advanced deployment, consider:
- **AWS EC2** with PM2
- **DigitalOcean App Platform**
- **AWS Lambda** (serverless)

## 🎨 Deploy Frontend

### Option 1: Vercel (Recommended - Best for React)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your GitHub repository
4. **Configure**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual backend URL)

6. **Deploy**

7. **Get Frontend URL**: Vercel provides a URL like `https://your-app.vercel.app`

### Option 2: Netlify

1. **Go to Netlify**: https://netlify.com
2. **Sign up/Login** with GitHub
3. **Add New Site** → "Import from Git"
4. **Select repository**
5. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

6. **Add Environment Variables**:
   - `VITE_API_URL`: Your backend URL

7. **Deploy**

### Option 3: GitHub Pages

1. **Update `vite.config.ts`**:
   ```typescript
   export default defineConfig({
     base: '/sweet-shop-management/', // Your repo name
     // ... rest of config
   });
   ```

2. **Add deployment script**:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Install gh-pages**: `npm install --save-dev gh-pages`
4. **Deploy**: `npm run deploy`

## ⚙️ Environment Variables

### Backend (.env)

Create a `.env` file in `backend/` directory:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=production
DB_PATH=./sweet-shop.db
```

**Important**: Never commit `.env` file to GitHub! It's already in `.gitignore`.

### Frontend (.env)

Create a `.env.production` file in `frontend/` directory:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

Replace `your-backend-url.railway.app` with your actual backend deployment URL.

## 📝 Update Frontend for Production

### Update API URL

The frontend needs to know where your backend is deployed.

**Option 1: Environment Variable (Recommended)**

1. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

2. Update `frontend/src/services/api.ts` (if needed):
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
   ```

**Option 2: Hardcode for Production**

Update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 
  import.meta.env.MODE === 'production'
    ? 'https://your-backend-url.railway.app'
    : 'http://localhost:3001';
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Set proper CORS settings if needed
- [ ] Consider rate limiting for API
- [ ] Use a production database (PostgreSQL instead of SQLite)
- [ ] Set up error monitoring (Sentry, etc.)

## 🔄 Updating After Deployment

### To update code:

```bash
# Make your changes locally
git add .
git commit -m "feat: Description of changes"

# Push to GitHub
git push origin main

# Platform will auto-deploy (Railway, Vercel, etc.)
```

### Manual deployment (if needed):

**Railway/Heroku**:
```bash
git push heroku main
```

**Vercel/Netlify**:
- Usually auto-deploys on push
- Or use their dashboard to redeploy

## 📊 Quick Deployment Summary

### Recommended Setup:

1. **Backend**: Railway (free tier available)
2. **Frontend**: Vercel (free, best for React)
3. **Database**: Railway includes SQLite, or use PostgreSQL addon
4. **Version Control**: GitHub

### URLs You'll Need:

- **Backend URL**: `https://your-backend.railway.app`
- **Frontend URL**: `https://your-frontend.vercel.app`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/sweet-shop-management`

## 🐛 Troubleshooting

### Backend Issues:

**Port not found**:
- Railway/Render auto-assign ports
- Use `process.env.PORT` (already in code)

**Database errors**:
- Railway: Database file location might differ
- Consider using PostgreSQL addon for production

**CORS errors**:
- Make sure frontend URL is in CORS settings
- Check `backend/src/index.ts` CORS configuration

### Frontend Issues:

**API calls failing**:
- Verify `VITE_API_URL` environment variable
- Check browser console for errors
- Ensure backend URL is correct and accessible

**Build errors**:
- Check `npm run build` works locally first
- Verify all dependencies are in `package.json`

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions) (for CI/CD)

---

**Next Steps**: 
1. ✅ Push code to GitHub
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Update environment variables
5. ✅ Test the live application
6. ✅ Share the link! 🎉

