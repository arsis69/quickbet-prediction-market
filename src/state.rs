use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};
use serde::{Deserialize, Serialize};

/// Represents a prediction market
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Market {
    pub id: u64,
    pub question: String,
    pub creator: String,
    pub yes_pool: u128,
    pub no_pool: u128,
    pub end_time: u64,
    pub resolved: bool,
    pub outcome: Option<bool>,
}

/// Represents a user's bet on a market
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct Bet {
    pub amount: u128,
    pub is_yes: bool,
    pub claimed: bool,
}

/// Main application state for the prediction market
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = "ViewStorageContext")]
pub struct PredictionMarket {
    /// Counter for generating unique market IDs
    pub next_market_id: RegisterView<u64>,
    /// All markets indexed by their ID
    pub markets: MapView<u64, Market>,
    /// All bets indexed by "market_id:user_chain_id"
    pub bets: MapView<String, Bet>,
}
