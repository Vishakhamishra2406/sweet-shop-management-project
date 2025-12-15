# Quick GitHub Setup Guide

## 🚀 Getting Your Code on GitHub

### Step 1: Create GitHub Account
If you don't have one: https://github.com/signup

### Step 2: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `sweet-shop-management`
3. Description: "Full-stack Sweet Shop Management System"
4. Choose Public or Private
5. **DON'T** check "Initialize with README" (we already have files)
6. Click "Create repository"

### Step 3: Connect Local Code to GitHub

Open terminal in your project directory:

```bash
# Navigate to project
cd "c:\project(ml)\sweet shop"

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "feat: Initial commit - Sweet Shop Management System

Complete full-stack application with:
- Backend API (Node.js/Express/TypeScript)
- Frontend React app with TypeScript
- User authentication with JWT
- Admin and user roles
- Sweet management (CRUD)
- Inventory management
- Comprehensive tests

Co-authored-by: AI Assistant <AI@users.noreply.github.com>"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-management.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify

1. Go to your repository on GitHub
2. You should see all your files
3. README.md should display correctly

## 📝 Adding More Commits

After making changes:

```bash
# See what changed
git status

# Add changed files
git add .

# Or add specific files
git add frontend/src/pages/Dashboard.tsx

# Commit with message
git commit -m "feat: Add admin login page

- Added separate admin login route
- Styled admin login with red theme
- Removed purchase button from admin dashboard

Co-authored-by: AI Assistant <AI@users.noreply.github.com>"

# Push to GitHub
git push
```

## 🔄 Updating Code

```bash
# Pull latest changes (if working with others)
git pull

# Make your changes
# ... edit files ...

# Add, commit, push
git add .
git commit -m "Description of changes"
git push
```

## 📋 Good Commit Messages

Follow this format:

```
type: Short description

Longer description if needed
- Bullet point 1
- Bullet point 2

Co-authored-by: AI Assistant <AI@users.noreply.github.com>
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

## 🔐 GitHub Authentication

If `git push` asks for credentials:

**Option 1: Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`
4. Copy token
5. Use token as password when pushing

**Option 2: SSH Key**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Update remote: `git remote set-url origin git@github.com:USERNAME/REPO.git`

## ✅ Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] README.md displays correctly
- [ ] .gitignore working (no sensitive files uploaded)
- [ ] Repository is public/private as intended

## 🎯 Next Steps

After pushing to GitHub:
1. Update README with GitHub link
2. Add screenshots to README
3. Deploy backend (see DEPLOYMENT.md)
4. Deploy frontend (see DEPLOYMENT.md)
5. Add deployment URLs to README

---

**Trouble?** Check:
- GitHub username is correct in remote URL
- You have permission to push to the repository
- All files are committed (`git status` should be clean)

