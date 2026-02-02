# QuickBet - Prediction Markets on Linera

A decentralized prediction market platform built on Linera blockchain. Create markets, place bets, and earn rewards.

[![Built with Rust](https://img.shields.io/badge/built%20with-Rust-orange)](https://www.rust-lang.org/)
[![Powered by Linera](https://img.shields.io/badge/powered%20by-Linera-blue)](https://linera.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### Core Functionality
- **Create Markets** - Define yes/no prediction questions with end dates
- **Place Bets** - Bet on YES or NO outcomes with proportional payouts
- **Resolve Markets** - Market creators can resolve with final outcome
- **Claim Winnings** - Winners receive proportional share of total pool
- **Real-time Updates** - Live percentage bars and pool updates

### User Experience
- **Wallet Integration** - MetaMask support with Linera snap
- **User Profile** - Personal stats, bet history, and winnings
- **Leaderboard** - Top earners, most active, best win rates
- **Transaction History** - Complete audit trail of all actions
- **Market Filters** - Filter by active/resolved, search by question
- **Toast Notifications** - Success/error messages for all actions

### Market Resolution
- **Creator Control** - Only market creator can resolve
- **Confirmation Modal** - Prevent accidental resolutions
- **Permanent Resolution** - Cannot be changed once set

## 🚀 Quick Start

### Prerequisites
```bash
# Rust & WASM
rustup target add wasm32-unknown-unknown

# Linera CLI
cargo install linera-client

# Node.js 20+
node --version
```

### Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd prediction-market

# Build contract
cargo build --release --target wasm32-unknown-unknown

# Install frontend dependencies
cd frontend
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173`

### Docker (Recommended)

```bash
docker compose up --build
```

Visit `http://localhost:5173`

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](API.md) - GraphQL API reference
- [Features Guide](FEATURES.md) - Detailed feature documentation

## 🏗 Architecture

### Backend (Rust + Linera SDK)
```
src/
├── lib.rs          # ABI definitions
├── state.rs        # State structures
├── contract.rs     # Contract logic
└── service.rs      # GraphQL service
```

**Operations:**
- `CreateMarket { question, end_time }`
- `PlaceBet { market_id, is_yes, amount }`
- `ResolveMarket { market_id, outcome }`
- `ClaimWinnings { market_id }`

### Frontend (React + Vite + Tailwind)
```
frontend/src/
├── components/     # UI components
│   ├── MarketCard.tsx
│   ├── PlaceBet.tsx
│   ├── ResolveMarket.tsx
│   ├── Leaderboard.tsx
│   ├── TransactionHistory.tsx
│   └── UserProfile.tsx
├── hooks/          # React hooks
│   ├── useLinera.ts
│   ├── useWallet.ts
│   └── useToast.ts
└── types/          # TypeScript types
```

## 💰 Payout Formula

Winners receive proportional payouts:

```
winnings = (user_bet / winning_pool) × total_pool
```

**Example:**
- Total YES pool: 100 tokens
- Total NO pool: 50 tokens
- Total pool: 150 tokens
- Your YES bet: 10 tokens
- **If YES wins:** You get (10/100) × 150 = **15 tokens** (50% profit)

## 🎨 UI Features

### Design System
- Dark gradient background (purple → blue → black)
- Glassmorphism cards with backdrop blur
- Green for YES, Red for NO
- Gradient buttons with hover effects
- Responsive layout (mobile-first)

### Components
- **MarketCard** - Beautiful market display with percentage bars
- **PlaceBet Modal** - Easy YES/NO betting interface
- **CreateMarket Form** - Simple market creation
- **UserProfile** - Comprehensive user statistics
- **Leaderboard** - Competitive rankings
- **TransactionHistory** - Complete transaction log
- **Toast Notifications** - Elegant notifications

## 🔐 Security

- No real token transfers (demo mode)
- Wallet signature verification
- Creator-only market resolution
- One bet per user per market
- Cannot claim winnings twice

## 🛠 Development

### Build Contract
```bash
cargo build --release --target wasm32-unknown-unknown
```

### Test Contract
```bash
cargo test
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Lint & Format
```bash
# Rust
cargo fmt
cargo clippy

# TypeScript
npm run lint
```

## 📦 Project Structure

```
prediction-market/
├── Cargo.toml              # Rust dependencies
├── src/                    # Smart contract
├── frontend/               # React frontend
├── Dockerfile              # Container build
├── compose.yaml            # Docker Compose
├── run.bash                # Build script
├── README.md               # This file
├── DEPLOYMENT.md           # Deployment guide
├── API.md                  # API documentation
└── FEATURES.md             # Feature documentation
```

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core prediction market functionality
- [x] Wallet integration
- [x] User profiles and stats
- [x] Leaderboard
- [x] Transaction history
- [x] Market filters and search

### Phase 2 (Future)
- [ ] Oracle integration for automated resolution
- [ ] Multi-category markets
- [ ] Market categories and tags
- [ ] Social features (comments, shares)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Cross-chain betting
- [ ] Liquidity pools
- [ ] Market maker incentives
- [ ] NFT rewards
- [ ] Governance token

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 👥 Team

Built for the Linera Buildathon

## 🙏 Acknowledgments

- Linera Protocol team for excellent documentation
- MetaMask for wallet integration
- The Web3 community for inspiration

## 📞 Support

- **Documentation**: Read the [docs](https://linera.dev)
- **Issues**: [GitHub Issues](https://github.com/[your-repo]/issues)
- **Discord**: [Linera Discord](https://discord.gg/linera)
- **Twitter**: [@lineraprotocol](https://twitter.com/lineraprotocol)

## 🌟 Star History

If you find QuickBet useful, please star the repository!

---

**Built with ❤️ on Linera**
