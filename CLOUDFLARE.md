# Cloudflare Deployment Guide - QuickBet

Complete guide to deploy QuickBet on Cloudflare Pages.

## Prerequisites

- Cloudflare account (free tier works)
- Node.js 20+ installed
- Git repository (GitHub, GitLab, or Bitbucket)
- Wrangler CLI (will be installed automatically)

## Deployment Options

### Option 1: Automatic Deployment Script (Recommended)

```bash
cd prediction-market
bash cloudflare-deploy.sh
```

This will:
1. Install Wrangler if needed
2. Login to Cloudflare
3. Build the frontend
4. Deploy to Cloudflare Pages

### Option 2: Manual Deployment via Wrangler CLI

#### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

#### Step 2: Login to Cloudflare
```bash
wrangler login
```

#### Step 3: Build Frontend
```bash
cd prediction-market/frontend
npm install
npm run build
```

#### Step 4: Deploy
```bash
wrangler pages deploy dist --project-name=quickbet-prediction-market
```

### Option 3: Deploy via Cloudflare Dashboard (Git Integration)

#### Step 1: Push to Git
```bash
cd prediction-market
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 2: Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "Create application"
4. Click "Pages" tab
5. Click "Connect to Git"
6. Select your repository
7. Configure build settings:

**Build Configuration:**
```
Build command: cd frontend && npm install && npm run build
Build output directory: frontend/dist
Root directory: /
Node version: 20
```

**Environment Variables:**
```
NODE_ENV = production
VITE_LINERA_NODE_URL = https://your-linera-node.com
VITE_APP_ID = your-application-id
VITE_CHAIN_ID = your-chain-id
```

8. Click "Save and Deploy"

---

## Configuration

### 1. Environment Variables

Set these in Cloudflare Dashboard → Pages → Settings → Environment Variables:

```bash
# Production environment
NODE_ENV=production

# Linera Node Configuration
VITE_LINERA_NODE_URL=https://your-linera-node.com
VITE_APP_ID=your-application-id
VITE_CHAIN_ID=your-chain-id

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### 2. Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `quickbet.yourdomain.com`)
5. Follow DNS configuration instructions
6. Wait for SSL certificate (automatic, ~2 minutes)

### 3. Update Frontend Configuration

Update `frontend/src/hooks/useLinera.ts`:

```typescript
// Replace localhost with your Linera node URL
const GRAPHQL_ENDPOINT = import.meta.env.VITE_LINERA_NODE_URL
  ? `${import.meta.env.VITE_LINERA_NODE_URL}/chains/${import.meta.env.VITE_CHAIN_ID}/applications/${import.meta.env.VITE_APP_ID}`
  : '/api/graphql';
```

---

## Linera Node Setup

### Option A: Deploy Your Own Linera Node

You'll need a server to run the Linera node. Deploy on:

#### 1. DigitalOcean / AWS / GCP
```bash
# On your server
git clone https://github.com/linera-io/linera-protocol
cd linera-protocol
cargo build --release

# Start the service
./target/release/linera service --port 8080
```

#### 2. Configure Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name linera.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    }
}
```

#### 3. Enable SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d linera.yourdomain.com
```

### Option B: Use Linera Testnet

```bash
# Deploy to testnet
linera --testnet publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm

# Get your testnet endpoint
linera --testnet service --port 8080
```

Then use the public testnet URL in your environment variables.

---

## Cloudflare-Specific Optimizations

### 1. Caching Strategy

Already configured in `frontend/public/_headers`:
- Static assets cached for 1 year
- HTML files not cached (always fresh)

### 2. Security Headers

Pre-configured security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- CSP headers

### 3. SPA Routing

`_redirects` file handles all routes:
```
/*    /index.html   200
```

### 4. Performance

Cloudflare automatically provides:
- Global CDN (200+ locations)
- HTTP/3 support
- Brotli compression
- Image optimization
- Smart caching

---

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd frontend
          npm install

      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_LINERA_NODE_URL: ${{ secrets.LINERA_NODE_URL }}
          VITE_APP_ID: ${{ secrets.APP_ID }}
          VITE_CHAIN_ID: ${{ secrets.CHAIN_ID }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy frontend/dist --project-name=quickbet-prediction-market
```

Add secrets in GitHub:
- `CLOUDFLARE_API_TOKEN`
- `LINERA_NODE_URL`
- `APP_ID`
- `CHAIN_ID`

---

## Testing Deployment

### 1. Test Locally
```bash
cd frontend
npm run preview
```

### 2. Test on Cloudflare
After deployment, test:
- ✅ Homepage loads
- ✅ Wallet connection works
- ✅ Markets display
- ✅ Creating market works
- ✅ Placing bets works
- ✅ All modals open/close
- ✅ Responsive on mobile

### 3. Performance Testing
```bash
# Lighthouse audit
npx lighthouse https://quickbet-prediction-market.pages.dev --view

# WebPageTest
# Visit https://www.webpagetest.org/
```

---

## Monitoring & Analytics

### 1. Cloudflare Web Analytics

Free analytics included:
1. Dashboard → Pages → Your Project
2. Click "Web Analytics"
3. View metrics: page views, visitors, countries

### 2. Add Custom Analytics

Update `frontend/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Or Plausible (privacy-friendly) -->
<script defer data-domain="quickbet.pages.dev" src="https://plausible.io/js/script.js"></script>
```

### 3. Error Tracking

Add Sentry:
```bash
npm install @sentry/react @sentry/vite-plugin
```

Update `vite.config.ts`:
```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org",
      project: "quickbet"
    })
  ]
});
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Errors
- Check `_headers` file is in `frontend/public/`
- Verify Linera node allows CORS
- Check browser console for specific error

### 404 on Refresh
- Verify `_redirects` file exists in `frontend/public/`
- Check Cloudflare Pages build settings

### Slow Loading
- Enable Cloudflare Auto Minify (CSS, JS, HTML)
- Enable Rocket Loader
- Use Cloudflare CDN for all assets

### Wallet Connection Issues
- Ensure HTTPS is enabled
- Check MetaMask network settings
- Verify wallet permissions

---

## Cost Estimation

### Cloudflare Pages (Free Tier)
- ✅ 500 builds/month
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ Free SSL
- ✅ Free DDoS protection

### Linera Node (Self-Hosted)
- Server: $5-20/month (DigitalOcean/AWS)
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

**Total: ~$5-20/month for full deployment**

---

## Production Checklist

- [ ] Contract deployed to Linera
- [ ] Linera node running and accessible
- [ ] Frontend built successfully
- [ ] Deployed to Cloudflare Pages
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] CORS headers working
- [ ] Wallet connection tested
- [ ] All features working
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Performance tested (Lighthouse > 90)
- [ ] Mobile responsive
- [ ] SEO meta tags added

---

## SEO Optimization

Update `frontend/index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- SEO Meta Tags -->
  <title>QuickBet - Prediction Markets on Linera</title>
  <meta name="description" content="Create and bet on prediction markets. Decentralized, transparent, and secure on Linera blockchain." />
  <meta name="keywords" content="prediction markets, blockchain, betting, Linera, DeFi, Web3" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://quickbet.pages.dev/" />
  <meta property="og:title" content="QuickBet - Prediction Markets on Linera" />
  <meta property="og:description" content="Create and bet on prediction markets" />
  <meta property="og:image" content="https://quickbet.pages.dev/og-image.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://quickbet.pages.dev/" />
  <meta property="twitter:title" content="QuickBet - Prediction Markets" />
  <meta property="twitter:description" content="Create and bet on prediction markets on Linera" />
  <meta property="twitter:image" content="https://quickbet.pages.dev/og-image.png" />

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png" />
</head>
```

---

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Cloudflare Discord**: https://discord.cloudflare.com
- **Linera Docs**: https://linera.dev

---

**Your QuickBet app is ready for global deployment! 🌍**
