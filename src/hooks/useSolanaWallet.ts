import { useState, useEffect, useCallback, useRef } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

export interface WalletState {
  address: string | null;
  shortAddress: string | null;
  balance: number | null;
  balanceFormatted: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  notification: string | null;
}

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: {
    toString: () => string;
  } | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (args?: any) => void) => void;
  off?: (event: string, handler: (args?: any) => void) => void;
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window === 'undefined') return null;
  const win = window as any;
  // Check Phantom strictly via window.phantom.solana as specified
  if (win.phantom?.solana) {
    return win.phantom.solana;
  }
  if (win.solana?.isPhantom) {
    return win.solana;
  }
  return null;
};

const DEVNET_RPC = clusterApiUrl('devnet');

export function useSolanaWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const connectionRef = useRef<Connection | null>(null);

  const getConnection = useCallback(() => {
    if (!connectionRef.current) {
      connectionRef.current = new Connection(DEVNET_RPC, 'confirmed');
    }
    return connectionRef.current;
  }, []);

  const formatShortAddress = (addr: string): string => {
    if (!addr || addr.length < 8) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const fetchBalance = useCallback(async (pubKeyString: string) => {
    try {
      const conn = getConnection();
      const pubKey = new PublicKey(pubKeyString);
      const lamports = await conn.getBalance(pubKey);
      const sol = lamports / LAMPORTS_PER_SOL;
      setBalance(sol);
    } catch {
      // In case Devnet RPC is briefly rate-limited or fails
      setBalance(0);
    }
  }, [getConnection]);

  // Attempt eager reconnect on page reload
  useEffect(() => {
    const provider = getPhantomProvider();
    if (!provider) return;

    let isMounted = true;

    provider
      .connect({ onlyIfTrusted: true })
      .then((res) => {
        if (!isMounted || !res?.publicKey) return;
        const pub = res.publicKey.toString();
        setAddress(pub);
        fetchBalance(pub);
      })
      .catch(() => {
        // User hasn't pre-authorized or reloaded without eager trust, quiet fallback
      });

    const handleAccountChanged = (newPub: any) => {
      if (!isMounted) return;
      if (newPub) {
        const pubStr = newPub.toString();
        setAddress(pubStr);
        fetchBalance(pubStr);
      } else {
        setAddress(null);
        setBalance(null);
      }
    };

    const handleDisconnect = () => {
      if (!isMounted) return;
      setAddress(null);
      setBalance(null);
    };

    provider.on('accountChanged', handleAccountChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
      isMounted = false;
      if (provider.off) {
        provider.off('accountChanged', handleAccountChanged);
        provider.off('disconnect', handleDisconnect);
      }
    };
  }, [fetchBalance]);

  const connect = useCallback(async () => {
    setNotification(null);
    const provider = getPhantomProvider();

    // 1. Check if Phantom is installed
    if (!provider) {
      setNotification('Откройте приложение в отдельной вкладке с установленным Phantom');
      return;
    }

    setIsConnecting(true);

    try {
      // 2. Request connection
      const resp = await provider.connect();
      const pub = resp.publicKey.toString();
      setAddress(pub);

      // Fetch Devnet balance
      await fetchBalance(pub);
    } catch (err: any) {
      // 5. If user rejected connection, do not show critical error - keep button as is
      // Phantom error 4001 indicates User rejected the request
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    const provider = getPhantomProvider();
    if (provider) {
      try {
        await provider.disconnect();
      } catch {
        // ignore
      }
    }
    setAddress(null);
    setBalance(null);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const shortAddress = address ? formatShortAddress(address) : null;
  const balanceFormatted = balance !== null ? `${balance.toFixed(2)} SOL` : null;

  return {
    address,
    shortAddress,
    balance,
    balanceFormatted,
    isConnecting,
    isConnected: !!address,
    notification,
    connect,
    disconnect,
    clearNotification,
    refreshBalance: () => address && fetchBalance(address),
  };
}
