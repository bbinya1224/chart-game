import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTradeStore } from '@/entities/trade';

interface DashboardHeaderProps {
  onSync: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSync }) => {
  const { lastSyncTime, isLoading } = useTradeStore();

  return (
    <header className="flex items-center justify-between rounded-xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Trade Monitor
        </h1>
        <p className="text-sm text-gray-400">Real-time Copy Trading Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-3 py-1.5 rounded-full">
          <Clock size={14} />
          <span>
            Last Sync: {lastSyncTime ? format(lastSyncTime, 'HH:mm:ss') : 'Never'}
          </span>
        </div>

        <button
          onClick={onSync}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${isLoading 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </header>
  );
};
