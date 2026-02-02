#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{base::WithServiceAbi, Service, ServiceRuntime};
use prediction_market::{BetInfo, MarketInfo, PredictionMarketAbi};
use state::PredictionMarket;
use std::sync::Arc;

pub struct PredictionMarketService {
    state: Arc<PredictionMarket>,
}

linera_sdk::service!(PredictionMarketService);

impl WithServiceAbi for PredictionMarketService {
    type Abi = PredictionMarketAbi;
}

impl Service for PredictionMarketService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = PredictionMarket::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            MutationRoot,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<PredictionMarket>,
}

#[Object]
impl QueryRoot {
    /// Get all markets
    async fn markets(&self) -> Vec<MarketInfo> {
        let mut result = Vec::new();
        let next_id = self.state.next_market_id.get().to_owned();

        for id in 1..next_id {
            if let Ok(Some(market)) = self.state.markets.get(&id).await {
                let total = market.yes_pool + market.no_pool;
                let (yes_pct, no_pct) = if total > 0 {
                    (
                        (market.yes_pool as f64 / total as f64) * 100.0,
                        (market.no_pool as f64 / total as f64) * 100.0,
                    )
                } else {
                    (50.0, 50.0)
                };

                result.push(MarketInfo {
                    id: market.id,
                    question: market.question,
                    creator: market.creator,
                    yes_pool: market.yes_pool,
                    no_pool: market.no_pool,
                    end_time: market.end_time,
                    resolved: market.resolved,
                    outcome: market.outcome,
                    yes_percentage: yes_pct,
                    no_percentage: no_pct,
                });
            }
        }

        result
    }

    /// Get a single market by ID
    async fn market(&self, id: u64) -> Option<MarketInfo> {
        if let Ok(Some(market)) = self.state.markets.get(&id).await {
            let total = market.yes_pool + market.no_pool;
            let (yes_pct, no_pct) = if total > 0 {
                (
                    (market.yes_pool as f64 / total as f64) * 100.0,
                    (market.no_pool as f64 / total as f64) * 100.0,
                )
            } else {
                (50.0, 50.0)
            };

            Some(MarketInfo {
                id: market.id,
                question: market.question,
                creator: market.creator,
                yes_pool: market.yes_pool,
                no_pool: market.no_pool,
                end_time: market.end_time,
                resolved: market.resolved,
                outcome: market.outcome,
                yes_percentage: yes_pct,
                no_percentage: no_pct,
            })
        } else {
            None
        }
    }

    /// Get a user's bet on a specific market
    async fn user_bet(&self, market_id: u64, user: String) -> Option<BetInfo> {
        let bet_key = format!("{}:{}", market_id, user);
        if let Ok(Some(bet)) = self.state.bets.get(&bet_key).await {
            Some(BetInfo {
                amount: bet.amount,
                is_yes: bet.is_yes,
                claimed: bet.claimed,
            })
        } else {
            None
        }
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    /// Placeholder for mutations - actual operations go through the contract
    async fn _placeholder(&self) -> bool {
        true
    }
}
