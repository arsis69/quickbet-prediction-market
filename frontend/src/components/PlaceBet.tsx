import { useState } from 'react';
import type { Market } from '../types';

interface PlaceBetProps {
  market: Market | null;
  onClose: () => void;
  onPlaceBet: (marketId: number, isYes: boolean, amount: number) => Promise<void>;
  loading: boolean;
}

export function PlaceBet({ market, onClose, onPlaceBet, loading }: PlaceBetProps) {
  const [isYes, setIsYes] = useState(true);
  const [amount, setAmount] = useState('');

  if (!market) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const betAmount = parseInt(amount);
    if (!betAmount || betAmount <= 0) return;

    await onPlaceBet(market.id, isYes, betAmount);
    setAmount('');
    onClose();
  };

  const potentialWinnings = () => {
    const betAmount = parseInt(amount) || 0;
    const totalPool = market.yesPool + market.noPool + betAmount;
    const myPool = isYes ? market.yesPool + betAmount : market.noPool + betAmount;
    if (myPool === 0) return 0;
    return ((betAmount / myPool) * totalPool).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Place Bet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-300 mb-6">{market.question}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* YES/NO Toggle */}
          <div>
            <label className="block text-gray-300 text-sm mb-3">
              Your Prediction
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsYes(true)}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                  isYes
                    ? 'btn-yes text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setIsYes(false)}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                  !isYes
                    ? 'btn-no text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Bet Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Potential Winnings */}
          {amount && parseInt(amount) > 0 && (
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potential Winnings</span>
                <span className={isYes ? 'text-green-400' : 'text-red-400'}>
                  {potentialWinnings()}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                If {isYes ? 'YES' : 'NO'} wins and you bet {amount}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || parseInt(amount) <= 0}
              className={`flex-1 py-3 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                isYes ? 'btn-yes' : 'btn-no'
              }`}
            >
              {loading ? 'Placing...' : `Bet ${isYes ? 'YES' : 'NO'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
