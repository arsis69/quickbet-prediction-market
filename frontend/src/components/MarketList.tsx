import { MarketCard } from './MarketCard';
import type { Market } from '../types';

interface MarketListProps {
  markets: Market[];
  loading: boolean;
  onPlaceBet: (market: Market) => void;
  onResolve?: (market: Market) => void;
  userAddress?: string | null;
}

export function MarketList({ markets, loading, onPlaceBet, onResolve, userAddress }: MarketListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="glass inline-block p-8 rounded-2xl">
          <p className="text-gray-400 text-lg mb-2">No markets yet</p>
          <p className="text-gray-500 text-sm">Create the first prediction market!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={market}
          onPlaceBet={onPlaceBet}
          onResolve={onResolve}
          userAddress={userAddress}
        />
      ))}
    </div>
  );
}
