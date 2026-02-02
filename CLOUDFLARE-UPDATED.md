# Cloudflare Pages Deployment - Updated Guide 2026

## ✅ Recommended Approach: Git Integration (Easiest & Official)

Based on the latest Cloudflare documentation, the **Git Integration** method is recommended for static sites like QuickBet.

---

## Method 1: Git Integration (Recommended)

### Step 1: Push to GitHub

```bash
cd prediction-market
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to **https://dash.cloudflare.com**
2. Click **"Workers & Pages"**
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**
6. Authorize GitHub and select: `arsis69/quickbet-prediction-market`

### Step 3: Configure Build Settings

```
Framework preset: Vite
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: (leave empty)
Node version: 20
```

### Step 4: Environment Variables

Add in **Settings → Environment variables**:

```
VITE_LINERA_NODE_URL = https://your-linera-node.com
VITE_APP_ID = your-application-id
VITE_CHAIN_ID = your-chain-id
```

### Step 5: Deploy

Click **"Save and Deploy"**

Your app will be live at:
`https://quickbet-prediction-market.pages.dev`

---

## Method 2: Direct Upload with Wrangler

### Install Wrangler

```bash
npm install -g wrangler
```

### Login to Cloudflare

```bash
wrangler login
```

### Build and Deploy

```bash
cd prediction-market/frontend

# Install dependencies
npm install

# Build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name=quickbet-prediction-market
```

---

## Method 3: C3 CLI (For New Projects)

For creating new projects from scratch:

```bash
npm create cloudflare@latest my-app
```

This isn't needed for existing projects like QuickBet.

---

## Important Configuration Files

### 1. `wrangler.jsonc` (Optional for advanced features)

```json
{
  "name": "quickbet-prediction-market",
  "compatibility_date": "2026-02-02",
  "assets": {
    "not_found_handling": "single-page-application"
  }
}
```

**Note**: This file is **optional** for basic static deployments. Cloudflare Pages automatically handles SPAs when using Git Integration.

### 2. `_redirects` (Required for SPA routing)

Located at `frontend/public/_redirects`:
```
/*    /index.html   200
```

This ensures all routes work correctly in your React SPA.

### 3. `_headers` (Recommended for security)

Located at `frontend/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Access-Control-Allow-Origin: *
```

---

## GitHub Actions (Auto-Deploy)

Your `.github/workflows/deploy.yml` uses the official Cloudflare Pages Action:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: quickbet-prediction-market
    directory: frontend/dist
```

### Required Secrets

Add these in GitHub → Settings → Secrets:

1. **CLOUDFLARE_API_TOKEN**
   - Get from: Cloudflare Dashboard → My Profile → API Tokens
   - Template: "Edit Cloudflare Workers"

2. **CLOUDFLARE_ACCOUNT_ID**
   - Get from: Cloudflare Dashboard → Workers & Pages (in the URL or sidebar)

3. **Environment variables** (optional):
   - VITE_LINERA_NODE_URL
   - VITE_APP_ID
   - VITE_CHAIN_ID

---

## Key Updates from 2026 Cloudflare Docs

### What Changed:

1. ✅ **Git Integration is now the primary recommended method** for static sites
2. ✅ **Cloudflare Vite Plugin** is available but optional (mainly for Workers features)
3. ✅ **wrangler.jsonc** replaces wrangler.toml (but still optional for Pages)
4. ✅ **Pages handles SPA routing automatically** with Git Integration
5. ✅ **Build configuration moved to dashboard** (easier setup)

### What Stayed the Same:

- ✅ `_redirects` file for custom routing
- ✅ `_headers` file for security headers
- ✅ Environment variables configuration
- ✅ 500 builds/month on free tier
- ✅ Unlimited bandwidth

---

## Cloudflare Vite Plugin (Advanced - Optional)

Only needed if you want:
- Server-side rendering (SSR)
- Cloudflare Workers integration
- Edge functions
- Bindings to Cloudflare services (KV, R2, D1)

For **static React SPAs** (like QuickBet), the Git Integration method is simpler and recommended.

### To use the plugin (optional):

```bash
npm install -D @cloudflare/vite-plugin wrangler
```

Update `vite.config.ts`:
```typescript
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    cloudflare()
  ]
})
```

Then deploy with:
```bash
npm run build
wrangler deploy
```

---

## Troubleshooting

### Build Fails
- Ensure `frontend/dist` exists after build
- Check Node version is 20+
- Verify all dependencies install correctly

### 404 on Refresh
- Ensure `_redirects` file is in `frontend/public/`
- Check it's copied to `dist/` during build

### Environment Variables Not Working
- Add variables in Cloudflare Dashboard → Settings → Environment variables
- Retry deployment after adding variables
- Variables must start with `VITE_` prefix

---

## Comparison: Which Method to Use?

| Method | Best For | Setup Time | Auto-Deploy |
|--------|----------|------------|-------------|
| **Git Integration** | Most users | 5 minutes | ✅ Yes |
| **Direct Upload** | Quick tests | 2 minutes | ❌ Manual |
| **Wrangler CLI** | Automation | 10 minutes | Via scripts |
| **Vite Plugin** | Advanced features | 15 minutes | ✅ Yes |

**Recommendation**: Use **Git Integration** for QuickBet.

---

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Connected to Cloudflare Pages
- [ ] Build succeeds in dashboard
- [ ] Environment variables set
- [ ] App loads at `.pages.dev` URL
- [ ] Wallet connection works
- [ ] All features tested
- [ ] Custom domain added (optional)
- [ ] Analytics enabled
- [ ] Performance > 90 (Lighthouse)

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [React + Vite Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Pages Build Config](https://developers.cloudflare.com/pages/configuration/build-configuration/)

---

**Updated: February 2026 - Based on latest Cloudflare documentation**
