import { useState } from 'react';

interface LeaderboardEntry {
  address: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
  marketsCreated: number;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock leaderboard data
const MOCK_LEADERS: LeaderboardEntry[] = [
  { address: '0x1234...5678', totalWinnings: 45000, totalBets: 32, winRate: 75, marketsCreated: 5 },
  { address: '0xabcd...ef01', totalWinnings: 38000, totalBets: 28, winRate: 71, marketsCreated: 3 },
  { address: '0x9876...5432', totalWinnings: 32000, totalBets: 45, winRate: 62, marketsCreated: 8 },
  { address: '0xdef0...1234', totalWinnings: 28000, totalBets: 25, winRate: 68, marketsCreated: 2 },
  { address: '0x1111...2222', totalWinnings: 25000, totalBets: 38, winRate: 55, marketsCreated: 6 },
  { address: '0x3333...4444', totalWinnings: 22000, totalBets: 30, winRate: 60, marketsCreated: 4 },
  { address: '0x5555...6666', totalWinnings: 18000, totalBets: 22, winRate: 64, marketsCreated: 1 },
  { address: '0x7777...8888', totalWinnings: 15000, totalBets: 20, winRate: 70, marketsCreated: 3 },
  { address: '0x9999...0000', totalWinnings: 12000, totalBets: 18, winRate: 56, marketsCreated: 2 },
  { address: '0xaaaa...bbbb', totalWinnings: 10000, totalBets: 15, winRate: 67, marketsCreated: 1 },
];

type LeaderboardTab = 'winnings' | 'bets' | 'winrate' | 'creators';

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('winnings');

  if (!isOpen) return null;

  const getSortedLeaders = () => {
    const sorted = [...MOCK_LEADERS];
    switch (activeTab) {
      case 'winnings':
        return sorted.sort((a, b) => b.totalWinnings - a.totalWinnings);
      case 'bets':
        return sorted.sort((a, b) => b.totalBets - a.totalBets);
      case 'winrate':
        return sorted.sort((a, b) => b.winRate - a.winRate);
      case 'creators':
        return sorted.sort((a, b) => b.marketsCreated - a.marketsCreated);
      default:
        return sorted;
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const leaders = getSortedLeaders();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Leaderboard</h2>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('winnings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'winnings'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Top Earners
          </button>
          <button
            onClick={() => setActiveTab('bets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'bets'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setActiveTab('winrate')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'winrate'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Best Win Rate
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'creators'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Top Creators
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaders.map((leader, index) => (
            <div
              key={leader.address}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                index < 3
                  ? 'bg-gradient-to-r from-white/20 to-white/10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                'bg-white/10 text-gray-400'
              }`}>
                {index + 1}
              </div>

              {/* Address */}
              <div className="flex-1">
                <p className="text-white font-mono font-medium">{leader.address}</p>
              </div>

              {/* Stats */}
              <div className="text-right">
                {activeTab === 'winnings' && (
                  <>
                    <p className="text-green-400 font-bold">{formatAmount(leader.totalWinnings)}</p>
                    <p className="text-gray-400 text-sm">{leader.totalBets} bets</p>
                  </>
                )}
                {activeTab === 'bets' && (
                  <>
                    <p className="text-blue-400 font-bold">{leader.totalBets}</p>
                    <p className="text-gray-400 text-sm">{formatAmount(leader.totalWinnings)} won</p>
                  </>
                )}
                {activeTab === 'winrate' && (
                  <>
                    <p className="text-green-400 font-bold">{leader.winRate}%</p>
                    <p className="text-gray-400 text-sm">{leader.totalBets} bets</p>
                  </>
                )}
                {activeTab === 'creators' && (
                  <>
                    <p className="text-purple-400 font-bold">{leader.marketsCreated}</p>
                    <p className="text-gray-400 text-sm">markets</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
