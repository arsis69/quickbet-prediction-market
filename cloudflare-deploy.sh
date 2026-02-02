#!/bin/bash
set -e

echo "=========================================="
echo "  QuickBet - Cloudflare Deployment"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check if logged in to Cloudflare
echo -e "${BLUE}Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Cloudflare. Please login:${NC}"
    wrangler login
fi

# Build the frontend
echo -e "${BLUE}Building frontend...${NC}"
cd frontend
npm install
npm run build

# Deploy to Cloudflare Pages
echo -e "${BLUE}Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy dist --project-name=quickbet-prediction-market

echo -e "${GREEN}=========================================="
echo -e "Deployment Complete!"
echo -e "==========================================${NC}"
echo ""
echo -e "${GREEN}Your app is now live at:${NC}"
echo -e "${BLUE}https://quickbet-prediction-market.pages.dev${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure environment variables in Cloudflare dashboard"
echo "2. Set up custom domain (optional)"
echo "3. Update LINERA_NODE_URL in environment variables"
echo ""
