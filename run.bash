#!/bin/bash
set -e

echo "=========================================="
echo "  QuickBet - Prediction Market on Linera"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to build the contract
build_contract() {
    echo -e "${BLUE}Building Rust contract...${NC}"
    cargo build --release --target wasm32-unknown-unknown
    echo -e "${GREEN}Contract built successfully!${NC}"
}

# Function to build the frontend
build_frontend() {
    echo -e "${BLUE}Building frontend...${NC}"
    cd frontend
    npm install
    npm run build
    cd ..
    echo -e "${GREEN}Frontend built successfully!${NC}"
}

# Function to start the frontend dev server
start_frontend_dev() {
    echo -e "${BLUE}Starting frontend dev server...${NC}"
    cd frontend
    npm install
    npm run dev &
    cd ..
    echo -e "${GREEN}Frontend dev server started on http://localhost:5173${NC}"
}

# Function to serve the built frontend
serve_frontend() {
    echo -e "${BLUE}Serving frontend...${NC}"
    serve -s frontend/dist -l 5173 &
    echo -e "${GREEN}Frontend served on http://localhost:5173${NC}"
}

# Parse command line arguments
case "${1:-serve}" in
    build)
        build_contract
        build_frontend
        ;;
    build-contract)
        build_contract
        ;;
    build-frontend)
        build_frontend
        ;;
    dev)
        start_frontend_dev
        wait
        ;;
    serve)
        serve_frontend
        wait
        ;;
    all)
        build_contract
        build_frontend
        serve_frontend
        wait
        ;;
    *)
        echo "Usage: $0 {build|build-contract|build-frontend|dev|serve|all}"
        echo ""
        echo "Commands:"
        echo "  build           - Build both contract and frontend"
        echo "  build-contract  - Build only the Rust contract"
        echo "  build-frontend  - Build only the frontend"
        echo "  dev             - Start frontend in development mode"
        echo "  serve           - Serve the built frontend (default)"
        echo "  all             - Build and serve everything"
        exit 1
        ;;
esac

echo -e "${GREEN}Done!${NC}"
