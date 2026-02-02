# API Documentation - QuickBet Prediction Markets

Complete GraphQL API reference for QuickBet.

## GraphQL Endpoint

```
http://localhost:8080/chains/<CHAIN_ID>/applications/<APP_ID>
```

## Schema

### Types

#### Market
```graphql
type MarketInfo {
  id: Int!
  question: String!
  creator: String!
  yesPool: Int!
  noPool: Int!
  endTime: Int!
  resolved: Boolean!
  outcome: Boolean
  yesPercentage: Float!
  noPercentage: Float!
}
```

#### Bet
```graphql
type BetInfo {
  amount: Int!
  isYes: Boolean!
  claimed: Boolean!
}
```

## Queries

### Get All Markets
```graphql
query GetMarkets {
  markets {
    id
    question
    creator
    yesPool
    noPool
    endTime
    resolved
    outcome
    yesPercentage
    noPercentage
  }
}
```

**Response:**
```json
{
  "data": {
    "markets": [
      {
        "id": 1,
        "question": "Will Bitcoin reach $100k by end of 2025?",
        "creator": "0x1234...5678",
        "yesPool": 15000,
        "noPool": 8500,
        "endTime": 1735689600000,
        "resolved": false,
        "outcome": null,
        "yesPercentage": 63.8,
        "noPercentage": 36.2
      }
    ]
  }
}
```

### Get Single Market
```graphql
query GetMarket($id: Int!) {
  market(id: $id) {
    id
    question
    creator
    yesPool
    noPool
    endTime
    resolved
    outcome
    yesPercentage
    noPercentage
  }
}
```

**Variables:**
```json
{
  "id": 1
}
```

### Get User's Bet
```graphql
query GetUserBet($marketId: Int!, $user: String!) {
  userBet(marketId: $marketId, user: $user) {
    amount
    isYes
    claimed
  }
}
```

**Variables:**
```json
{
  "marketId": 1,
  "user": "user_chain_id"
}
```

**Response:**
```json
{
  "data": {
    "userBet": {
      "amount": 500,
      "isYes": true,
      "claimed": false
    }
  }
}
```

## Operations (Mutations)

Operations are sent directly to the Linera contract, not via GraphQL mutations.

### Create Market

**Operation:**
```rust
CreateMarket {
    question: String,
    end_time: u64,
}
```

**Example (via Linera CLI):**
```bash
linera mutate \
  --application <APP_ID> \
  --operation 'CreateMarket { question: "Will Bitcoin reach $100k?", end_time: 1735689600000 }'
```

**Response:**
```rust
MarketCreated(1) // Returns market ID
```

### Place Bet

**Operation:**
```rust
PlaceBet {
    market_id: u64,
    is_yes: bool,
    amount: u128,
}
```

**Example:**
```bash
linera mutate \
  --application <APP_ID> \
  --operation 'PlaceBet { market_id: 1, is_yes: true, amount: 500 }'
```

**Response:**
```rust
BetPlaced
```

**Errors:**
- `"Market not found"` - Invalid market ID
- `"Market already resolved"` - Can't bet on resolved market
- `"Already placed a bet on this market"` - User already has a bet

### Resolve Market

**Operation:**
```rust
ResolveMarket {
    market_id: u64,
    outcome: bool, // true = YES, false = NO
}
```

**Example:**
```bash
linera mutate \
  --application <APP_ID> \
  --operation 'ResolveMarket { market_id: 1, outcome: true }'
```

**Response:**
```rust
MarketResolved
```

**Errors:**
- `"Market not found"` - Invalid market ID
- `"Market already resolved"` - Already resolved
- `"Only creator can resolve market"` - Not authorized

### Claim Winnings

**Operation:**
```rust
ClaimWinnings {
    market_id: u64,
}
```

**Example:**
```bash
linera mutate \
  --application <APP_ID> \
  --operation 'ClaimWinnings { market_id: 1 }'
```

**Response:**
```rust
WinningsClaimed(1200) // Returns amount won
```

**Errors:**
- `"Market not found"` - Invalid market ID
- `"Market not yet resolved"` - Market still active
- `"No bet found"` - User didn't bet on this market
- `"Winnings already claimed"` - Already claimed
- `"You did not win this bet"` - Bet on losing side

## Payout Calculation

Winnings are calculated proportionally:

```
winnings = (user_bet / winning_pool) × total_pool
```

**Example:**
- YES pool: 10,000 tokens
- NO pool: 5,000 tokens
- Total pool: 15,000 tokens
- Your YES bet: 1,000 tokens
- Outcome: YES wins

```
winnings = (1,000 / 10,000) × 15,000 = 1,500 tokens
```

Your profit: 500 tokens (50% return)

## Rate Limits

No rate limits currently (testnet).

Production recommendations:
- 100 queries/minute per IP
- 20 mutations/minute per chain
- 1000 queries/hour per application

## Error Handling

All errors return in this format:

```json
{
  "errors": [
    {
      "message": "Market not found",
      "path": ["market"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## Testing with cURL

### Query Markets
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ markets { id question yesPool noPool } }"
  }'
```

### Query Single Market
```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: Int!) { market(id: $id) { id question } }",
    "variables": { "id": 1 }
  }'
```

## Client Integration

### JavaScript/TypeScript

```typescript
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:8080/graphql');

// Fetch markets
const markets = await client.request(`
  query {
    markets {
      id
      question
      yesPool
      noPool
    }
  }
`);

// Fetch specific market
const market = await client.request(`
  query GetMarket($id: Int!) {
    market(id: $id) {
      id
      question
    }
  }
`, { id: 1 });
```

### Python

```python
import requests

url = "http://localhost:8080/graphql"

query = """
{
  markets {
    id
    question
    yesPool
    noPool
  }
}
"""

response = requests.post(url, json={'query': query})
data = response.json()
```

## WebSocket Subscriptions

Not currently implemented.

Future feature: Real-time market updates via GraphQL subscriptions.

## Pagination

Not currently implemented.

Future feature: Cursor-based pagination for market lists.
