# Windows Deployment Guide

## ❌ Issue: Build Fails on Windows

You're seeing this error:
```
error: linking with `link.exe` failed
note: in the Visual Studio installer, ensure the "C++ build tools" workload is selected
```

This is because Rust on Windows needs Visual Studio C++ Build Tools.

---

## ✅ Solution: Use Docker (Easiest)

Docker handles everything without needing VS Build Tools!

### Step 1: Install Docker Desktop

Download: https://www.docker.com/products/docker-desktop/

### Step 2: Deploy Everything
```bash
cd prediction-market

# Build and deploy (this takes ~10 minutes first time)
docker compose -f compose.linera.yaml up --build
```

**This will:**
- ✅ Build Linera contract inside Docker (Linux environment)
- ✅ Deploy contract
- ✅ Start GraphQL service on port 8080
- ✅ Start frontend on port 5173
- ✅ Everything working!

### Step 3: Get Values

While it's running, check logs:
```bash
docker compose -f compose.linera.yaml logs linera-node
```

Look for:
```
Chain ID: e476187f...
App ID: e476187f...
```

---

## Alternative: Install VS Build Tools (If You Want Native Build)

### Option A: Quick Install
```powershell
# In PowerShell as Administrator
winget install Microsoft.VisualStudio.2022.BuildTools

# Or use chocolatey
choco install visualstudio2022buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools"
```

### Option B: Manual Install
1. Download: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. Run installer
3. Select "Desktop development with C++"
4. Install (takes ~6 GB)

### Then Rebuild:
```bash
cd prediction-market
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

---

## 🐳 Recommended: Docker Method

**Advantages:**
- ✅ No VS Build Tools needed (save 6GB)
- ✅ Consistent Linux environment
- ✅ Easier to deploy to production later
- ✅ Works exactly like production

**Commands:**
```bash
# Start
docker compose -f compose.linera.yaml up -d

# View logs
docker compose -f compose.linera.yaml logs -f

# Stop
docker compose -f compose.linera.yaml down

# Restart
docker compose -f compose.linera.yaml restart
```

---

## 🎯 After Docker Deploy

### Get Your Configuration

1. **Check logs for Chain ID and App ID:**
   ```bash
   docker compose -f compose.linera.yaml logs linera-node | findstr "Chain ID"
   docker compose -f compose.linera.yaml logs linera-node | findstr "App ID"
   ```

2. **Test GraphQL:**
   ```bash
   curl http://localhost:8080
   ```

3. **Access frontend:**
   ```
   http://localhost:5173
   ```

### Make Public with ngrok

```bash
# Install ngrok
choco install ngrok
# or download from ngrok.com

# Expose port 8080
ngrok http 8080

# Copy HTTPS URL
```

Use this ngrok URL in Cloudflare!

---

## 🚀 Quick Start (Docker)

```bash
# 1. Start Docker Desktop

# 2. Deploy
cd prediction-market
docker compose -f compose.linera.yaml up --build

# 3. Wait ~10 minutes for first build

# 4. Check it's running
curl http://localhost:8080
curl http://localhost:5173

# 5. Get Chain ID and App ID from logs

# 6. Use ngrok for public URL

# 7. Deploy to Cloudflare with real values
```

---

## ✅ Verification

After Docker starts:

- ✅ Linera node: http://localhost:8080
- ✅ Frontend: http://localhost:5173
- ✅ Check logs: `docker compose -f compose.linera.yaml logs`
- ✅ Enter container: `docker exec -it prediction-market-linera-node-1 bash`

---

## 📝 For Cloudflare

After deployment, use these values:

| Variable | Where to get it |
|----------|-----------------|
| `VITE_LINERA_NODE_URL` | Your ngrok URL (e.g., `https://abc123.ngrok.io`) |
| `VITE_CHAIN_ID` | From Docker logs |
| `VITE_APP_ID` | From Docker logs |

---

## 🐛 Troubleshooting

### Docker not starting
```bash
# Restart Docker Desktop
# Then try again
docker compose -f compose.linera.yaml up --build
```

### Port 8080 already in use
```bash
# Stop existing services
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in compose.linera.yaml
```

### Can't see logs
```bash
# Follow logs live
docker compose -f compose.linera.yaml logs -f linera-node

# Last 100 lines
docker compose -f compose.linera.yaml logs --tail=100
```

---

## 💡 Summary

**On Windows, use Docker:**
1. Install Docker Desktop
2. Run `docker compose -f compose.linera.yaml up --build`
3. Get Chain ID and App ID from logs
4. Use ngrok for public URL
5. Deploy to Cloudflare

**Much easier than installing VS Build Tools!** 🎉
