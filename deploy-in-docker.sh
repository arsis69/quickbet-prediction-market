#!/bin/bash
set -e

echo "Initializing Linera in Docker..."

# Initialize wallet
linera wallet init

# Start local network
linera net up &
sleep 5

# Deploy contract
APP_ID=$(linera publish-and-create \
    /app/contract/prediction_market_contract.wasm \
    /app/contract/prediction_market_service.wasm \
    --json-parameters '{}' \
    --json-argument '{}' | grep -oE '[a-f0-9]{64}[0-9]{48}' | head -1)

# Get chain ID
CHAIN_ID=$(linera wallet show | grep -oE '[a-f0-9]{64}[0-9]{48}' | head -1)

echo "Chain ID: $CHAIN_ID"
echo "App ID: $APP_ID"

# Start service
exec linera service --port 8080
