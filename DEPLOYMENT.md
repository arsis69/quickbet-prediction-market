# Deployment Guide - QuickBet Prediction Markets

Complete guide to deploy QuickBet on Linera blockchain.

## Prerequisites

- Rust 1.75+ with `wasm32-unknown-unknown` target
- Node.js 20+
- Docker & Docker Compose
- Linera CLI installed
- MetaMask wallet

## 1. Install Dependencies

### Rust & WASM Target
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

### Linera CLI
```bash
cargo install linera-client
```

### Node.js (if not installed)
```bash
# On macOS/Linux
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# On Windows
# Download from https://nodejs.org/
```

## 2. Build the Contract

```bash
cd prediction-market

# Build WASM binaries
cargo build --release --target wasm32-unknown-unknown

# Verify build
ls target/wasm32-unknown-unknown/release/*.wasm
```

Expected output:
- `prediction_market_contract.wasm`
- `prediction_market_service.wasm`

## 3. Deploy to Linera

### Initialize Wallet (first time only)
```bash
linera wallet init
```

### Start Local Linera Network (for testing)
```bash
linera net up
```

### Publish the Application
```bash
linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm \
  --json-parameters '{}' \
  --json-argument '{}'
```

**Save the Application ID** returned - you'll need it for the frontend!

Example output:
```
Application published successfully!
Application ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000001000000e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65030000000000000000000000
```

## 4. Start Linera Service

```bash
# Start GraphQL service on port 8080
linera service --port 8080
```

## 5. Configure Frontend

Update `frontend/src/hooks/useLinera.ts`:

```typescript
// Change this line:
const GRAPHQL_ENDPOINT = '/api/graphql';

// To your Linera node:
const GRAPHQL_ENDPOINT = 'http://localhost:8080/chains/<YOUR_CHAIN_ID>/applications/<YOUR_APP_ID>';
```

Replace:
- `<YOUR_CHAIN_ID>` - Get from `linera wallet show`
- `<YOUR_APP_ID>` - Application ID from step 3

## 6. Build & Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm run preview
```

## 7. Docker Deployment (Production)

### Update Docker Compose

Edit `compose.yaml` to add your app details:
```yaml
environment:
  - LINERA_APP_ID=<your-app-id>
  - LINERA_CHAIN_ID=<your-chain-id>
  - LINERA_NODE_URL=http://localhost:8080
```

### Build and Run
```bash
docker compose up --build
```

Access at: `http://localhost:5173`

## 8. Deploy to Linera Testnet

### Get Testnet Tokens
```bash
# Request testnet tokens from Linera faucet
linera faucet --testnet
```

### Publish to Testnet
```bash
linera --testnet publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm
```

### Update Frontend Config
Point frontend to testnet GraphQL endpoint in production.

## Verification Checklist

- [ ] Contract compiles without errors
- [ ] Application deployed successfully
- [ ] GraphQL service running on port 8080
- [ ] Can query `markets` via GraphQL
- [ ] Frontend connects to backend
- [ ] Can create a market via UI
- [ ] Can place bets on markets
- [ ] Can resolve markets (as creator)
- [ ] Can claim winnings
- [ ] MetaMask wallet connects
- [ ] Docker build completes
- [ ] Docker container runs successfully

## Troubleshooting

### Contract Build Fails
```bash
# Clean and rebuild
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Frontend Can't Connect
- Check Linera service is running: `curl http://localhost:8080`
- Verify CORS settings in Linera config
- Check Application ID is correct

### MetaMask Connection Issues
- Ensure MetaMask is installed
- Switch to correct network
- Clear browser cache

### Docker Issues
```bash
# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Production Considerations

### Security
- Enable HTTPS/TLS
- Configure proper CORS policies
- Rate limit API endpoints
- Implement authentication for admin functions

### Performance
- Use CDN for frontend assets
- Enable GraphQL query caching
- Add database indexes for market queries
- Monitor contract gas usage

### Monitoring
- Set up logging for contract operations
- Monitor transaction success rates
- Track user activity metrics
- Alert on failed operations

## Support

For issues:
- Check Linera docs: https://linera.dev
- Join Linera Discord: https://discord.gg/linera
- Submit issues: https://github.com/[your-repo]/issues
