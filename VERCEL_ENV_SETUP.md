# Vercel Environment Variable Setup

## Quick Setup Guide

### Step 1: Go to Your Vercel Project
1. Visit [vercel.com](https://vercel.com)
2. Select your **Recipe Finder** project

### Step 2: Add Environment Variable
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar
3. Click **Add New** button

### Step 3: Add REACT_APP_API_URL
**Name**: `REACT_APP_API_URL`

**Value**: Your Render backend URL (e.g., `https://your-app-name.onrender.com`)

**Important**: Make sure to:
- ✅ Select **Production**
- ✅ Select **Preview** 
- ✅ Select **Development**

### Step 4: Save and Redeploy
1. Click **Save**
2. Go to **Deployments** tab
3. Click the **three dots** (...) on the latest deployment
4. Click **Redeploy**

## Verify It Works

After redeploying, check your live app:

1. Open your Vercel URL (e.g., `https://recipe-finder.vercel.app`)
2. Open browser **Developer Tools** (F12)
3. Go to **Console** tab
4. Register a new user or browse recipes
5. Check that API calls go to your Render URL (not localhost)

## Example

### Your Render URL:
```
https://recipe-finder-api.onrender.com
```

### In Vercel Environment Variables:
```
Name: REACT_APP_API_URL
Value: https://recipe-finder-api.onrender.com
```

### Your Vercel Frontend URL:
```
https://recipe-finder.vercel.app
```

## Troubleshooting

### Issue: Still seeing localhost in console
- Wait 2-3 minutes for deployment to complete
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private browsing mode

### Issue: CORS errors
- Make sure backend CORS allows your Vercel domain
- In Render, check backend logs for errors

### Issue: 404 errors
- Verify the Render URL is correct (test it in browser)
- Check that backend is running (visit backend URL)
- Make sure environment variable is set for all three environments

## Still Having Issues?

Check:
1. ✅ Backend is running on Render
2. ✅ Environment variable is set correctly
3. ✅ Redeployed after adding environment variable
4. ✅ Using incognito mode to test
5. ✅ Check browser console for specific errors

---

**That's it! Your app should now be fully connected! 🎉**




