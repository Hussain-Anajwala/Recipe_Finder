# 🚀 GitHub Setup Guide - Clean Push

## ⚠️ IMPORTANT: If You Already Pushed Secrets

If you accidentally pushed your `.env` file with secrets, follow these steps:

### Step 1: Remove Sensitive Data from Git History

```bash
# Navigate to your project
cd c:\Users\husai\OneDrive\Desktop\WDL_miniproject\Recipe_Finder

# Remove .env from git history (if already committed)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch server/.env" --prune-empty --tag-name-filter cat -- --all

# Force push to GitHub (WARNING: This rewrites history)
git push origin --force --all
```

### Step 2: Change All Secrets Immediately

1. **JWT_SECRET** - Generate a new random string
2. **SPOONACULAR_API_KEY** - Regenerate from Spoonacular dashboard
3. **MongoDB URI** - If it contains credentials, change them

---

## 🆕 Fresh GitHub Setup (Recommended)

### Option A: Start Fresh (Safest)

1. **Delete the existing GitHub repository** (if you created one)
2. **Follow the steps below** for a clean setup

### Option B: Clean Current Repository

```bash
# 1. Navigate to project
cd c:\Users\husai\OneDrive\Desktop\WDL_miniproject\Recipe_Finder

# 2. Remove git history
Remove-Item -Recurse -Force .git

# 3. Initialize fresh git repository
git init

# 4. Add .gitignore (already created)
# Verify .gitignore exists and contains .env

# 5. Stage all files (except those in .gitignore)
git add .

# 6. Check what will be committed (IMPORTANT!)
git status

# 7. Verify .env is NOT listed (should be ignored)
# If .env appears, DO NOT COMMIT! Fix .gitignore first

# 8. Make initial commit
git commit -m "Initial commit: Recipe Finder MERN application"

# 9. Create GitHub repository (next section)
```

---

## 📦 Create GitHub Repository

### 1. Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click **"New repository"** (+ icon, top right)
3. Fill in details:
   - **Repository name:** `recipe-finder` or `recipe-finder-mern`
   - **Description:** "A full-stack Recipe Finder application built with MERN stack"
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README (we already have one)
4. Click **"Create repository"**

### 2. Link Local Repository to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/recipe-finder.git

# Verify remote was added
git remote -v

# Push to GitHub
git push -u origin main

# If it says 'master' instead of 'main', use:
git branch -M main
git push -u origin main
```

---

## ✅ Verification Checklist

Before pushing, verify:

### Files That SHOULD be on GitHub:
- ✅ `README.md`
- ✅ `.gitignore`
- ✅ `server/.env.example` (example only, not actual .env)
- ✅ All `.js` files
- ✅ `package.json` files
- ✅ Documentation files (`.md`)
- ✅ All source code

### Files That SHOULD NOT be on GitHub:
- ❌ `server/.env` (actual environment file)
- ❌ `node_modules/` folders
- ❌ `client/build/` folder
- ❌ Any log files
- ❌ `.DS_Store` or OS-specific files

### Check Before Pushing:

```bash
# List all files that will be committed
git ls-files

# If you see .env in the list, STOP and fix .gitignore!
# Remove .env from git tracking:
git rm --cached server/.env
git commit -m "Remove .env from tracking"
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

**Files to NEVER commit:**
- `.env` files
- API keys
- Database passwords
- JWT secrets
- Private keys

### 2. Use .env.example

Always provide a `.env.example` with placeholder values:

```env
# ✅ GOOD - .env.example
MONGO_URI=mongodb://localhost:27017/RecipeDB
JWT_SECRET=your_jwt_secret_here
SPOONACULAR_API_KEY=your_api_key_here

# ❌ BAD - Never commit actual values
MONGO_URI=mongodb://realuser:realpass@cluster.mongodb.net
JWT_SECRET=actual_secret_key_12345
SPOONACULAR_API_KEY=abc123def456real
```

### 3. Rotate Compromised Secrets

If you accidentally pushed secrets:
1. **Immediately** change all secrets
2. Regenerate API keys
3. Update your local `.env` file
4. Clean git history (see above)

---

## 📝 Git Commands Reference

### Basic Workflow

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Useful Commands

```bash
# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View differences
git diff
```

---

## 🎯 Final Steps After Pushing

### 1. Update README

Edit `README.md` and replace:
- `YOUR_USERNAME` with your GitHub username
- `your-email@example.com` with your email
- Add your LinkedIn profile link

### 2. Add Repository Description

On GitHub repository page:
1. Click **"About"** (gear icon)
2. Add description: "Full-stack Recipe Finder with MERN stack"
3. Add topics: `mern`, `react`, `nodejs`, `mongodb`, `express`, `recipe-app`

### 3. Create Screenshots (Optional)

1. Take screenshots of your app
2. Create `screenshots/` folder
3. Add images to README

### 4. Add License (Optional)

```bash
# Create LICENSE file
# Choose MIT License (most common for open source)
```

---

## 🆘 Troubleshooting

### Problem: ".env file appears in git status"

**Solution:**
```bash
git rm --cached server/.env
echo "server/.env" >> .gitignore
git add .gitignore
git commit -m "Fix: Remove .env from tracking"
```

### Problem: "node_modules/ is being committed"

**Solution:**
```bash
git rm -r --cached node_modules
git rm -r --cached client/node_modules
git rm -r --cached server/node_modules
git commit -m "Fix: Remove node_modules from tracking"
```

### Problem: "Permission denied (publickey)"

**Solution:**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/recipe-finder.git
```

### Problem: "Repository not found"

**Solution:**
- Verify repository name is correct
- Check if repository is public/private
- Ensure you're logged into correct GitHub account

---

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## ✅ Success Checklist

- [ ] `.gitignore` file created
- [ ] `.env.example` created (without real secrets)
- [ ] Verified `.env` is NOT in git tracking
- [ ] `node_modules/` is NOT in git tracking
- [ ] README.md updated with your info
- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] Secrets are safe (not on GitHub)
- [ ] Repository description added
- [ ] Topics/tags added

---

**🎉 Congratulations! Your project is now safely on GitHub!**

Remember: **NEVER commit secrets, API keys, or passwords!**
