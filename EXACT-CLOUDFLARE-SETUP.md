# Exact Cloudflare Setup (Workers Flow)

## Fill in the form exactly like this:

### Project name
```
quickbet-prediction-market
```

### Build command (Optional)
```
cd frontend && npm install && npm run build
```

### Deploy command
```
npx wrangler deploy
```

### Non-production branch deploy command (Optional)
```
(leave empty or use default: npx wrangler versions upload)
```

### Path
```
/
```
(leave as default slash)

### API token
```
Select: "A new token will be created automatically"
```
(Keep the default - Cloudflare will create it for you)

### API token name
```
(auto-generated - leave as is)
```

### Environment Variables

Click **"Add variable"** and add these one by one:

| Variable name | Variable value |
|---------------|----------------|
| `NODE_VERSION` | `20` |
| `VITE_LINERA_NODE_URL` | `http://localhost:8080` |
| `VITE_APP_ID` | `placeholder` |
| `VITE_CHAIN_ID` | `placeholder` |

**Note:** You can update the Linera variables later when you have real values.

---

## Then Click "Connect"

Cloudflare will:
1. Create an API token automatically
2. Set up the project
3. Trigger the first deployment
4. Build and deploy your app

---

## After First Deployment

You can update environment variables:
1. Go to **Settings** → **Variables**
2. Update `VITE_LINERA_NODE_URL`, `VITE_APP_ID`, `VITE_CHAIN_ID`
3. Trigger new deployment

---

## Important Notes

✅ The **Deploy command** uses `npx wrangler deploy` which is correct for this flow
✅ Cloudflare will automatically install wrangler and handle deployment
✅ The build happens before deploy, so output goes to `frontend/dist`
✅ Wrangler will read `frontend/wrangler.jsonc` for configuration

---

## Your App Will Be Live At

```
https://quickbet-prediction-market.<your-subdomain>.workers.dev
```

Or if using Pages subdomain:
```
https://quickbet-prediction-market.pages.dev
```

---

## If Build Fails

Check these:
1. Build command is exactly: `cd frontend && npm install && npm run build`
2. Node version is set: `NODE_VERSION=20`
3. Check build logs in Cloudflare dashboard
4. Verify `frontend/dist` is created after build

---

**Ready?** Click "Connect" and your app will deploy! 🚀
