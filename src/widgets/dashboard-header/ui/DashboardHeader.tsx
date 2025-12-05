import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTradeStore } from '@/entities/trade';

interface DashboardHeaderProps {
  onSync: () => void;
  isBeginnerMode: boolean;
  onToggleMode: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSync, isBeginnerMode, onToggleMode }) => {
  const { lastSyncTime, isLoading, accountInfo } = useTradeStore();

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-6 backdrop-blur-2xl border border-white/[0.05] shadow-2xl">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            퀀트 모니터
          </h1>
          <p className="text-sm text-gray-400">
            실시간 포트폴리오 추적
          </p>
        </div>
        {!isBeginnerMode && (
          <>
            <div className="hidden md:block h-10 w-px bg-white/10"></div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-bold">계좌</span>
              <span className="text-sm text-gray-200 font-mono">{accountInfo.accountId || '대기 중...'}</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-bold">서버</span>
              <span className="text-sm text-green-400 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${accountInfo.server ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                {accountInfo.server || '연결 중...'}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <button
          onClick={onToggleMode}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isBeginnerMode 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' 
              : 'bg-gray-700 text-gray-400 border border-gray-600'
          }`}
        >
          {isBeginnerMode ? '🐣 초보자 모드' : '😎 전문가 모드'}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-3 py-1.5 rounded-full">
          <Clock size={14} />
          <span>
            최근 동기화: {lastSyncTime ? format(lastSyncTime, 'HH:mm:ss') : '없음'}
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
          {isLoading ? '동기화 중...' : '동기화'}
        </button>
      </div>
    </header>
  );
};
