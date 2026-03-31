# 🚀 Deployment Guide for Recipe Finder

## Overview
This guide will help you deploy your Recipe Finder application to:
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel.com (Free tier)

## Prerequisites
✅ Both services have free tiers
✅ No credit card required for basic deployment
✅ Automatic HTTPS
✅ Custom domain support

---

## Part 1: Backend Deployment (Render.com)

### Step 1: Prepare Backend for Deployment

1. **Update server configuration** to accept requests from any origin (for production):

   In `server/index.js`, ensure CORS is configured:
   ```javascript
   app.use(cors({
     origin: '*', // Allow all origins in production
     credentials: true
   }));
   ```

2. **Create/Update `.env` file in server folder** with your MongoDB connection:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure the Web Service**:
   - **Name**: `recipe-finder-api` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment**: `Node`

4. **Add Environment Variables**:
   - Click "Advanced" → "Add Environment Variable"
   - Add: `MONGO_URI` = `your_mongodb_connection_string`
   - Click "Save Changes"

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (takes 5-10 minutes on first deploy)

6. **Get Your Backend URL**:
   - Copy the URL (e.g., `https://recipe-finder-api.onrender.com`)
   - **Important**: This is your `REACT_APP_API_URL` for frontend

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Configure Environment Variables

1. **In your local project**, check that you've updated all API calls to use `${BASE_URL}`

2. **The configuration is already set up** in `client/src/config/api.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub

2. **Create a New Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure the Project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables**:
   - Go to "Environment Variables" section
   - Add variable:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: Your Render backend URL (e.g., `https://recipe-finder-api.onrender.com`)
   - Make sure to select "Production", "Preview", and "Development"
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait for build and deployment (takes 3-5 minutes)

6. **Get Your Frontend URL**:
   - Vercel will provide a URL like `https://recipe-finder.vercel.app`

---

## Part 3: Update Render CORS for Frontend

### After deploying frontend, update Render backend:

1. **Go back to Render dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Add these environment variables**:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Update your backend CORS** (optional, for better security):
   In `server/index.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }));
   ```

6. **Redeploy** the backend service

---

## Part 4: Testing Your Deployment

### 1. Test Backend
Visit: `https://your-backend.onrender.com`
Should see: "API is running..."

### 2. Test Frontend
1. Visit your Vercel URL
2. Try to register a new user
3. Try to log in
4. Browse recipes
5. Submit a new recipe

### 3. Check Browser Console
- Press `F12` in browser
- Look for any errors
- All API calls should go to your Render URL (not localhost)

---

## Part 5: Troubleshooting

### Issue: "Cannot connect to backend"
**Solution**:
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check that backend is running on Render
- Check CORS settings in backend

### Issue: "CORS error"
**Solution**:
- Update backend CORS to allow your Vercel domain
- Or use `origin: '*'` for development

### Issue: "Environment variables not working"
**Solution**:
- In Vercel, redeploy after adding environment variables
- Clear browser cache
- Try incognito mode

### Issue: "Build failing"
**Solution**:
- Check build logs in Vercel
- Ensure all dependencies are in package.json
- Check for TypeScript or linting errors

### Issue: "Recipe list not loading"
**Solution**:
- Check browser console for API errors
- Verify `BASE_URL` is being used in all components
- Check Render backend logs for errors

---

## Part 6: Environment Variables Reference

### Backend (Render)
```env
MONGO_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## Part 7: Continuous Deployment Setup

### Automatic Deployment
Both Render and Vercel automatically deploy when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -m "Update feature"`
3. Push: `git push origin main`
4. Both services will automatically rebuild and deploy!

### Staging Environment
- Vercel automatically creates preview deployments for each pull request
- Test changes in preview before merging to main

---

## Summary Checklist

### Before Deployment
- [ ] All API calls use `${BASE_URL}` instead of `localhost`
- [ ] Backend CORS is configured
- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas is set up

### Backend Deployment (Render)
- [ ] Create web service
- [ ] Set root directory to `server`
- [ ] Add `MONGO_URI` environment variable
- [ ] Deploy and copy backend URL

### Frontend Deployment (Vercel)
- [ ] Create project
- [ ] Set root directory to `client`
- [ ] Add `REACT_APP_API_URL` environment variable
- [ ] Deploy and test

### After Deployment
- [ ] Test all features work
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Share your live URL! 🎉

---

## Your Live URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

## Need Help?
- Check Render logs: Dashboard → Service → Logs
- Check Vercel logs: Project → Deployments → Click on deployment
- Check browser console for errors
- Verify all environment variables are set correctly

---

**Congratulations! 🎊 Your Recipe Finder is now live on the internet!**




