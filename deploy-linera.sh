#!/bin/bash
set -e

echo "========================================"
echo "  QuickBet - Automated Linera Deployment"
echo "========================================"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists rustc; then
    echo -e "${YELLOW}Rust not found. Installing...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

if ! command_exists cargo; then
    echo -e "${RED}Cargo not found after Rust install. Please restart terminal.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Rust installed: $(rustc --version)${NC}"

# Step 2: Add WASM target
echo -e "${BLUE}Adding WASM target...${NC}"
rustup target add wasm32-unknown-unknown
echo -e "${GREEN}✓ WASM target added${NC}"

# Step 3: Install Linera CLI
echo -e "${BLUE}Installing Linera CLI...${NC}"
if ! command_exists linera; then
    cargo install linera-client --locked
fi
echo -e "${GREEN}✓ Linera CLI installed: $(linera --version)${NC}"

# Step 4: Build the contract
echo -e "${BLUE}Building contract...${NC}"
cargo build --release --target wasm32-unknown-unknown

# Verify WASM files exist
if [ ! -f "target/wasm32-unknown-unknown/release/prediction_market_contract.wasm" ]; then
    echo -e "${RED}Contract WASM not found!${NC}"
    exit 1
fi

if [ ! -f "target/wasm32-unknown-unknown/release/prediction_market_service.wasm" ]; then
    echo -e "${RED}Service WASM not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contract built successfully${NC}"
ls -lh target/wasm32-unknown-unknown/release/*.wasm

# Step 5: Initialize Linera wallet (if not exists)
echo -e "${BLUE}Setting up Linera wallet...${NC}"
if [ ! -d "$HOME/.config/linera" ]; then
    linera wallet init
    echo -e "${GREEN}✓ Wallet initialized${NC}"
else
    echo -e "${GREEN}✓ Wallet already exists${NC}"
fi

# Step 6: Start local network
echo -e "${BLUE}Starting local Linera network...${NC}"
linera net up &
sleep 5
echo -e "${GREEN}✓ Network started${NC}"

# Step 7: Deploy contract
echo -e "${BLUE}Deploying contract to Linera...${NC}"
DEPLOY_OUTPUT=$(linera publish-and-create \
    target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
    target/wasm32-unknown-unknown/release/prediction_market_service.wasm \
    --json-parameters '{}' \
    --json-argument '{}' 2>&1)

echo "$DEPLOY_OUTPUT"

# Extract Application ID
APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{48}' | head -1)

if [ -z "$APP_ID" ]; then
    echo -e "${RED}Failed to extract Application ID${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✓ Contract deployed successfully${NC}"
echo -e "${GREEN}Application ID: ${APP_ID}${NC}"

# Step 8: Get Chain ID
echo -e "${BLUE}Getting Chain ID...${NC}"
WALLET_OUTPUT=$(linera wallet show)
CHAIN_ID=$(echo "$WALLET_OUTPUT" | grep -oE '[a-f0-9]{64}[0-9]{48}' | head -1)

echo -e "${GREEN}✓ Chain ID: ${CHAIN_ID}${NC}"

# Step 9: Start GraphQL service
echo -e "${BLUE}Starting GraphQL service...${NC}"
linera service --port 8080 > linera-service.log 2>&1 &
SERVICE_PID=$!
sleep 3

if ps -p $SERVICE_PID > /dev/null; then
    echo -e "${GREEN}✓ GraphQL service started (PID: $SERVICE_PID)${NC}"
else
    echo -e "${RED}Failed to start GraphQL service${NC}"
    cat linera-service.log
    exit 1
fi

# Step 10: Test GraphQL endpoint
echo -e "${BLUE}Testing GraphQL endpoint...${NC}"
GRAPHQL_URL="http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}"

sleep 2
TEST_RESPONSE=$(curl -s -X POST $GRAPHQL_URL \
    -H "Content-Type: application/json" \
    -d '{"query": "{ markets { id question } }"}')

if echo "$TEST_RESPONSE" | grep -q "markets"; then
    echo -e "${GREEN}✓ GraphQL endpoint working${NC}"
    echo "Response: $TEST_RESPONSE"
else
    echo -e "${YELLOW}Warning: GraphQL test returned unexpected response${NC}"
    echo "$TEST_RESPONSE"
fi

# Step 11: Create test market
echo -e "${BLUE}Creating test market...${NC}"
linera mutate \
    --application $APP_ID \
    --operation 'CreateMarket { question: "Will Bitcoin reach $100k by 2025?", end_time: 1735689600000 }'

# Query markets again
sleep 1
TEST_RESPONSE=$(curl -s -X POST $GRAPHQL_URL \
    -H "Content-Type: application/json" \
    -d '{"query": "{ markets { id question yesPool noPool } }"}')

echo -e "${GREEN}✓ Test market created${NC}"
echo "Markets: $TEST_RESPONSE"

# Step 12: Save configuration
echo -e "${BLUE}Saving configuration...${NC}"

cat > frontend/.env.local <<EOF
# Linera Contract Configuration
# Generated: $(date)

VITE_LINERA_NODE_URL=http://localhost:8080
VITE_CHAIN_ID=${CHAIN_ID}
VITE_APP_ID=${APP_ID}
EOF

cat > DEPLOYMENT_INFO.md <<EOF
# Deployment Information

**Deployment Date:** $(date)

## Contract Details

- **Chain ID:** \`${CHAIN_ID}\`
- **Application ID:** \`${APP_ID}\`
- **Network:** Local
- **GraphQL Endpoint:** \`http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}\`

## Service Information

- **Service PID:** ${SERVICE_PID}
- **Log File:** linera-service.log
- **Port:** 8080

## Test Commands

\`\`\`bash
# Query markets
curl -X POST http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID} \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ markets { id question yesPool noPool } }"}'

# Create market
linera mutate \\
  --application ${APP_ID} \\
  --operation 'CreateMarket { question: "Test question?", end_time: 1735689600000 }'
\`\`\`

## Frontend Configuration

Configuration saved to \`frontend/.env.local\`

Start frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## Stop Service

\`\`\`bash
kill ${SERVICE_PID}
\`\`\`

EOF

echo -e "${GREEN}✓ Configuration saved to frontend/.env.local${NC}"
echo -e "${GREEN}✓ Deployment info saved to DEPLOYMENT_INFO.md${NC}"

# Summary
echo ""
echo -e "${GREEN}========================================"
echo "  Deployment Complete! ✓"
echo "========================================${NC}"
echo ""
echo -e "${BLUE}Chain ID:${NC} ${CHAIN_ID}"
echo -e "${BLUE}App ID:${NC} ${APP_ID}"
echo -e "${BLUE}GraphQL URL:${NC} http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}"
echo -e "${BLUE}Service PID:${NC} ${SERVICE_PID}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Test frontend locally: cd frontend && npm run dev"
echo "2. Set up ngrok: ngrok http 8080"
echo "3. Deploy to Cloudflare with real values"
echo "4. Check DEPLOYMENT_INFO.md for details"
echo ""
echo -e "${GREEN}Service is running. Press Ctrl+C to stop.${NC}"
echo "Logs: tail -f linera-service.log"
echo ""

# Keep script running
wait $SERVICE_PID
