# Admin Guide - Sweet Shop Management System

This guide explains how to create an admin user and manage sweets in the database.

## 📋 Table of Contents

1. [Creating an Admin User](#creating-an-admin-user)
2. [Logging in as Admin](#logging-in-as-admin)
3. [Adding Sweets to Database](#adding-sweets-to-database)
4. [Admin Features](#admin-features)
5. [Manual Database Operations](#manual-database-operations)

## 🔐 Creating an Admin User

### Method 1: Using the Script (Recommended)

The easiest way to create an admin user is using the provided script:

```bash
cd backend
npm run create-admin
```

The script will prompt you for:
- Username
- Email
- Password

**Example:**
```
Enter admin username: admin
Enter admin email: admin@sweetshop.com
Enter admin password: admin123
```

If a user with that email/username already exists, you can choose to update them to admin.

### Method 2: Manually Update Existing User

If you've already registered a regular user and want to make them an admin:

**Option A: Using SQLite CLI**

```bash
# Navigate to backend directory
cd backend

# Open SQLite database
sqlite3 sweet-shop.db

# Update user to admin (replace email with your user's email)
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# Verify the change
SELECT id, username, email, role FROM users;

# Exit SQLite
.quit
```

**Option B: Using a SQL Query Tool**

Use any SQLite client (like DB Browser for SQLite) and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Method 3: Create Admin via SQLite Directly

```bash
cd backend
sqlite3 sweet-shop.db

# Create admin user (replace values)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '<hashed_password>', 'admin');
```

Note: You'll need to hash the password using bcrypt. Use the script in Method 1 for this.

## 🔑 Logging in as Admin

1. **Start the frontend server** (if not already running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open the application** in your browser:
   ```
   http://localhost:3000
   ```

3. **Click "Login"** or navigate to `/login`

4. **Enter your admin credentials**:
   - Email: The email you used when creating the admin
   - Password: The password you set

5. **You'll be redirected to the Dashboard**

6. **Verify you're an admin**: You should see:
   - Your username and role shown as `(admin)` in the header
   - An "Add New Sweet" button (only visible to admins)
   - Edit, Restock, and Delete buttons on each sweet card

## ➕ Adding Sweets to Database

### Method 1: Using the Admin Panel (Easiest)

Once logged in as admin:

1. **Click "Add New Sweet"** button (visible only to admins)

2. **Fill in the form**:
   - Name: e.g., "Chocolate Bar"
   - Category: e.g., "Chocolate"
   - Price: e.g., 2.50
   - Quantity: e.g., 50

3. **Click "Add Sweet"**

4. **The sweet will appear in the list immediately**

### Method 2: Using API (Programmatic)

If you want to add sweets programmatically or via API:

**Using cURL:**
```bash
curl -X POST http://localhost:3001/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.50,
    "quantity": 50
  }'
```

**Using Postman/Thunder Client:**
1. Set method to `POST`
2. URL: `http://localhost:3001/api/sweets`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body (JSON):
```json
{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.50,
  "quantity": 50
}
```

### Method 3: Automatic Seeding

The database automatically seeds with sample sweets when the backend starts **if the database is empty**.

To trigger seeding:
1. **Delete all sweets** (optional):
   ```bash
   cd backend
   sqlite3 sweet-shop.db
   DELETE FROM sweets;
   .quit
   ```

2. **Restart the backend**:
   ```bash
   npm run dev
   ```

You should see:
```
Seeding database with sample sweets...
Successfully seeded 8 sweets!
```

### Method 4: Manual SQL Insertion

```bash
cd backend
sqlite3 sweet-shop.db

INSERT INTO sweets (name, category, price, quantity) 
VALUES ('Chocolate Bar', 'Chocolate', 2.50, 50);

.quit
```

## 🎛️ Admin Features

Once logged in as an admin, you have access to:

### 1. Add New Sweet
- Click **"Add New Sweet"** button
- Fill in the form and submit

### 2. Edit Sweet
- Click **"Edit"** button on any sweet card
- Modify the details
- Click **"Update Sweet"**

### 3. Restock Sweet
- Click **"Restock"** button on any sweet card
- Enter the quantity to add
- Click **"Restock"**

### 4. Delete Sweet
- Click **"Delete"** button on any sweet card
- Confirm the deletion

### 5. View All Operations
- Regular users can only **Purchase** sweets
- Admins see all CRUD operations

## 🛠️ Manual Database Operations

### View All Users

```bash
cd backend
sqlite3 sweet-shop.db

SELECT id, username, email, role FROM users;
```

### View All Sweets

```sql
SELECT * FROM sweets;
```

### Delete a Sweet

```sql
DELETE FROM sweets WHERE id = 1;
```

### Update Sweet Quantity

```sql
UPDATE sweets SET quantity = 100 WHERE id = 1;
```

### Make User Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### Reset Password (if needed)

You'll need to hash a new password. The easiest way is to use the create-admin script or:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('newpassword', 10).then(hash => console.log(hash));"
```

Then update:
```sql
UPDATE users SET password = '<hashed_password>' WHERE email = 'user@example.com';
```

## 📝 Quick Reference

### Default Admin Credentials (if using script)

After running `npm run create-admin`, use the credentials you entered.

### Sample Admin Credentials (for testing)

You can create an admin with:
- **Email**: admin@sweetshop.com
- **Password**: admin123
- **Role**: admin

### Database Location

The SQLite database file is located at:
```
backend/sweet-shop.db
```

### Common Issues

**Issue**: "No admin features showing"
- **Solution**: Make sure you're logged in with a user that has `role = 'admin'` in the database

**Issue**: "Can't create admin"
- **Solution**: Check if backend server is running and database is initialized

**Issue**: "Sweet not appearing after adding"
- **Solution**: Refresh the page or check browser console for errors

**Issue**: "Permission denied on delete/restock"
- **Solution**: Verify your user role is 'admin', not 'user'

## 🎯 Next Steps

1. ✅ Create an admin user using `npm run create-admin`
2. ✅ Login with admin credentials
3. ✅ Add sweets using the "Add New Sweet" button
4. ✅ Test all admin features (Edit, Delete, Restock)
5. ✅ Share login credentials with other admin users (safely!)

---

**Note**: Keep admin credentials secure and change default passwords in production!

