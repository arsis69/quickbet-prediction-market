import { useState, useCallback } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import type { Market, Bet, CreateMarketInput, PlaceBetInput } from '../types';

// Check for environment variables (Cloudflare/production)
const LINERA_NODE_URL = import.meta.env.VITE_LINERA_NODE_URL;
const APP_ID = import.meta.env.VITE_APP_ID;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

// Build GraphQL endpoint
const GRAPHQL_ENDPOINT = LINERA_NODE_URL && APP_ID && CHAIN_ID
  ? `${LINERA_NODE_URL}/chains/${CHAIN_ID}/applications/${APP_ID}`
  : '/api/graphql'; // Fallback to local proxy

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

// GraphQL Queries
const MARKETS_QUERY = gql`
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
`;

const MARKET_QUERY = gql`
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
`;

const USER_BET_QUERY = gql`
  query GetUserBet($marketId: Int!, $user: String!) {
    userBet(marketId: $marketId, user: $user) {
      amount
      isYes
      claimed
    }
  }
`;

export function useLinera() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async (): Promise<Market[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await client.request<{ markets: Market[] }>(MARKETS_QUERY);
      return data.markets;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch markets';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMarket = useCallback(async (id: number): Promise<Market | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await client.request<{ market: Market | null }>(MARKET_QUERY, { id });
      return data.market;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserBet = useCallback(async (marketId: number, user: string): Promise<Bet | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await client.request<{ userBet: Bet | null }>(USER_BET_QUERY, { marketId, user });
      return data.userBet;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user bet';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // These would typically send mutations through the Linera node
  // For demo purposes, we'll use mock implementations
  const createMarket = useCallback(async (input: CreateMarketInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would send an operation to the Linera node
      console.log('Creating market:', input);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create market';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const placeBet = useCallback(async (input: PlaceBetInput): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would send an operation to the Linera node
      console.log('Placing bet:', input);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place bet';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveMarket = useCallback(async (marketId: number, outcome: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Resolving market:', marketId, outcome);
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resolve market';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const claimWinnings = useCallback(async (marketId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Claiming winnings:', marketId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to claim winnings';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchMarkets,
    fetchMarket,
    fetchUserBet,
    createMarket,
    placeBet,
    resolveMarket,
    claimWinnings,
  };
}
