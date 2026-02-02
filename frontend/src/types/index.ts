export interface Market {
  id: number;
  question: string;
  creator: string;
  yesPool: number;
  noPool: number;
  endTime: number;
  resolved: boolean;
  outcome: boolean | null;
  yesPercentage: number;
  noPercentage: number;
}

export interface Bet {
  amount: number;
  isYes: boolean;
  claimed: boolean;
}

export interface CreateMarketInput {
  question: string;
  endTime: number;
}

export interface PlaceBetInput {
  marketId: number;
  isYes: boolean;
  amount: number;
}
