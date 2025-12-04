import { useEffect, useCallback } from 'react';
import { useTradeStore } from '@/entities/trade/model';

export const useTradeSync = (pollingInterval = 300000) => {
  const { setTrades, setLoading, setError, lastSyncTime } = useTradeStore();

  const sync = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trades');
      if (!response.ok) throw new Error('Failed to fetch trades');
      const trades = await response.json();
      setTrades(trades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  }, [setTrades, setLoading, setError]);

  useEffect(() => {
    sync(); // Initial fetch
    const interval = setInterval(sync, pollingInterval);
    return () => clearInterval(interval);
  }, [sync, pollingInterval]);

  return { sync, lastSyncTime };
};
