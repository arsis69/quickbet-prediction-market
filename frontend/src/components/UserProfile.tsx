import type { Market } from '../types';

interface UserStats {
  totalBets: number;
  activeBets: number;
  totalWinnings: number;
  winRate: number;
  marketsCreated: number;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
  chainId: string | null;
  stats: UserStats;
  userBets: { market: Market; isYes: boolean; amount: number }[];
  shortenAddress: (addr: string | null) => string;
}

export function UserProfile({
  isOpen,
  onClose,
  address,
  chainId,
  stats,
  userBets,
  shortenAddress,
}: UserProfileProps) {
  if (!isOpen || !address) return null;

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">My Profile</h2>
              <p className="text-gray-400 text-sm font-mono">{shortenAddress(address)}</p>
              {chainId && (
                <p className="text-purple-400 text-xs mt-1">Chain: {chainId.slice(0, 20)}...</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Bets</p>
            <p className="text-white text-2xl font-bold">{stats.totalBets}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Active Bets</p>
            <p className="text-blue-400 text-2xl font-bold">{stats.activeBets}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Winnings</p>
            <p className="text-green-400 text-2xl font-bold">{formatAmount(stats.totalWinnings)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-purple-400 text-2xl font-bold">{stats.winRate}%</p>
          </div>
        </div>

        {/* Markets Created */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Markets Created</p>
            <p className="text-white text-xl font-bold">{stats.marketsCreated}</p>
          </div>
        </div>

        {/* Active Bets */}
        <div>
          <h3 className="text-white font-semibold mb-3">Your Active Bets</h3>
          {userBets.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-gray-400">No active bets</p>
              <p className="text-gray-500 text-sm mt-1">Place a bet on a market to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userBets.map((bet, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <p className="text-white text-sm mb-2 line-clamp-2">{bet.market.question}</p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bet.isYes
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {bet.isYes ? 'YES' : 'NO'}
                    </span>
                    <span className="text-white font-medium">{formatAmount(bet.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => navigator.clipboard.writeText(address)}
            className="w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Address
          </button>
        </div>
      </div>
    </div>
  );
}
