import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'bet' | 'create' | 'resolve' | 'claim';
  marketId: number;
  marketQuestion: string;
  amount?: number;
  outcome?: boolean;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string | null;
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '0x1a2b...3c4d',
    type: 'bet',
    marketId: 1,
    marketQuestion: 'Will Bitcoin reach $100k by end of 2025?',
    amount: 500,
    outcome: true,
    timestamp: Date.now() - 3600000,
    status: 'success',
  },
  {
    id: '0x5e6f...7g8h',
    type: 'create',
    marketId: 6,
    marketQuestion: 'Will SpaceX land on Mars in 2026?',
    timestamp: Date.now() - 7200000,
    status: 'success',
  },
  {
    id: '0x9i0j...1k2l',
    type: 'bet',
    marketId: 3,
    marketQuestion: 'Will there be a new iPhone released in September?',
    amount: 1000,
    outcome: false,
    timestamp: Date.now() - 86400000,
    status: 'success',
  },
  {
    id: '0x3m4n...5o6p',
    type: 'claim',
    marketId: 5,
    marketQuestion: 'Will AI models pass expert-level reasoning tests by 2025?',
    amount: 1200,
    timestamp: Date.now() - 172800000,
    status: 'success',
  },
  {
    id: '0x7q8r...9s0t',
    type: 'resolve',
    marketId: 5,
    marketQuestion: 'Will AI models pass expert-level reasoning tests by 2025?',
    outcome: true,
    timestamp: Date.now() - 259200000,
    status: 'success',
  },
  {
    id: '0xuv1w...2x3y',
    type: 'bet',
    marketId: 4,
    marketQuestion: 'Will Linera mainnet launch in Q1 2025?',
    amount: 750,
    outcome: false,
    timestamp: Date.now() - 345600000,
    status: 'pending',
  },
];

type FilterType = 'all' | 'bet' | 'create' | 'resolve' | 'claim';

export function TransactionHistory({ isOpen, onClose, userAddress }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen || !userAddress) return null;

  const filteredTransactions = filter === 'all'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter(tx => tx.type === filter);

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'bet':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'create':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'resolve':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'claim':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'bet': return 'from-blue-500 to-purple-500';
      case 'create': return 'from-green-500 to-emerald-500';
      case 'resolve': return 'from-orange-500 to-red-500';
      case 'claim': return 'from-yellow-500 to-orange-500';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Transaction History</h2>
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

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'bet', 'create', 'resolve', 'claim'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'btn-gradient text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {f === 'all' ? 'All' : getTypeLabel(f)}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTypeColor(tx.type)} flex items-center justify-center text-white flex-shrink-0`}>
                    {getTypeIcon(tx.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-white font-medium">{getTypeLabel(tx.type)} on Market #{tx.marketId}</p>
                        <p className="text-gray-400 text-sm truncate">{tx.marketQuestion}</p>
                      </div>
                      {tx.amount && (
                        <p className={`font-bold whitespace-nowrap ${
                          tx.type === 'claim' ? 'text-green-400' : 'text-white'
                        }`}>
                          {tx.type === 'claim' ? '+' : ''}{tx.amount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      {tx.outcome !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.outcome
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.outcome ? 'YES' : 'NO'}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {tx.status}
                      </span>
                      <span className="text-gray-500 text-xs">{formatTime(tx.timestamp)}</span>
                      <a
                        href={`#tx-${tx.id}`}
                        className="text-purple-400 text-xs hover:underline font-mono"
                      >
                        {tx.id}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
