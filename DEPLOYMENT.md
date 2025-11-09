# Deploying to GitHub Pages

This guide walks you through deploying your Astro site to GitHub Pages at `https://avinashbhat.github.io`

## 📋 Prerequisites

- GitHub repository set up
- Repository is public (or GitHub Pro for private repos)

## 🚀 Deployment Steps

### Step 1: Push Your Code to GitHub

If starting fresh with the Astro version:

```bash
cd /home/user/avinashbhat-astro

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Astro site"

# Add your GitHub repository as remote
git remote add origin https://github.com/avinashbhat/avinashbhat.github.io.git

# Push to a new branch (e.g., astro-migration)
git checkout -b astro-migration
git push -u origin astro-migration
```

### Step 2: Configure GitHub Repository Settings

1. Go to your repository on GitHub: `https://github.com/avinashbhat/avinashbhat.github.io`

2. Click **Settings** → **Pages** (in the left sidebar)

3. Under **Source**, select:
   - Source: **GitHub Actions**

   ![GitHub Pages Source](https://docs.astro.build/assets/pages-source.png)

4. Save the settings

### Step 3: Trigger Deployment

Your site will automatically deploy when you:
- Push to the `main` branch
- Manually trigger from the Actions tab

**To trigger deployment:**

```bash
# Make sure you're on main branch (or merge your changes to main)
git checkout main
git merge astro-migration
git push origin main
```

Or manually trigger:
1. Go to **Actions** tab in GitHub
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

### Step 4: Wait for Build

1. Go to the **Actions** tab in your GitHub repository
2. Watch the deployment progress (usually takes 1-2 minutes)
3. Once complete, you'll see a green checkmark ✓

### Step 5: Visit Your Site

Your site will be live at:
**https://avinashbhat.github.io**

## 🔄 Alternative: Deploy from Existing Jekyll Repo

If you want to replace your Jekyll site with Astro in the same repo:

### Option A: Replace in Main Branch

```bash
# In your Jekyll repo
cd /home/user/avinashbhat.github.io

# Create backup branch
git checkout -b jekyll-backup
git push origin jekyll-backup

# Go back to main
git checkout main

# Remove Jekyll files (keep .git folder!)
git rm -r * .*
git commit -m "Remove Jekyll files"

# Copy Astro files
cp -r /home/user/avinashbhat-astro/* .
cp -r /home/user/avinashbhat-astro/.github .
cp /home/user/avinashbhat-astro/.gitignore .

# Commit Astro files
git add .
git commit -m "Migrate to Astro"
git push origin main
```

### Option B: Keep Both Versions (Branches)

```bash
# Keep Jekyll on main branch
# Astro on astro branch

cd /home/user/avinashbhat.github.io
git checkout -b astro

# Remove everything except .git
find . -not -path './.git/*' -not -name '.git' -delete

# Copy Astro files
cp -r /home/user/avinashbhat-astro/* .
cp -r /home/user/avinashbhat-astro/.github .
cp /home/user/avinashbhat-astro/.gitignore .

git add .
git commit -m "Add Astro version"
git push -u origin astro

# Then in GitHub Settings > Pages, change source branch to 'astro'
```

## ⚙️ Configuration Notes

### Site URL Configuration

The `astro.config.mjs` is already configured for GitHub Pages:

```javascript
export default defineConfig({
  site: 'https://avinashbhat.github.io',
  base: '/',  // Root domain
  // ...
});
```

**If using a subdirectory** (e.g., `https://username.github.io/repo-name`), update:
```javascript
base: '/repo-name/',
```

### Custom Domain

If you have a custom domain:

1. Add `CNAME` file to `public/` folder:
   ```bash
   echo "yourdomain.com" > /home/user/avinashbhat-astro/public/CNAME
   ```

2. In GitHub Settings → Pages → Custom domain, enter your domain

3. Update `astro.config.mjs`:
   ```javascript
   site: 'https://yourdomain.com',
   base: '/',
   ```

## 🧪 Testing Before Deployment

Always test the production build locally:

```bash
cd /home/user/avinashbhat-astro

# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4321 and verify everything works.

## 🔍 Troubleshooting

### Build Fails on GitHub Actions

**Check the logs:**
1. Go to Actions tab
2. Click the failed workflow
3. Click the failed job
4. Expand the failing step

**Common issues:**

1. **Missing dependencies:**
   - Make sure `package-lock.json` is committed
   - Run `npm ci` instead of `npm install` in CI

2. **SCSS deprecation warning:**
   - This is just a warning, not an error
   - Build still succeeds

3. **404 on assets:**
   - Check that `base` in `astro.config.mjs` matches your URL structure

### Site Shows Old Content

**Clear GitHub Pages cache:**
1. Make a small change
2. Commit and push
3. Wait for new deployment
4. Hard refresh your browser (Cmd/Ctrl + Shift + R)

### Permissions Error

If deployment fails with permissions error:

1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Save

## 📊 Deployment Stats

**Expected results:**
- Build time: ~2-3 seconds
- Deploy time: ~30-60 seconds
- Total time: ~1-2 minutes
- Site size: ~500KB (compressed)

## 🎯 Deployment Checklist

Before deploying:

- [ ] Test build locally (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] All links work
- [ ] Images load
- [ ] Dark mode works
- [ ] Tabs function correctly
- [ ] Mobile responsive
- [ ] Analytics working (check in incognito)
- [ ] `.gitignore` includes `node_modules/`, `dist/`
- [ ] GitHub Actions workflow file exists

After deploying:

- [ ] Site accessible at https://avinashbhat.github.io
- [ ] All pages load (/, /about, /blog/*)
- [ ] No console errors
- [ ] Google Analytics firing
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] robots.txt accessible (/robots.txt)
- [ ] Favicon displays

## 🔄 Continuous Deployment

Once set up, your workflow is:

1. Edit content (update JSON files or add blog posts)
2. Test locally: `npm run dev`
3. Commit changes: `git commit -am "Update content"`
4. Push to GitHub: `git push`
5. GitHub automatically builds and deploys
6. Site updates in 1-2 minutes

## 📚 Additional Resources

- [Astro GitHub Pages Guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Actions tab] for build logs
2. Verify repository settings
3. Test the build locally
4. Check Astro Discord or GitHub Discussions

---

**Your site will be live at:** https://avinashbhat.github.io

Happy deploying! 🚀
