import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MarketList } from './components/MarketList';
import { CreateMarket } from './components/CreateMarket';
import { PlaceBet } from './components/PlaceBet';
import { UserProfile } from './components/UserProfile';
import { ResolveMarket } from './components/ResolveMarket';
import { Leaderboard } from './components/Leaderboard';
import { TransactionHistory } from './components/TransactionHistory';
import { ToastContainer } from './components/Toast';
import { useLinera } from './hooks/useLinera';
import { useWallet } from './hooks/useWallet';
import { useToast } from './hooks/useToast';
import type { Market } from './types';

// Demo markets for display when backend is not connected
const DEMO_MARKETS: Market[] = [
  {
    id: 1,
    question: "Will Bitcoin reach $100k by end of 2025?",
    creator: "0x1234...5678",
    yesPool: 15000,
    noPool: 8500,
    endTime: Date.now() + 86400000 * 30,
    resolved: false,
    outcome: null,
    yesPercentage: 63.8,
    noPercentage: 36.2,
  },
  {
    id: 2,
    question: "Will Ethereum ETF be approved in Q1 2025?",
    creator: "0xabcd...ef01",
    yesPool: 22000,
    noPool: 3000,
    endTime: Date.now() + 86400000 * 60,
    resolved: false,
    outcome: null,
    yesPercentage: 88.0,
    noPercentage: 12.0,
  },
  {
    id: 3,
    question: "Will there be a new iPhone released in September?",
    creator: "0x9876...5432",
    yesPool: 50000,
    noPool: 2000,
    endTime: Date.now() + 86400000 * 90,
    resolved: false,
    outcome: null,
    yesPercentage: 96.2,
    noPercentage: 3.8,
  },
  {
    id: 4,
    question: "Will Linera mainnet launch in Q1 2025?",
    creator: "0xdef0...1234",
    yesPool: 12000,
    noPool: 12000,
    endTime: Date.now() + 86400000 * 120,
    resolved: false,
    outcome: null,
    yesPercentage: 50.0,
    noPercentage: 50.0,
  },
  {
    id: 5,
    question: "Will AI models pass expert-level reasoning tests by 2025?",
    creator: "0x1111...2222",
    yesPool: 8000,
    noPool: 4000,
    endTime: Date.now() - 86400000,
    resolved: true,
    outcome: true,
    yesPercentage: 66.7,
    noPercentage: 33.3,
  },
];

// Demo user bets
const DEMO_USER_BETS = [
  { market: DEMO_MARKETS[0], isYes: true, amount: 500 },
  { market: DEMO_MARKETS[3], isYes: false, amount: 1000 },
];

function App() {
  const [markets, setMarkets] = useState<Market[]>(DEMO_MARKETS);
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [resolveMarket, setResolveMarket] = useState<Market | null>(null);
  const [userBets, setUserBets] = useState(DEMO_USER_BETS);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { loading, fetchMarkets, createMarket, placeBet, resolveMarket: resolveMarketFn } = useLinera();
  const wallet = useWallet();
  const toast = useToast();

  const loadMarkets = useCallback(async () => {
    const fetchedMarkets = await fetchMarkets();
    if (fetchedMarkets.length > 0) {
      setMarkets(fetchedMarkets);
    }
  }, [fetchMarkets]);

  useEffect(() => {
    loadMarkets();
  }, [loadMarkets]);

  const handleCreateMarket = async (question: string, endTime: number) => {
    if (!wallet.isConnected) {
      wallet.connect();
      return;
    }

    const success = await createMarket({ question, endTime });
    if (success) {
      const newMarket: Market = {
        id: markets.length + 1,
        question,
        creator: wallet.shortenAddress(wallet.address),
        yesPool: 0,
        noPool: 0,
        endTime,
        resolved: false,
        outcome: null,
        yesPercentage: 50,
        noPercentage: 50,
      };
      setMarkets([newMarket, ...markets]);
      toast.success('Market Created', 'Your prediction market has been created successfully!');
    } else {
      toast.error('Failed to Create', 'Could not create market. Please try again.');
    }
  };

  const handlePlaceBet = async (marketId: number, isYes: boolean, amount: number) => {
    if (!wallet.isConnected) {
      wallet.connect();
      return;
    }

    const success = await placeBet({ marketId, isYes, amount });
    if (success) {
      setMarkets(markets.map(m => {
        if (m.id === marketId) {
          const newYesPool = isYes ? m.yesPool + amount : m.yesPool;
          const newNoPool = !isYes ? m.noPool + amount : m.noPool;
          const total = newYesPool + newNoPool;
          return {
            ...m,
            yesPool: newYesPool,
            noPool: newNoPool,
            yesPercentage: (newYesPool / total) * 100,
            noPercentage: (newNoPool / total) * 100,
          };
        }
        return m;
      }));

      const market = markets.find(m => m.id === marketId);
      if (market) {
        setUserBets([...userBets, { market, isYes, amount }]);
      }

      toast.success(
        'Bet Placed!',
        `You bet ${amount} on ${isYes ? 'YES' : 'NO'} for market #${marketId}`
      );
    } else {
      toast.error('Bet Failed', 'Could not place bet. Please try again.');
    }
  };

  const handleResolveMarket = async (marketId: number, outcome: boolean) => {
    const success = await resolveMarketFn(marketId, outcome);
    if (success) {
      setMarkets(markets.map(m =>
        m.id === marketId
          ? { ...m, resolved: true, outcome }
          : m
      ));
      toast.success(
        'Market Resolved',
        `Market #${marketId} resolved as ${outcome ? 'YES' : 'NO'}`
      );
    } else {
      toast.error('Resolution Failed', 'Could not resolve market. Please try again.');
    }
  };

  const handlePlaceBetClick = (market: Market) => {
    if (!wallet.isConnected) {
      toast.warning('Connect Wallet', 'Please connect your wallet to place bets');
      wallet.connect();
      return;
    }
    setSelectedMarket(market);
  };

  const handleResolveClick = (market: Market) => {
    setResolveMarket(market);
  };

  // Filter markets
  const filteredMarkets = markets.filter(market => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'active' ? !market.resolved :
      market.resolved;

    const matchesSearch = searchQuery === '' ||
      market.question.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Header
        onCreateMarket={() => {
          if (!wallet.isConnected) {
            toast.warning('Connect Wallet', 'Please connect your wallet to create markets');
            wallet.connect();
            return;
          }
          setShowCreateMarket(true);
        }}
        isConnected={wallet.isConnected}
        isConnecting={wallet.isConnecting}
        address={wallet.address}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        onProfileClick={() => setShowProfile(true)}
        shortenAddress={wallet.shortenAddress}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Connection prompt for non-connected users */}
        {!wallet.isConnected && (
          <div className="glass rounded-2xl p-6 mb-8 text-center">
            <h2 className="text-white text-xl font-bold mb-2">Welcome to QuickBet</h2>
            <p className="text-gray-400 mb-4">Connect your wallet to create markets and place bets</p>
            <button
              onClick={wallet.connect}
              className="btn-gradient text-white px-8 py-3 rounded-xl font-medium"
            >
              Connect Wallet to Get Started
            </button>
            {wallet.error && (
              <p className="text-red-400 text-sm mt-3">{wallet.error}</p>
            )}
          </div>
        )}

        {/* Stats bar and quick actions for connected users */}
        {wallet.isConnected && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Your Bets</p>
                <p className="text-white text-2xl font-bold">{wallet.stats.totalBets}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-blue-400 text-2xl font-bold">{wallet.stats.activeBets}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Winnings</p>
                <p className="text-green-400 text-2xl font-bold">{wallet.stats.totalWinnings}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-purple-400 text-2xl font-bold">{wallet.stats.winRate}%</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => setShowHistory(true)}
                className="glass hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="glass hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Leaderboard
              </button>
            </div>
          </>
        )}

        {/* Market Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'btn-gradient text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active' ? 'btn-gradient text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'resolved' ? 'btn-gradient text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Resolved
            </button>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-2">
            {filter === 'all' ? 'All Markets' : filter === 'active' ? 'Active Markets' : 'Resolved Markets'}
          </h2>
          <p className="text-gray-400">
            {filteredMarkets.length} {filteredMarkets.length === 1 ? 'market' : 'markets'} found
          </p>
        </div>

        <MarketList
          markets={filteredMarkets}
          loading={loading}
          onPlaceBet={handlePlaceBetClick}
          onResolve={handleResolveClick}
          userAddress={wallet.address}
        />
      </main>

      {/* Modals */}
      <CreateMarket
        isOpen={showCreateMarket}
        onClose={() => setShowCreateMarket(false)}
        onCreate={handleCreateMarket}
        loading={loading}
      />

      <PlaceBet
        market={selectedMarket}
        onClose={() => setSelectedMarket(null)}
        onPlaceBet={handlePlaceBet}
        loading={loading}
      />

      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        address={wallet.address}
        chainId={wallet.chainId}
        stats={wallet.stats}
        userBets={userBets}
        shortenAddress={wallet.shortenAddress}
      />

      <ResolveMarket
        market={resolveMarket}
        onClose={() => setResolveMarket(null)}
        onResolve={handleResolveMarket}
        loading={loading}
        userAddress={wallet.address}
      />

      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      <TransactionHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        userAddress={wallet.address}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.closeToast} />

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Built on Linera | QuickBet Prediction Markets</p>
      </footer>
    </div>
  );
}

export default App;
