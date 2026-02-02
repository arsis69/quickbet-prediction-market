use async_graphql::{InputObject, Request, Response, SimpleObject};
use linera_sdk::base::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub mod state;

/// The Application Binary Interface (ABI) for the prediction market contract
pub struct PredictionMarketAbi;

impl ContractAbi for PredictionMarketAbi {
    type Operation = Operation;
    type Response = OperationResponse;
}

impl ServiceAbi for PredictionMarketAbi {
    type Query = Request;
    type QueryResponse = Response;
}

/// Operations that can be executed on the prediction market contract
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Operation {
    /// Create a new prediction market
    CreateMarket { question: String, end_time: u64 },
    /// Place a bet on a market (YES or NO)
    PlaceBet {
        market_id: u64,
        is_yes: bool,
        amount: u128,
    },
    /// Resolve a market (only creator can do this)
    ResolveMarket { market_id: u64, outcome: bool },
    /// Claim winnings from a resolved market
    ClaimWinnings { market_id: u64 },
}

/// Response from contract operations
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum OperationResponse {
    /// Market created successfully, returns market ID
    MarketCreated(u64),
    /// Bet placed successfully
    BetPlaced,
    /// Market resolved successfully
    MarketResolved,
    /// Winnings claimed successfully, returns amount
    WinningsClaimed(u128),
    /// Operation failed with error message
    Error(String),
}

/// Market data for GraphQL queries
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct MarketInfo {
    pub id: u64,
    pub question: String,
    pub creator: String,
    pub yes_pool: u128,
    pub no_pool: u128,
    pub end_time: u64,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub yes_percentage: f64,
    pub no_percentage: f64,
}

/// Bet data for GraphQL queries
#[derive(Clone, Debug, Serialize, Deserialize, SimpleObject)]
pub struct BetInfo {
    pub amount: u128,
    pub is_yes: bool,
    pub claimed: bool,
}

/// Input for placing a bet via GraphQL
#[derive(Clone, Debug, Serialize, Deserialize, InputObject)]
pub struct PlaceBetInput {
    pub market_id: u64,
    pub is_yes: bool,
    pub amount: u64,
}

/// Input for creating a market via GraphQL
#[derive(Clone, Debug, Serialize, Deserialize, InputObject)]
pub struct CreateMarketInput {
    pub question: String,
    pub end_time: u64,
}
