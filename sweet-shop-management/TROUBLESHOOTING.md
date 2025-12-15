# Troubleshooting Guide

## Issue: Nothing is displaying / Blank page

### 1. Check Browser Console
Open your browser's developer tools (F12) and check the Console tab for any errors.

Common errors:
- **ReferenceError**: Variable not defined (like `isAdmin` - should be fixed now)
- **TypeError**: Cannot read property of undefined
- **Network errors**: Backend not running or CORS issues

### 2. Verify Backend is Running

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 3001
Connected to SQLite database
```

### 3. Verify Frontend is Running

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### 4. Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Check if API calls are being made
5. Look for any failed requests (red)

### 5. Common Issues and Fixes

#### Issue: Dashboard shows blank page
**Cause**: Component error or API failure  
**Fix**: 
- Check browser console for errors
- Ensure backend is running
- Check if user is authenticated (localStorage should have 'token' and 'user')

#### Issue: Error loading sweets
**Cause**: Backend not running or API endpoint issue  
**Fix**:
- Start backend server: `cd backend && npm run dev`
- Check backend logs for errors
- Verify database is initialized

#### Issue: "Loading..." never stops
**Cause**: User context not loading properly  
**Fix**:
- Clear browser localStorage: `localStorage.clear()` in console
- Try registering/login again
- Check AuthContext implementation

#### Issue: CORS errors
**Cause**: Backend CORS not configured properly  
**Fix**:
- Verify `cors()` middleware is used in backend
- Check backend is allowing requests from `http://localhost:3000`

### 6. Quick Debug Steps

1. **Clear browser cache and localStorage**:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Check if root element exists**:
   ```javascript
   // In browser console
   document.getElementById('root')
   // Should return the div element
   ```

3. **Check React is rendering**:
   ```javascript
   // In browser console
   document.querySelector('#root').innerHTML
   // Should show React-rendered content
   ```

4. **Check authentication state**:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   localStorage.getItem('user')
   ```

### 7. Reinstall Dependencies

If nothing works, try reinstalling:

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 8. Check File Structure

Ensure these files exist:
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/context/AuthContext.tsx`
- `frontend/index.html`

### 9. Verify Imports

Check that all imports are correct:
- No missing files
- No circular dependencies
- All paths are correct (relative paths)

### 10. Test Minimal Component

If Dashboard still doesn't work, try creating a minimal test:

```tsx
// Temporarily replace Dashboard.tsx content with:
const Dashboard = () => {
  return <div><h1>Dashboard Works!</h1></div>;
};
export default Dashboard;
```

If this works, then the issue is in the Dashboard component logic.

## Still Having Issues?

1. Check the browser console for specific error messages
2. Check the terminal where frontend is running for build errors
3. Check the terminal where backend is running for server errors
4. Verify all environment variables are set correctly
5. Try a different browser (Chrome, Firefox, Edge)

