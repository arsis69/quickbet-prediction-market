interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onProfileClick: () => void;
  shortenAddress: (addr: string | null) => string;
}

export function WalletButton({
  isConnected,
  isConnecting,
  address,
  onConnect,
  onDisconnect,
  onProfileClick,
  shortenAddress,
}: WalletButtonProps) {
  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-medium"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        Connecting...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 glass hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
            <span className="text-xs font-bold">{address.slice(2, 4).toUpperCase()}</span>
          </div>
          {shortenAddress(address)}
        </button>
        <button
          onClick={onDisconnect}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Disconnect"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 btn-gradient text-white px-4 py-2 rounded-lg font-medium"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Connect Wallet
    </button>
  );
}
