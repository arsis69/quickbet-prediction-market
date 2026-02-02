import { WalletButton } from './WalletButton';

interface HeaderProps {
  onCreateMarket: () => void;
  // Wallet props
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onProfileClick: () => void;
  shortenAddress: (addr: string | null) => string;
}

export function Header({
  onCreateMarket,
  isConnected,
  isConnecting,
  address,
  onConnect,
  onDisconnect,
  onProfileClick,
  shortenAddress,
}: HeaderProps) {
  return (
    <header className="glass-dark sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">QuickBet</h1>
            <p className="text-gray-400 text-xs">Prediction Markets on Linera</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <button
              onClick={onCreateMarket}
              className="btn-gradient text-white px-4 py-2 rounded-lg font-medium hidden sm:flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">Create Market</span>
            </button>
          )}

          <WalletButton
            isConnected={isConnected}
            isConnecting={isConnecting}
            address={address}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onProfileClick={onProfileClick}
            shortenAddress={shortenAddress}
          />
        </div>
      </div>
    </header>
  );
}
