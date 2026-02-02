# Automated Linera Deployment

I've created complete automated deployment for you!

## 🚀 Method 1: One-Command Deploy (Linux/Mac)

```bash
cd prediction-market
chmod +x deploy-linera.sh
./deploy-linera.sh
```

This script will:
1. ✅ Install Rust (if needed)
2. ✅ Add WASM target
3. ✅ Install Linera CLI
4. ✅ Build contract
5. ✅ Initialize wallet
6. ✅ Start local network
7. ✅ Deploy contract
8. ✅ Start GraphQL service
9. ✅ Create test market
10. ✅ Save configuration to `frontend/.env.local`
11. ✅ Generate `DEPLOYMENT_INFO.md` with all values

**Output:** You'll get Chain ID, App ID, and running GraphQL service!

---

## 🐳 Method 2: Docker Deploy (Any Platform)

```bash
cd prediction-market

# Build and start everything
docker compose -f compose.linera.yaml up --build
```

This will:
- ✅ Build contract in Docker
- ✅ Deploy Linera node
- ✅ Start GraphQL service on port 8080
- ✅ Start frontend on port 5173
- ✅ Everything connected automatically

**Access:**
- Frontend: http://localhost:5173
- GraphQL: http://localhost:8080

---

## 🌐 Method 3: Testnet Deploy

For production/buildathon submission:

```bash
cd prediction-market

# Use testnet version
./deploy-linera.sh --testnet
```

Or manually:
```bash
# Initialize with testnet
linera wallet init --testnet

# Get testnet tokens
linera faucet --testnet

# Build contract
cargo build --release --target wasm32-unknown-unknown

# Deploy to testnet
linera --testnet publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm

# Start service
linera --testnet service --port 8080
```

---

## 📝 After Deployment

### You'll get these files:

1. **`frontend/.env.local`** - Frontend configuration
   ```env
   VITE_LINERA_NODE_URL=http://localhost:8080
   VITE_CHAIN_ID=e476187f...
   VITE_APP_ID=e476187f...
   ```

2. **`DEPLOYMENT_INFO.md`** - Complete deployment details
   - Chain ID
   - Application ID
   - GraphQL endpoint
   - Test commands

### Test locally:
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 - should connect to real contract!

---

## 🔓 Make Public (For Cloudflare)

Your Cloudflare frontend needs public access to your node.

### Option A: ngrok (Quick)
```bash
# Install ngrok
brew install ngrok  # Mac
# or download from ngrok.com

# Expose port 8080
ngrok http 8080

# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
```

Use this URL in Cloudflare environment variables!

### Option B: Deploy to Server (Production)

1. Get a VPS (DigitalOcean, AWS, etc.)
2. Install Docker
3. Run: `docker compose -f compose.linera.yaml up -d`
4. Set up Nginx with SSL
5. Use your domain as `VITE_LINERA_NODE_URL`

---

## 📋 Cloudflare Environment Variables

After deployment, use these **real values** in Cloudflare:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` |
| `VITE_LINERA_NODE_URL` | `https://your-ngrok-url.ngrok.io` |
| `VITE_CHAIN_ID` | `(from DEPLOYMENT_INFO.md)` |
| `VITE_APP_ID` | `(from DEPLOYMENT_INFO.md)` |

---

## 🎯 For Buildathon Submission

### Recommended Setup:

1. **Deploy to testnet** (more stable)
2. **Use VPS** for permanent node URL
3. **Deploy frontend to Cloudflare** with real values
4. **Create demo video** showing all features

### Testnet Deployment:
```bash
./deploy-linera.sh --testnet
```

Then update Cloudflare with testnet values.

---

## 🐛 Troubleshooting

### Script fails on Rust install
```bash
# Install Rust manually
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
./deploy-linera.sh
```

### Port 8080 already in use
```bash
# Kill existing process
lsof -i :8080
kill -9 <PID>
./deploy-linera.sh
```

### Docker build fails
```bash
# Clean and rebuild
docker compose -f compose.linera.yaml down -v
docker compose -f compose.linera.yaml build --no-cache
docker compose -f compose.linera.yaml up
```

---

## ✅ Verification Checklist

After running deployment:

- [ ] `DEPLOYMENT_INFO.md` exists with Chain ID and App ID
- [ ] `frontend/.env.local` has correct values
- [ ] GraphQL endpoint responds: `curl http://localhost:8080`
- [ ] Can query markets (test command in DEPLOYMENT_INFO.md)
- [ ] Frontend connects: `cd frontend && npm run dev`
- [ ] Can create markets in UI
- [ ] Can place bets
- [ ] Ready for Cloudflare deployment

---

## 🚀 Quick Start

**Just run this:**
```bash
cd prediction-market
chmod +x deploy-linera.sh
./deploy-linera.sh
```

**Then wait ~5 minutes and you'll have:**
- ✅ Deployed Linera contract
- ✅ Running GraphQL service
- ✅ Real Chain ID and App ID
- ✅ Ready for Cloudflare!

---

**Everything is automated - just run the script!** 🎉
