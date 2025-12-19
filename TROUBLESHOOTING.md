# WalletWise AI - Troubleshooting Guide

## 🔍 Current Status Check

Run these commands to verify what's working:

```bash
# Check if frontend is running
curl http://localhost:5173

# Check if backend is running  
curl http://localhost:5001

# Check which ports are in use
lsof -ti:5173  # Frontend
lsof -ti:5001  # Backend
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: Backend Not Starting (MongoDB Connection Error)

**Symptom**: Backend crashes immediately or shows MongoDB connection error

**Fix**:
The app has been updated to work WITHOUT MongoDB installed. However, you need to restart the backend:

```bash
# Stop the current backend (Ctrl+C in the terminal)
# Then restart:
cd backend
PORT=5001 npm run dev
```

The backend will now start even if MongoDB isn't available. You'll see:
```
⚠️  MongoDB connection failed. Auth features will not work.
   The app will still serve the frontend and dashboard with mock data.
🚀 Server running on port 5001
```

**What works without MongoDB:**
- ✅ Landing page
- ✅ Dashboard with mock data
- ❌ Signup (needs database)
- ❌ Login (needs database)

---

### Issue 2: Port Already in Use

**Symptom**: `EADDRINUSE` error

**Fix for Backend (Port 5001)**:
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Restart backend
cd backend
PORT=5001 npm run dev
```

**Fix for Frontend (Port 5173)**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Restart frontend
cd frontend
npm run dev
```

---

### Issue 3: Browser Shows Blank Page

**Possible Causes:**
1. Frontend server not running
2. JavaScript errors in browser console
3. Module import errors

**Fix:**
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Check the Console tab for errors
3. Look for any red error messages
4. If you see module errors, clear cache:
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or clear browser cache completely

---

### Issue 4: API Calls Failing (Network Errors)

**Symptom**: Dashboard loads but shows no data, or login/signup doesn't work

**Check:**
```bash
# Verify backend is responding
curl http://localhost:5001/
# Should return: {"message":"WalletWise AI API is running"}
```

**Fix:**
1. Make sure backend is running on port 5001
2. Check browser console for CORS errors
3. Verify the API URL in frontend code is correct (should be `http://localhost:5001/api`)

---

### Issue 5: Vite/Tailwind CSS Not Working

**Symptom**: No styles, or build errors

**Fix:**
```bash
cd frontend
rm -rf node_modules .vite package-lock.json
npm install
npm run dev
```

---

## 🚀 Clean Restart (Nuclear Option)

If nothing works, do a complete clean restart:

### 1. Stop Everything
- Press Ctrl+C in both terminal windows

### 2. Clean Backend
```bash
cd backend
rm -rf node_modules dist package-lock.json
npm install
```

### 3. Clean Frontend
```bash
cd frontend
rm -rf node_modules .vite dist package-lock.json
npm install
```

### 4. Start Backend
```bash
cd backend
PORT=5001 npm run dev
```

Wait for: `🚀 Server running on port 5001`

### 5. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### 6. Open Browser
Navigate to: http://localhost:5173

---

## 📱 Testing Without Database

The app is now configured to work WITHOUT MongoDB for testing the UI:

### What You Can Test:
1. **Landing Page** ✅
   - Beautiful hero section
   - Feature cards
   - Stats section
   - All animations and hover effects

2. **Dashboard (Direct Access)** ✅
   - Manually navigate to: http://localhost:5173/dashboard
   - You'll see mock data:
     - Monthly spending: ₹38,200
     - Category breakdown chart
     - AI insights
     - Goals progress
     - Recent transactions

### What Needs MongoDB:
- User registration (signup)
- User login
- Authentication/protected routes

---

## 🔧 Quick Diagnostics

### Check 1: Are Servers Running?
```bash
# This should show 2 process IDs for frontend
lsof -ti:5173

# This should show 1 process ID for backend
lsof -ti:5001
```

### Check 2: Can You Access the Sites?
```bash
# Frontend (should return HTML)
curl -I http://localhost:5173

# Backend (should return JSON)
curl http://localhost:5001
```

### Check  3: Check Terminal Output
Look at your terminal windows:
- **Backend**: Should say ` 🚀 Server running on port 5001`
- **Frontend**: Should say `Local:   http://localhost:5173/`

---

## 💡 Developer Console Errors

Common browser console errors and fixes:

### "Failed to fetch" or "Network Error"
→ Backend isn't running. Start backend on port 5001

### "Module not found"
→ Run `npm install` in frontend folder

### "Unexpected token" in CSS
→ Tailwind issue. Run `npm install` and restart dev server

### CORS Error
→ Backend should have CORS enabled (it does by default)

---

## 📞 Need More Help?

Please provide:
1. **What error message do you see?** (browser console or terminal)
2. **What page are you trying to access?**
3. **Output of**: `lsof -ti:5173 && lsof -ti:5001`
4. **Screenshot of browser DevTools console** (if applicable)

---

## ✅ When It's Working

You should see:

**Terminal 1 (Backend)**:
```
🚀 Server running on port 5001
```

**Terminal 2 (Frontend)**:
```
  VITE v5.4.11  ready in 371 ms
  
  ➜  Local:   http://localhost:5173/
```

**Browser at http://localhost:5173**:
- Gradient hero section
- "WalletWise AI" logo
- "Agentic Finance Assistant" badge with glow
- Feature cards
- All styling and colors visible
