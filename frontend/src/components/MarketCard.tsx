import type { Market } from '../types';

interface MarketCardProps {
  market: Market;
  onPlaceBet: (market: Market) => void;
  onResolve?: (market: Market) => void;
  userAddress?: string | null;
}

export function MarketCard({ market, onPlaceBet, onResolve, userAddress }: MarketCardProps) {
  const totalPool = market.yesPool + market.noPool;
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="glass rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            market.resolved
              ? market.outcome
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {market.resolved
            ? market.outcome
              ? 'Resolved: YES'
              : 'Resolved: NO'
            : 'Active'}
        </span>
        <span className="text-gray-400 text-sm">#{market.id}</span>
      </div>

      {/* Question */}
      <h3 className="text-white text-lg font-semibold mb-4 leading-tight">
        {market.question}
      </h3>

      {/* Percentage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-green-400 font-medium">
            YES {market.yesPercentage.toFixed(1)}%
          </span>
          <span className="text-red-400 font-medium">
            NO {market.noPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-700 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            style={{ width: `${market.yesPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
            style={{ width: `${market.noPercentage}%` }}
          />
        </div>
      </div>

      {/* Pool Info */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <div>
          <span className="text-green-400">{formatAmount(market.yesPool)}</span> YES
        </div>
        <div>
          Total: <span className="text-white">{formatAmount(totalPool)}</span>
        </div>
        <div>
          <span className="text-red-400">{formatAmount(market.noPool)}</span> NO
        </div>
      </div>

      {/* Action Buttons */}
      {!market.resolved && (
        <div className="space-y-2">
          <button
            onClick={() => onPlaceBet(market)}
            className="w-full btn-gradient text-white py-3 rounded-xl font-medium"
          >
            Place Bet
          </button>
          {onResolve && userAddress && market.creator.toLowerCase().includes(userAddress.slice(2, 10).toLowerCase()) && (
            <button
              onClick={() => onResolve(market)}
              className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 py-2 rounded-xl font-medium transition-colors"
            >
              Resolve Market
            </button>
          )}
        </div>
      )}

      {market.resolved && (
        <div className="text-center text-gray-400 text-sm py-3">
          Market has been resolved
        </div>
      )}
    </div>
  );
}
