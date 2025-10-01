# ✅ Pre-Push Security Checklist

## 🔒 BEFORE YOU PUSH TO GITHUB

### Step 1: Verify .gitignore is Working

```bash
# Run this command
git status

# ✅ GOOD - You should see:
# - README.md
# - .gitignore
# - src/ files
# - package.json

# ❌ BAD - You should NOT see:
# - server/.env
# - node_modules/
# - .DS_Store
# - *.log files
```

### Step 2: Check Tracked Files

```bash
# List all files git is tracking
git ls-files

# Search for sensitive files
git ls-files | Select-String ".env"
git ls-files | Select-String "node_modules"

# If these show results, STOP and fix!
```

### Step 3: Verify .env is Ignored

```bash
# Try to add .env explicitly
git add server/.env

# You should see:
# "The following paths are ignored by one of your .gitignore files"

# If it gets added, your .gitignore is not working!
```

---

## 🔐 Security Checklist

- [ ] `.gitignore` file exists in root directory
- [ ] `server/.env` is listed in .gitignore
- [ ] `node_modules/` is listed in .gitignore
- [ ] `.env.example` created (without real secrets)
- [ ] Verified `.env` is NOT in `git status`
- [ ] Verified `.env` is NOT in `git ls-files`
- [ ] All API keys are in `.env` (not hardcoded)
- [ ] JWT_SECRET is in `.env` (not hardcoded)
- [ ] MongoDB URI with credentials is in `.env`

---

## 📝 Files to Include

### ✅ INCLUDE These:
- [x] All `.js` source files
- [x] `package.json` files
- [x] `.gitignore`
- [x] `README.md`
- [x] `.env.example` (template only)
- [x] Documentation files (`.md`)
- [x] Public assets (images, icons)

### ❌ EXCLUDE These:
- [x] `server/.env` (actual secrets)
- [x] `node_modules/` folders
- [x] `build/` or `dist/` folders
- [x] Log files (`*.log`)
- [x] OS files (`.DS_Store`, `Thumbs.db`)
- [x] IDE files (`.vscode/`, `.idea/`)

---

## 🚨 If You See These in Git Status - STOP!

```
# ❌ DANGER - Do not commit these:
server/.env
client/.env
node_modules/
.DS_Store
*.log
build/
dist/
```

**Fix before committing:**
```bash
git rm --cached server/.env
git rm -r --cached node_modules
git add .gitignore
git commit -m "Fix: Remove sensitive files from tracking"
```

---

## 🔄 What to Do if You Already Pushed Secrets

### IMMEDIATE ACTIONS:

1. **Change ALL secrets in your .env file**
   - Generate new JWT_SECRET
   - Regenerate Spoonacular API key
   - Change MongoDB credentials (if exposed)

2. **Remove from Git History**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch server/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Verify Removal**
   ```bash
   git log --all --full-history -- server/.env
   # Should show nothing
   ```

---

## ✅ Final Verification

Before pushing, run these commands:

```bash
# 1. Check status
git status

# 2. List tracked files
git ls-files | Select-String ".env"

# 3. Check .gitignore is working
cat .gitignore | Select-String ".env"

# 4. Verify no secrets in code
Select-String -Path "server\*.js" -Pattern "mongodb\+srv://|sk-|api_key"
```

---

## 📋 Push Checklist

- [ ] Ran `git status` - no sensitive files listed
- [ ] Ran `git ls-files` - no .env files shown
- [ ] `.gitignore` contains all sensitive patterns
- [ ] `.env.example` created with placeholders
- [ ] README.md updated with your information
- [ ] All secrets are in `.env` (not hardcoded)
- [ ] Created GitHub repository
- [ ] Remote origin added correctly
- [ ] Ready to push safely!

---

## 🎯 Safe Push Commands

```bash
# Only run these after completing checklist above:

git add .
git commit -m "Initial commit: Recipe Finder MERN application"
git remote add origin https://github.com/YOUR_USERNAME/recipe-finder.git
git branch -M main
git push -u origin main
```

---

## 📞 Need Help?

If unsure about anything:
1. **DON'T PUSH** until you're certain
2. Check `GITHUB_SETUP.md` for detailed instructions
3. Verify each item in this checklist
4. When in doubt, ask for help!

---

**Remember: Once secrets are on GitHub, they're compromised forever!**

**Better safe than sorry! 🔒**
