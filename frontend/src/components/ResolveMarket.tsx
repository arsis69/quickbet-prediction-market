import type { Market } from '../types';

interface ResolveMarketProps {
  market: Market | null;
  onClose: () => void;
  onResolve: (marketId: number, outcome: boolean) => Promise<void>;
  loading: boolean;
  userAddress: string | null;
}

export function ResolveMarket({
  market,
  onClose,
  onResolve,
  loading,
  userAddress,
}: ResolveMarketProps) {
  if (!market || !userAddress) return null;

  // Check if user is the creator
  const isCreator = market.creator.toLowerCase() === userAddress.slice(0, 10).toLowerCase();

  if (!isCreator) return null;

  const handleResolve = async (outcome: boolean) => {
    if (window.confirm(`Are you sure you want to resolve this market as ${outcome ? 'YES' : 'NO'}? This action cannot be undone.`)) {
      await onResolve(market.id, outcome);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Resolve Market</h2>
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

        {/* Market Stats */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">YES Pool</p>
              <p className="text-green-400 font-bold">{market.yesPool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">NO Pool</p>
              <p className="text-red-400 font-bold">{market.noPool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Pool</p>
              <p className="text-white font-bold">{(market.yesPool + market.noPool).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Market ID</p>
              <p className="text-purple-400 font-bold">#{market.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white font-semibold text-center mb-4">
            What is the outcome?
          </p>

          <button
            onClick={() => handleResolve(true)}
            disabled={loading}
            className="w-full btn-yes text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Resolve as YES
          </button>

          <button
            onClick={() => handleResolve(false)}
            disabled={loading}
            className="w-full btn-no text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Resolve as NO
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          ⚠️ Resolution is permanent and cannot be changed
        </p>
      </div>
    </div>
  );
}
