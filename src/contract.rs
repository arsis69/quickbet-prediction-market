#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{base::WithContractAbi, Contract, ContractRuntime};
use prediction_market::{Operation, OperationResponse, PredictionMarketAbi};
use state::{Bet, Market, PredictionMarket};

pub struct PredictionMarketContract {
    state: PredictionMarket,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(PredictionMarketContract);

impl WithContractAbi for PredictionMarketContract {
    type Abi = PredictionMarketAbi;
}

impl Contract for PredictionMarketContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = PredictionMarket::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.state.next_market_id.set(1);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateMarket { question, end_time } => {
                self.create_market(question, end_time).await
            }
            Operation::PlaceBet {
                market_id,
                is_yes,
                amount,
            } => self.place_bet(market_id, is_yes, amount).await,
            Operation::ResolveMarket { market_id, outcome } => {
                self.resolve_market(market_id, outcome).await
            }
            Operation::ClaimWinnings { market_id } => self.claim_winnings(market_id).await,
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {
        // No cross-chain messages in this simple implementation
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl PredictionMarketContract {
    /// Create a new prediction market
    async fn create_market(&mut self, question: String, end_time: u64) -> OperationResponse {
        let market_id = self.state.next_market_id.get().to_owned();
        let creator = self.runtime.authenticated_signer().unwrap().to_string();

        let market = Market {
            id: market_id,
            question,
            creator,
            yes_pool: 0,
            no_pool: 0,
            end_time,
            resolved: false,
            outcome: None,
        };

        self.state
            .markets
            .insert(&market_id, market)
            .expect("Failed to insert market");
        self.state.next_market_id.set(market_id + 1);

        OperationResponse::MarketCreated(market_id)
    }

    /// Place a bet on a market
    async fn place_bet(&mut self, market_id: u64, is_yes: bool, amount: u128) -> OperationResponse {
        // Get the market
        let market = match self.state.markets.get(&market_id).await {
            Ok(Some(m)) => m,
            Ok(None) => return OperationResponse::Error("Market not found".to_string()),
            Err(_) => return OperationResponse::Error("Failed to read market".to_string()),
        };

        // Check if market is still open
        if market.resolved {
            return OperationResponse::Error("Market already resolved".to_string());
        }

        // Get user identifier
        let user = self.runtime.authenticated_signer().unwrap().to_string();
        let bet_key = format!("{}:{}", market_id, user);

        // Check if user already has a bet
        if let Ok(Some(_)) = self.state.bets.get(&bet_key).await {
            return OperationResponse::Error("Already placed a bet on this market".to_string());
        }

        // Update the market pools
        let mut updated_market = market.clone();
        if is_yes {
            updated_market.yes_pool += amount;
        } else {
            updated_market.no_pool += amount;
        }

        // Store the bet
        let bet = Bet {
            amount,
            is_yes,
            claimed: false,
        };

        self.state
            .markets
            .insert(&market_id, updated_market)
            .expect("Failed to update market");
        self.state
            .bets
            .insert(&bet_key, bet)
            .expect("Failed to insert bet");

        OperationResponse::BetPlaced
    }

    /// Resolve a market (only creator can do this)
    async fn resolve_market(&mut self, market_id: u64, outcome: bool) -> OperationResponse {
        // Get the market
        let market = match self.state.markets.get(&market_id).await {
            Ok(Some(m)) => m,
            Ok(None) => return OperationResponse::Error("Market not found".to_string()),
            Err(_) => return OperationResponse::Error("Failed to read market".to_string()),
        };

        // Check if already resolved
        if market.resolved {
            return OperationResponse::Error("Market already resolved".to_string());
        }

        // Check if caller is the creator
        let caller = self.runtime.authenticated_signer().unwrap().to_string();
        if caller != market.creator {
            return OperationResponse::Error("Only creator can resolve market".to_string());
        }

        // Update the market
        let mut updated_market = market.clone();
        updated_market.resolved = true;
        updated_market.outcome = Some(outcome);

        self.state
            .markets
            .insert(&market_id, updated_market)
            .expect("Failed to update market");

        OperationResponse::MarketResolved
    }

    /// Claim winnings from a resolved market
    async fn claim_winnings(&mut self, market_id: u64) -> OperationResponse {
        // Get the market
        let market = match self.state.markets.get(&market_id).await {
            Ok(Some(m)) => m,
            Ok(None) => return OperationResponse::Error("Market not found".to_string()),
            Err(_) => return OperationResponse::Error("Failed to read market".to_string()),
        };

        // Check if market is resolved
        if !market.resolved {
            return OperationResponse::Error("Market not yet resolved".to_string());
        }

        let outcome = market.outcome.unwrap();

        // Get user's bet
        let user = self.runtime.authenticated_signer().unwrap().to_string();
        let bet_key = format!("{}:{}", market_id, user);

        let bet = match self.state.bets.get(&bet_key).await {
            Ok(Some(b)) => b,
            Ok(None) => return OperationResponse::Error("No bet found".to_string()),
            Err(_) => return OperationResponse::Error("Failed to read bet".to_string()),
        };

        // Check if already claimed
        if bet.claimed {
            return OperationResponse::Error("Winnings already claimed".to_string());
        }

        // Check if user won
        if bet.is_yes != outcome {
            return OperationResponse::Error("You did not win this bet".to_string());
        }

        // Calculate winnings: (bet * total_pool) / winning_pool
        let total_pool = market.yes_pool + market.no_pool;
        let winning_pool = if outcome {
            market.yes_pool
        } else {
            market.no_pool
        };

        let winnings = if winning_pool > 0 {
            (bet.amount * total_pool) / winning_pool
        } else {
            0
        };

        // Mark bet as claimed
        let mut updated_bet = bet.clone();
        updated_bet.claimed = true;
        self.state
            .bets
            .insert(&bet_key, updated_bet)
            .expect("Failed to update bet");

        OperationResponse::WinningsClaimed(winnings)
    }
}
