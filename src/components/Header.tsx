import React, { useState, useRef, useEffect } from 'react';
import { 
  Wallet, 
  ShieldCheck, 
  Copy, 
  Check, 
  LogOut, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  X
} from 'lucide-react';

interface HeaderProps {
  address: string | null;
  shortAddress: string | null;
  balanceFormatted: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  notification: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearNotification: () => void;
  onRefreshBalance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  address,
  shortAddress,
  balanceFormatted,
  isConnecting,
  isConnected,
  notification,
  onConnect,
  onDisconnect,
  onClearNotification,
  onRefreshBalance
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#080b11]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
            MedTrace
          </span>
        </div>

        {/* Zone 2: Navigation / Network indicator */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Solana Devnet</span>
          </div>
          <span className="text-white/20">/</span>
          <span>Протокол верификации поставок</span>
        </div>

        {/* Zone 3: Wallet Action */}
        <div className="relative" ref={dropdownRef}>
          {isConnected ? (
            /* Connected State: 7xK2...9F2A · 2.45 SOL */
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-xs font-mono font-medium text-emerald-300 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span>{shortAddress}</span>
              <span className="text-emerald-400/40">·</span>
              <span className="text-white font-semibold">{balanceFormatted ?? '0.00 SOL'}</span>
            </button>
          ) : isConnecting ? (
            /* Loading State: Подключение... */
            <button
              disabled
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-medium text-slate-300 transition-all cursor-wait whitespace-nowrap"
              type="button"
            >
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Подключение...</span>
            </button>
          ) : (
            /* Disconnected State: Подключить кошелёк */
            <button
              onClick={onConnect}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-emerald-500/40 active:scale-[0.98] transition-all text-xs font-medium text-slate-200 hover:text-white group whitespace-nowrap cursor-pointer"
              type="button"
            >
              <Wallet className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span>Подключить кошелёк</span>
            </button>
          )}

          {/* Connected Account Dropdown Menu */}
          {isConnected && dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0d131f] border border-white/10 shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-white">Phantom подключён</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Devnet
                </span>
              </div>

              <div className="py-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Адрес кошелька</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
                      type="button"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-black/40 p-2 rounded-lg border border-white/5 break-all select-all">
                    {address}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Баланс Solana Devnet</span>
                    <span className="font-mono text-sm font-bold text-white">
                      {balanceFormatted ?? '0.00 SOL'}
                    </span>
                  </div>
                  <button
                    onClick={onRefreshBalance}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Обновить баланс"
                    type="button"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <a
                  href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span>В Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onDisconnect();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  type="button"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Отключить</span>
                </button>
              </div>
            </div>
          )}

          {/* Missing Phantom Notification Popover / Tooltip */}
          {notification && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#131b2b] border border-amber-500/40 p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {notification}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-medium transition-colors"
                    >
                      <span>Открыть в новой вкладке</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={onClearNotification}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
