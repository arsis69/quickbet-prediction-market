# Features Documentation - QuickBet

Complete guide to all QuickBet features.

## Table of Contents

1. [Market Creation](#market-creation)
2. [Betting System](#betting-system)
3. [Market Resolution](#market-resolution)
4. [Wallet Integration](#wallet-integration)
5. [User Profile](#user-profile)
6. [Leaderboard](#leaderboard)
7. [Transaction History](#transaction-history)
8. [Market Filters](#market-filters)
9. [Notifications](#notifications)

---

## Market Creation

### How to Create a Market

1. **Connect Wallet** - Must be connected to create markets
2. **Click "Create Market"** button in header
3. **Enter Question** - Write your yes/no prediction question
4. **Set End Date** - Choose when the market closes
5. **Submit** - Market is created on-chain

### Market Details

Each market includes:
- **Unique ID** - Sequential number starting from 1
- **Question** - The prediction statement
- **Creator Address** - Who created it (shortened)
- **YES Pool** - Total tokens bet on YES
- **NO Pool** - Total tokens bet on NO
- **End Time** - When market closes
- **Status** - Active or Resolved
- **Outcome** - Final result (after resolution)

### Best Practices

✅ **Good Questions:**
- "Will Bitcoin reach $100k by December 31, 2025?"
- "Will Ethereum merge to PoS in Q1 2025?"
- "Will there be a new iPhone released in September 2025?"

❌ **Bad Questions:**
- "Is Bitcoin good?" (Subjective)
- "What will Bitcoin price be?" (Not yes/no)
- "Will I win the lottery?" (Not verifiable)

---

## Betting System

### How to Place a Bet

1. **Find a Market** - Browse active markets
2. **Click "Place Bet"** - Opens betting modal
3. **Choose YES or NO** - Select your prediction
4. **Enter Amount** - Type your bet amount
5. **Confirm** - Transaction signed via wallet

### Betting Rules

- **One bet per market** - Can't bet twice on same market
- **Active markets only** - Can't bet on resolved markets
- **Minimum 1 token** - No maximum limit
- **Cannot change bet** - Final once placed

### Potential Winnings

The betting modal shows potential winnings:

```
potential_winnings = (your_bet / (your_pool + your_bet)) × (total_pool + your_bet)
```

**Example:**
- Current YES pool: 1,000
- Current NO pool: 500
- Your YES bet: 100

```
new_yes_pool = 1,100
new_total = 1,600
potential_winnings = (100 / 1,100) × 1,600 = 145.45 tokens
```

Potential profit: 45.45 tokens (45.45%)

### Pool Dynamics

Pools update in real-time:
- **Early bets** - Higher potential returns
- **Late bets** - Lower risk, lower returns
- **Balanced pools** - Better odds for both sides

---

## Market Resolution

### Who Can Resolve

Only the **market creator** can resolve their markets.

### How to Resolve

1. **Open Market** - Creator sees "Resolve Market" button
2. **Click Resolve** - Opens resolution modal
3. **Review Stats** - See total pools before deciding
4. **Choose Outcome** - YES or NO
5. **Confirm** - ⚠️ **Permanent action**

### Resolution Modal

Displays:
- Market question
- YES pool amount
- NO pool amount
- Total pool amount
- Confirmation warning

### After Resolution

- Market status changes to "Resolved"
- Winning outcome displayed
- Winners can claim their rewards
- No more bets accepted

---

## Wallet Integration

### Supported Wallets

- **MetaMask** - Primary integration
- **Linera Snap** - Optional extension

### Connection Flow

1. **Click "Connect Wallet"**
2. **MetaMask pops up** - Request account access
3. **Approve connection** - Grant permission
4. **Connected!** - Address displayed in header

### Features When Connected

- View your address (shortened)
- See your stats dashboard
- Create markets
- Place bets
- Resolve your markets
- Claim winnings
- View profile

### Disconnection

Click the disconnect icon next to your address.

### Security

- **Never shares private keys**
- **Transaction signing only**
- **Session persistence** - Reconnects automatically
- **Clear disconnect** - Remove all stored data

---

## User Profile

### How to Access

Click your address in the header.

### Profile Contents

#### Stats Dashboard
- **Total Bets** - Number of bets placed
- **Active Bets** - Bets on unresolved markets
- **Total Winnings** - Cumulative earnings
- **Win Rate** - Percentage of winning bets
- **Markets Created** - Number of markets you created

#### Active Bets List

Shows all your current bets:
- Market question
- Your position (YES/NO)
- Bet amount
- Market status

#### Actions

- **Copy Address** - One-click copy to clipboard
- **View Full Address** - Shows complete chain ID

---

## Leaderboard

### How to Access

Click "Leaderboard" button (visible when wallet connected).

### Leaderboard Categories

#### Top Earners
Ranked by total winnings:
- 1st place: Gold badge
- 2nd place: Silver badge
- 3rd place: Bronze badge
- Rest: Position number

#### Most Active
Ranked by number of bets placed.

#### Best Win Rate
Ranked by percentage of winning bets.

#### Top Creators
Ranked by number of markets created.

### Leaderboard Display

Each entry shows:
- **Rank** - Position with special badges for top 3
- **Address** - User identifier
- **Primary Stat** - Relevant to category
- **Secondary Stat** - Additional context

---

## Transaction History

### How to Access

Click "History" button (visible when wallet connected).

### Transaction Types

#### Bet Transaction
- Market question
- YES or NO position
- Amount bet
- Timestamp
- Status (success/pending/failed)

#### Create Transaction
- Market question
- Creation timestamp
- Market ID assigned

#### Resolve Transaction
- Market question
- Outcome chosen (YES/NO)
- Resolution timestamp

#### Claim Transaction
- Market question
- Amount claimed
- Claim timestamp

### Filters

- **All** - Show all transactions
- **Bet** - Only bets
- **Create** - Only market creations
- **Resolve** - Only resolutions
- **Claim** - Only winnings claimed

### Transaction Details

Each transaction shows:
- **Icon** - Type indicator
- **Title** - Action description
- **Market** - Which market
- **Amount** - If applicable
- **Outcome** - If applicable
- **Status** - Success/pending/failed
- **Time** - How long ago
- **TX Hash** - Click to view on explorer

---

## Market Filters

### Filter Options

#### By Status
- **All** - Show everything
- **Active** - Only open markets
- **Resolved** - Only closed markets

#### By Search
Type in search box to filter by:
- Market question text
- Case-insensitive matching
- Real-time filtering

### Filter Combination

Filters work together:
- Status filter + Search query
- Example: "Active markets containing 'Bitcoin'"

### Results Count

Shows: `X markets found`

---

## Notifications

### Toast System

Elegant notifications appear in top-right corner.

### Notification Types

#### Success (Green)
- Market created
- Bet placed
- Market resolved
- Winnings claimed

#### Error (Red)
- Transaction failed
- Market not found
- Insufficient balance
- Already placed bet

#### Warning (Yellow)
- Need to connect wallet
- Market ending soon
- Confirmation required

#### Info (Blue)
- New market available
- Pool update
- System message

### Toast Features

- **Auto-dismiss** - Disappears after 5 seconds
- **Manual dismiss** - Click X to close
- **Multiple toasts** - Stack vertically
- **Slide animation** - Smooth entrance/exit

---

## Keyboard Shortcuts

Not currently implemented.

Future feature:
- `Cmd/Ctrl + K` - Quick search
- `Cmd/Ctrl + N` - New market
- `Cmd/Ctrl + P` - Profile
- `Cmd/Ctrl + L` - Leaderboard
- `Cmd/Ctrl + H` - History

---

## Mobile Experience

Fully responsive design:

### Mobile Menu
- Hamburger menu for navigation
- Swipeable market cards
- Touch-optimized buttons
- Bottom navigation bar

### Tablet View
- Two-column market grid
- Side-by-side filters
- Optimized modals

### Desktop View
- Three-column market grid
- All features visible
- Hover states
- Keyboard navigation

---

## Accessibility

### Screen Readers
- Semantic HTML
- ARIA labels
- Alt text for icons
- Descriptive buttons

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate
- Escape to close modals

### Color Contrast
- WCAG AA compliant
- High contrast mode support
- Color-blind friendly

---

## Performance

### Optimizations
- **Code splitting** - Lazy load components
- **Memoization** - Prevent re-renders
- **Virtual scrolling** - For long lists
- **Image optimization** - WebP format
- **Caching** - LocalStorage for state

### Load Times
- Initial load: < 2s
- Market list: < 500ms
- Bet transaction: < 1s
- GraphQL queries: < 100ms

---

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

MetaMask required for wallet features.

---

## Known Limitations

1. **One bet per market** - Cannot bet multiple times
2. **No bet editing** - Final once placed
3. **Creator resolution** - No automated oracles
4. **No token transfers** - Demo mode only
5. **No refunds** - Bets are final

---

## Coming Soon

- Market comments and discussions
- Social sharing
- Email notifications
- Mobile push notifications
- Dark/light mode toggle
- Market categories
- Advanced analytics
- Betting strategies
- Portfolio tracking

---

Need help? Check the [API Documentation](API.md) or [Deployment Guide](DEPLOYMENT.md).
