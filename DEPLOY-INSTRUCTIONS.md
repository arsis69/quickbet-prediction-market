# 🚀 Cloudflare Pages Deployment - Exact Steps

## Step 1: Push to GitHub

```bash
cd prediction-market
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

If the repository doesn't exist, create it first:
1. Go to https://github.com/arsis69
2. Click "New repository"
3. Name: `quickbet-prediction-market`
4. Keep it Public
5. Don't initialize with anything
6. Click "Create repository"

Then push:
```bash
git remote add origin https://github.com/arsis69/quickbet-prediction-market.git
git push -u origin main
```

---

## Step 2: Connect to Cloudflare Pages

1. Go to **https://dash.cloudflare.com**
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create application"** button
4. Click **"Pages"** tab
5. Click **"Connect to Git"**
6. Click **"Connect GitHub"** (authorize if needed)
7. Select: `arsis69/quickbet-prediction-market`
8. Click **"Begin setup"**

---

## Step 3: Configure Build Settings

Cloudflare will show you a configuration form. Fill it exactly like this:

### Framework Preset
```
Vite
```
(Select from dropdown)

### Build Command
```
cd frontend && npm install && npm run build
```

### Build Output Directory
```
frontend/dist
```

### Root Directory (optional)
```
(leave empty)
```

### Environment Variables
Click **"Add variable"** and add these:

| Variable Name | Value |
|---------------|-------|
| `NODE_VERSION` | `20` |
| `VITE_LINERA_NODE_URL` | `https://your-linera-node.com` |
| `VITE_APP_ID` | `your-app-id-here` |
| `VITE_CHAIN_ID` | `your-chain-id-here` |

**Note:** You can add the Linera variables later if you don't have them yet.

---

## Step 4: Deploy

Click **"Save and Deploy"**

Cloudflare will:
1. Clone your repository
2. Install dependencies
3. Build your project
4. Deploy to CDN

This takes about 2-3 minutes.

---

## Step 5: View Your Live Site

After deployment completes, you'll see:

**Your site is live at:**
```
https://quickbet-prediction-market.pages.dev
```

Click the link to view your app!

---

## If You See "Deploy Command" Field

Some Cloudflare Pages setups show both "Build Command" and "Deploy Command" fields:

### Build Command (same as above)
```
cd frontend && npm install && npm run build
```

### Deploy Command
```
(leave empty or use default)
```

**Important:** For Cloudflare Pages with Git integration, you should **leave the Deploy Command empty** or keep the default. The deployment happens automatically after the build.

If it shows `npx wrangler deploy` as default, you can:
- **Option 1:** Leave it as is (Cloudflare will handle it)
- **Option 2:** Clear it and leave empty (recommended for simple static sites)

---

## Environment Variables (Add Later if Needed)

To add or update environment variables after initial deployment:

1. Go to your project in Cloudflare Dashboard
2. Click **"Settings"** → **"Environment variables"**
3. Click **"Add variable"**
4. Add:
   - `VITE_LINERA_NODE_URL`
   - `VITE_APP_ID`
   - `VITE_CHAIN_ID`
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"..."** on the latest deployment
8. Click **"Retry deployment"**

---

## Custom Domain (Optional)

To add your own domain:

1. Go to **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `quickbet.yourdomain.com`
4. Cloudflare will show you DNS records to add
5. Add a CNAME record in your domain's DNS:
   ```
   CNAME quickbet quickbet-prediction-market.pages.dev
   ```
6. Wait for SSL certificate (~2 minutes)
7. Your app will be live at your custom domain!

---

## Troubleshooting

### Build Fails

**Check the build logs:**
1. Go to **"Deployments"** tab
2. Click on the failed deployment
3. Click **"View build log"**

**Common issues:**
- Wrong build command: Ensure it's `cd frontend && npm install && npm run build`
- Wrong output directory: Should be `frontend/dist`
- Node version: Add `NODE_VERSION=20` environment variable

### Site Shows 404

- Check `_redirects` file exists in `frontend/public/`
- Verify it contains: `/* /index.html 200`
- Retry deployment

### Blank Page

- Open browser console (F12)
- Check for errors
- Verify environment variables are set correctly
- Check that `dist` folder was created during build

---

## Build Verification

To verify your build works locally:

```bash
cd prediction-market/frontend
npm install
npm run build
npm run preview
```

Visit http://localhost:4173 - if it works here, it'll work on Cloudflare!

---

## GitHub Actions (Optional Auto-Deploy)

Your repo already has `.github/workflows/deploy.yml`.

To enable it:
1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN` (get from Cloudflare Dashboard → API Tokens)
   - `CLOUDFLARE_ACCOUNT_ID` (from Cloudflare Dashboard URL)
3. Now every push to `main` will auto-deploy!

---

## Quick Command Summary

```bash
# 1. Commit changes
git add .
git commit -m "Deploy to Cloudflare"
git push

# 2. View build logs
# Go to Cloudflare Dashboard → Deployments → View build log

# 3. Test locally first
npm run build && npm run preview
```

---

**Ready to deploy?** Follow Step 1 above! 🚀

---

## Sources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [React + Vite Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- [Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
