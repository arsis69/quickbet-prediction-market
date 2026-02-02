# 🚀 Deploy QuickBet to Cloudflare NOW

## Step 1: Create GitHub Repository

1. Go to https://github.com/arsis69
2. Click "New repository" (green button)
3. Name it: `quickbet-prediction-market`
4. Description: `Prediction markets on Linera blockchain`
5. Keep it **Public** (for Cloudflare Pages free tier)
6. **Do NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

## Step 2: Push to GitHub

Run these commands:

```bash
cd prediction-market

# Push to your GitHub
git push -u origin main
```

If you get an authentication error:
```bash
# Use personal access token
git push https://YOUR_TOKEN@github.com/arsis69/quickbet-prediction-market.git main
```

Or use SSH:
```bash
git remote set-url origin git@github.com:arsis69/quickbet-prediction-market.git
git push -u origin main
```

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Easiest)

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "Create application"
4. Click "Pages" tab
5. Click "Connect to Git"
6. Authorize GitHub access
7. Select `arsis69/quickbet-prediction-market`
8. Configure build:

```
Framework preset: Vite
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: (leave empty)
```

9. Click "Save and Deploy"
10. Wait 2-3 minutes for build

**Your app will be live at:**
`https://quickbet-prediction-market.pages.dev`

### Option B: Via Wrangler CLI (Advanced)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
cd prediction-market
bash cloudflare-deploy.sh
```

## Step 4: Configure Environment Variables

1. In Cloudflare Dashboard → Pages → quickbet-prediction-market
2. Go to "Settings" → "Environment variables"
3. Add these variables:

**Production environment:**
```
VITE_LINERA_NODE_URL = https://your-linera-node.com
VITE_APP_ID = your-application-id
VITE_CHAIN_ID = your-chain-id
NODE_ENV = production
```

4. Click "Save"
5. Go to "Deployments" → Click "..." on latest deployment → "Retry deployment"

## Step 5: Set Up Custom Domain (Optional)

1. Go to "Custom domains" tab
2. Click "Set up a custom domain"
3. Enter your domain: `quickbet.yourdomain.com`
4. Add CNAME record to your DNS:
   ```
   CNAME quickbet <your-pages-subdomain>.pages.dev
   ```
5. Wait for SSL certificate (~2 minutes)

## Step 6: Set Up GitHub Actions (Optional)

Your repo already has `.github/workflows/deploy.yml`

Add these secrets in GitHub:
1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:

```
CLOUDFLARE_API_TOKEN = your-api-token
CLOUDFLARE_ACCOUNT_ID = your-account-id
VITE_LINERA_NODE_URL = https://your-linera-node.com
VITE_APP_ID = your-app-id
VITE_CHAIN_ID = your-chain-id
```

Get Cloudflare API Token:
1. Cloudflare Dashboard → My Profile → API Tokens
2. Create Token → "Edit Cloudflare Workers" template
3. Copy token and add to GitHub secrets

Get Account ID:
1. Cloudflare Dashboard → Workers & Pages
2. Copy the Account ID from the URL or sidebar

## Testing Checklist

After deployment, test:
- [ ] Homepage loads
- [ ] Wallet connection works
- [ ] Markets display correctly
- [ ] Create market works
- [ ] Place bet works
- [ ] Leaderboard opens
- [ ] Profile modal works
- [ ] Transaction history shows
- [ ] Mobile responsive
- [ ] Fast loading (< 2s)

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare Dashboard
- Verify `package.json` and `vite.config.ts` are correct
- Check Node version is 20+

### 404 Errors
- Ensure `_redirects` file is in `frontend/public/`
- Check build output directory is `frontend/dist`

### Blank Page
- Check browser console for errors
- Verify environment variables are set
- Check Cloudflare Pages logs

### CORS Errors
- Ensure `_headers` file is in `frontend/public/`
- Configure your Linera node to allow CORS
- Check Cloudflare CORS settings

## Performance Optimization

After deployment:
1. Run Lighthouse audit: https://pagespeed.web.dev/
2. Target scores: Performance > 90, SEO > 95
3. Enable Cloudflare features:
   - Auto Minify (CSS, JS, HTML)
   - Brotli compression
   - HTTP/3
   - Early Hints

## Monitoring

### Cloudflare Analytics
- Dashboard → Pages → Your Project → Analytics
- View: Page views, visitors, bandwidth, requests

### Custom Analytics
Add to `frontend/index.html`:
```html
<!-- Plausible (privacy-friendly) -->
<script defer data-domain="quickbet.pages.dev"
  src="https://plausible.io/js/script.js"></script>
```

## Cost

✅ **FREE** on Cloudflare Pages:
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- Free SSL certificate
- Free DDoS protection

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ⏳ Deploy Linera contract to testnet
3. ⏳ Configure environment variables
4. ⏳ Test all features
5. ⏳ Share on Twitter/Discord
6. ⏳ Submit to Linera Buildathon

## Share Your Deployment

Tweet:
```
Just deployed QuickBet - a prediction market on @lineraprotocol!

Create markets, place bets, win rewards. All on-chain. 🎯

Try it: https://quickbet-prediction-market.pages.dev

Built for #LineraBuilathon
#Web3 #PredictionMarkets #DeFi
```

## Support

- **Issues**: https://github.com/arsis69/quickbet-prediction-market/issues
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Linera Discord**: https://discord.gg/linera

---

**Your app is ready to deploy! 🎉**

Run: `git push -u origin main`

Then follow the steps above!
