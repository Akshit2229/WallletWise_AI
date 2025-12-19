# Authentication Debug Guide

## Recent Fixes Applied ✅

1. **Function Name Mismatches** - Fixed:
   - `Signup.tsx`: Changed `signup` → `signUp`
   - `Login.tsx`: Changed `login` → `signIn`
   - Fixed parameter order in `signUp` call

2. **Added Debug Logging** - You'll now see console messages for:
   - SignUp attempts and responses
   - SignIn attempts and responses  
   - Session creation
   - Email confirmation warnings

3. **TypeScript Lint** - Fixed type import for ReactNode

---

## Testing Authentication (Step-by-Step)

### Step 1: Open Browser Console
1. Open http://localhost:5173 in your browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Keep it open during testing

### Step 2: Test Signup
1. Click "Sign Up"
2. Fill in the form with test data:
   - Name: `Test User`
   - Email: `test@example.com` (or your real email)
   - Password: `password123`
3. Click "Create account"
4. **Check the console** for messages:

**Expected Console Output:**
```
SignUp attempt: { email: 'test@example.com', name: 'Test User' }
SignUp response: { user: {...}, session: {...} }
User auto-signed in after signup
```

### Step 3: If Email Confirmation is Required

If you see this warning:
```
⚠️ User created but no session - EMAIL CONFIRMATION REQUIRED
```

**This means Supabase requires email verification**. You have two options:

#### Option A: Disable Email Confirmation (Recommended for testing)
1. Go to Supabase Dashboard: https://app.supabase.com/project/_/auth/settings
2. Scroll to **"Enable email confirmations"**
3. **Turn it OFF**
4. Try signing up again with a new email

#### Option B: Confirm Your Email (If using real email)
1. Check your email inbox
2. Click the confirmation link
3. Return to the app and log in

### Step 4: Test Login
1. Go to the Login page
2. Enter your credentials
3. **Check the console**:

**Expected Console Output:**
```
SignIn attempt: test@example.com
SignIn successful: { user: {...}, session: true }
```

###Step 5: Test Adding Transactions
1. Once logged in, you should be on the Dashboard
2. Click **"Add Transaction"**
3. Fill in the form:
   - Type: Expense
   - Amount: 500
   - Category: Food
   - Description: Test transaction
   - Date: Today
4. Click **Save**

**If successful**: Transaction appears in the list
**If failed**: Check console for errors and session state

---

## Common Issues & Solutions

### Issue: "Not Authenticated" Error

**Possible Causes:**
1. **No session** - User isn't logged in
2. **Email not confirmed** - Supabase waiting for email verification
3. **Session expired** - Try logging out and back in

**Debug Steps:**
```javascript
// Open browser console and paste:
const { data: { session } } = await supabase.auth.getSession()
console.log('Current session:', session)
console.log('User ID:', session?.user?.id)
```

If session is `null`, you're not logged in.

### Issue: Email Confirmation Required

**Quick Fix:**
Disable it in Supabase → Auth → Settings → "Enable email confirmations" → OFF

### Issue: SignUp Works But Can't Add Transactions

**Check:**
1. Are you actually on the dashboard? (URL should be `/dashboard`)
2. Is there a session? (Check console)
3. Are the database tables created? (Run SQL schema if not done)

**Test in Console:**
```javascript
// Test if user is authenticated
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

---

## Verification Checklist

Before reporting issues, verify:

- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:5001
- [ ] Supabase tables created (transactions, goals)
- [ ] Browser console open (F12)
- [ ] Email confirmation disabled (or email confirmed)
- [ ] Logged in successfully (check console for "SignIn successful")
- [ ] Session exists (check console after login)

---

## Next Steps

1. **Test the full flow** following the steps above
2. **Watch the console** for any error messages
3. **Take a screenshot** of any errors you see
4. **Report** what step fails and what the console shows

The debug logs will help identify exactly where the authentication is breaking!
