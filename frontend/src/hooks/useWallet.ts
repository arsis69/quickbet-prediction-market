import { useState, useCallback, useEffect } from 'react';

// Linera MetaMask Snap ID (for future integration)
const LINERA_SNAP_ID = 'npm:@linera/metamask-snap';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: string | null;
  error: string | null;
}

interface UserStats {
  totalBets: number;
  activeBets: number;
  totalWinnings: number;
  winRate: number;
  marketsCreated: number;
}

// Check if MetaMask is installed
const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Request Linera Snap installation (for future use)
const installLineraSnap = async (): Promise<boolean> => {
  try {
    await window.ethereum?.request({
      method: 'wallet_requestSnaps',
      params: {
        [LINERA_SNAP_ID]: {},
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to install Linera snap:', error);
    return false;
  }
};

// Check if Linera Snap is installed
const isLineraSnapInstalled = async (): Promise<boolean> => {
  try {
    const snaps = await window.ethereum?.request({
      method: 'wallet_getSnaps',
    }) as Record<string, unknown> | null;
    return snaps ? LINERA_SNAP_ID in snaps : false;
  } catch {
    return false;
  }
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    chainId: null,
    error: null,
  });

  const [stats, setStats] = useState<UserStats>({
    totalBets: 0,
    activeBets: 0,
    totalWinnings: 0,
    winRate: 0,
    marketsCreated: 0,
  });

  // Load saved wallet state
  useEffect(() => {
    const savedAddress = localStorage.getItem('linera_address');
    const savedChainId = localStorage.getItem('linera_chain_id');
    if (savedAddress) {
      setWallet(prev => ({
        ...prev,
        isConnected: true,
        address: savedAddress,
        chainId: savedChainId,
      }));
      // Load mock stats for demo
      loadUserStats();
    }
  }, []);

  const loadUserStats = useCallback(() => {
    // Mock stats - in production, fetch from GraphQL
    setStats({
      totalBets: Math.floor(Math.random() * 20) + 5,
      activeBets: Math.floor(Math.random() * 5) + 1,
      totalWinnings: Math.floor(Math.random() * 10000) + 1000,
      winRate: Math.floor(Math.random() * 40) + 40,
      marketsCreated: Math.floor(Math.random() * 5),
    });
  }, []);

  const connect = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Try to install Linera snap (optional, will fail gracefully)
      const snapInstalled = await isLineraSnapInstalled();
      if (!snapInstalled) {
        // Try to install, but don't fail if it doesn't work
        await installLineraSnap().catch(() => {
          console.log('Linera snap not available, continuing with standard MetaMask');
        });
      }

      // Request account access
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      }) as string[] | null;

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      // Get Linera chain ID (mock for now)
      const address = accounts[0];
      const chainId = `linera:${address.slice(2, 10)}`;

      // Save to localStorage
      localStorage.setItem('linera_address', address);
      localStorage.setItem('linera_chain_id', chainId);

      setWallet({
        isConnected: true,
        isConnecting: false,
        address,
        chainId,
        error: null,
      });

      loadUserStats();

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
    }
  }, [loadUserStats]);

  const disconnect = useCallback(() => {
    localStorage.removeItem('linera_address');
    localStorage.removeItem('linera_chain_id');
    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      chainId: null,
      error: null,
    });
    setStats({
      totalBets: 0,
      activeBets: 0,
      totalWinnings: 0,
      winRate: 0,
      marketsCreated: 0,
    });
  }, []);

  const signTransaction = useCallback(async (operation: unknown): Promise<string | null> => {
    if (!wallet.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // Use Linera snap to sign transaction (if available)
      const result = await window.ethereum?.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: LINERA_SNAP_ID,
          request: {
            method: 'linera_signOperation',
            params: { operation },
          },
        },
      });
      return result as string;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      return null;
    }
  }, [wallet.isConnected]);

  const shortenAddress = useCallback((addr: string | null): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  return {
    ...wallet,
    stats,
    connect,
    disconnect,
    signTransaction,
    shortenAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
