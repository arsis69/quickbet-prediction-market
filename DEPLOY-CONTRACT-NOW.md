# Deploy Linera Contract - Buildathon Requirements

## ✅ Buildathon Checklist
- [ ] Contract compiles to WASM
- [ ] Contract deployed to Linera
- [ ] Frontend connects to deployed contract
- [ ] All 4 operations work (Create, Bet, Resolve, Claim)
- [ ] Demo video/screenshots

---

## Step 1: Install Prerequisites

### Install Rust (if not installed)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Add WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

### Install Linera CLI
```bash
cargo install linera-client --locked
```

Verify:
```bash
linera --version
```

---

## Step 2: Build the Contract

```bash
cd prediction-market

# Build WASM binaries
cargo build --release --target wasm32-unknown-unknown
```

**Expected output:**
```
Compiling prediction-market v0.1.0
Finished release [optimized] target(s) in XX.XXs
```

**Verify WASM files exist:**
```bash
ls target/wasm32-unknown-unknown/release/*.wasm
```

Should show:
- `prediction_market_contract.wasm`
- `prediction_market_service.wasm`

---

## Step 3: Set Up Linera Wallet

### Option A: Local Development Network (Fastest)

```bash
# Initialize wallet
linera wallet init

# Start local network
linera net up

# This gives you a local test network with chains ready to use
```

### Option B: Linera Testnet (For Submission)

```bash
# Initialize wallet with testnet
linera wallet init --testnet

# Request testnet tokens
linera faucet --testnet
```

---

## Step 4: Deploy Contract to Linera

### Get Your Default Chain
```bash
linera wallet show
```

Copy your default chain ID (looks like: `e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000`)

### Publish the Application

```bash
linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm \
  --json-parameters '{}' \
  --json-argument '{}'
```

**SAVE THIS OUTPUT!** You'll get:
```
Application published successfully!
Application ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000
```

---

## Step 5: Start Linera Service

```bash
# Start GraphQL service on port 8080
linera service --port 8080
```

**Keep this running in a separate terminal!**

Test it:
```bash
curl http://localhost:8080
```

---

## Step 6: Get Your Configuration Values

From the previous steps, you now have:

1. **CHAIN_ID**: From `linera wallet show` (your default chain)
2. **APP_ID**: From the publish output
3. **NODE_URL**: `http://localhost:8080` (or testnet URL)

### Example Values:
```
VITE_LINERA_NODE_URL=http://localhost:8080
VITE_CHAIN_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
VITE_APP_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000
```

---

## Step 7: Test the Contract

### Test GraphQL Query
```bash
curl -X POST http://localhost:8080/chains/<YOUR_CHAIN_ID>/applications/<YOUR_APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ markets { id question yesPool noPool } }"}'
```

Expected: Empty markets list (no errors)
```json
{"data":{"markets":[]}}
```

### Test Creating a Market
```bash
linera mutate \
  --application <YOUR_APP_ID> \
  --operation 'CreateMarket { question: "Will Bitcoin reach $100k?", end_time: 1735689600000 }'
```

Expected:
```
MarketCreated(1)
```

### Query Again
```bash
curl -X POST http://localhost:8080/chains/<YOUR_CHAIN_ID>/applications/<YOUR_APP_ID> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ markets { id question } }"}'
```

Should now show your market!

---

## Step 8: Update Frontend Configuration

### Option A: Local Development

Create `frontend/.env.local`:
```bash
VITE_LINERA_NODE_URL=http://localhost:8080
VITE_CHAIN_ID=your-chain-id-here
VITE_APP_ID=your-app-id-here
```

Test locally:
```bash
cd frontend
npm run dev
```

### Option B: Deploy to Cloudflare with Real Values

Now go to Cloudflare and enter the **real values**:

| Variable name | Variable value |
|---------------|----------------|
| `NODE_VERSION` | `20` |
| `VITE_LINERA_NODE_URL` | `http://localhost:8080` |
| `VITE_CHAIN_ID` | `your-actual-chain-id` |
| `VITE_APP_ID` | `your-actual-app-id` |

---

## Step 9: Make Node URL Public (For Cloudflare)

Your Cloudflare frontend needs to reach your Linera node.

### Option A: Use ngrok (Quick Testing)
```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Expose port 8080
ngrok http 8080
```

Copy the HTTPS URL (like `https://abc123.ngrok.io`)

Use this as `VITE_LINERA_NODE_URL` in Cloudflare

### Option B: Deploy Node to Server (Production)

Deploy your Linera node to a VPS:
1. Get a DigitalOcean/AWS server
2. Run `linera service --port 8080`
3. Set up Nginx reverse proxy with SSL
4. Use that URL as `VITE_LINERA_NODE_URL`

---

## Step 10: Verify Full Stack

1. ✅ Contract deployed and running
2. ✅ GraphQL service accessible
3. ✅ Frontend connects to backend
4. ✅ Can create markets
5. ✅ Can place bets
6. ✅ Can resolve markets
7. ✅ Can claim winnings

---

## For Buildathon Submission

### Testnet Deployment (Recommended)

1. Use `linera --testnet` for all commands
2. Get testnet tokens: `linera faucet --testnet`
3. Deploy to testnet (more permanent)
4. Use testnet node URL in Cloudflare

### Document Everything

Create `SUBMISSION.md`:
```markdown
# QuickBet Submission

## Contract Details
- Chain ID: [your-chain-id]
- Application ID: [your-app-id]
- Network: Testnet
- GraphQL Endpoint: [your-node-url]

## Live Demo
- Frontend: https://quickbet-prediction-market.pages.dev
- Contract Explorer: [linera explorer link]

## Video Demo
[Link to demo video]

## Test Instructions
1. Visit frontend URL
2. Connect MetaMask
3. Create a market
4. Place bets
5. Resolve and claim winnings
```

---

## Troubleshooting

### Contract Build Fails
```bash
# Clean and rebuild
cargo clean
rustup update
cargo build --release --target wasm32-unknown-unknown
```

### Service Won't Start
```bash
# Check if port 8080 is in use
lsof -i :8080
kill -9 <PID>

# Restart service
linera service --port 8080
```

### GraphQL Errors
- Verify Chain ID and App ID are correct
- Check service is running: `curl http://localhost:8080`
- Check contract is deployed: `linera wallet show`

---

## Quick Command Reference

```bash
# Build contract
cargo build --release --target wasm32-unknown-unknown

# Deploy
linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm

# Start service
linera service --port 8080

# Show wallet
linera wallet show

# Query markets
curl -X POST http://localhost:8080/chains/<CHAIN>/applications/<APP> \
  -H "Content-Type: application/json" \
  -d '{"query": "{ markets { id question } }"}'
```

---

## Next: Deploy to Cloudflare

Once you have:
- ✅ Contract deployed
- ✅ Service running
- ✅ Real CHAIN_ID and APP_ID

Go back to Cloudflare and enter the **real values** in the environment variables!

---

**Start with Step 1 above to deploy your contract now!** 🚀
