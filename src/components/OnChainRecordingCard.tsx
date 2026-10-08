import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Wallet,
  Clock
} from 'lucide-react';

export type TxRecordingStatus = 'idle' | 'recording' | 'confirmed' | 'cancelled' | 'error';

interface OnChainRecordingCardProps {
  status: TxRecordingStatus;
  signature: string | null;
  errorMessage?: string | null;
  isConnected: boolean;
  onConnectWallet: () => void;
  onRetry: () => void;
}

export const OnChainRecordingCard: React.FC<OnChainRecordingCardProps> = ({
  status,
  signature,
  errorMessage,
  isConnected,
  onConnectWallet,
  onRetry
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Not connected prompt
  if (!isConnected) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block">
              Запись проверки в реестр Solana Devnet
            </span>
            <span className="text-slate-400">
              Подключите кошелёк Phantom для подписания реальной транзакции проверки.
            </span>
          </div>
        </div>

        <button
          onClick={onConnectWallet}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#080b11] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          type="button"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Подключить кошелёк</span>
        </button>
      </div>
    );
  }

  // 1.1 Connected but idle (e.g. before triggering or on manual call)
  if (status === 'idle') {
    return (
      <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block">
              Кошелёк Phantom подключён
            </span>
            <span className="text-slate-400">
              Зафиксируйте проверку партии в неизменяемом реестре Solana Devnet.
            </span>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#080b11] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          type="button"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Записать в блокчейн</span>
        </button>
      </div>
    );
  }

  // 2. Recording in progress
  if (status === 'recording') {
    return (
      <div className="mt-4 p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-emerald-300 block text-sm">
              Записываем проверку в блокчейн…
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">
              Формирование инструкции Memo и подтверждение в кластере Solana Devnet
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Successfully confirmed
  if (status === 'confirmed' && signature) {
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

    return (
      <div className="mt-4 p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-xs shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>✓ Проверка записана в блокчейн</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Finalized</span>
          </div>
        </div>

        {/* Transaction Signature Details */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Transaction Signature</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
                type="button"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <div className="font-mono text-[11px] text-emerald-300 bg-black/50 p-2.5 rounded-lg border border-emerald-500/20 break-all select-all">
              {signature}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              Статус финализации: <strong className="text-slate-200 font-medium">Finalized</strong> · Сеть: <strong className="text-slate-200 font-medium">Solana Devnet</strong>
            </span>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#080b11] font-semibold text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <span>Посмотреть запись в Solana Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. Cancelled by user
  if (status === 'cancelled') {
    return (
      <div className="mt-4 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/30 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Транзакция отменена пользователем.</span>
          </div>

          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            type="button"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Повторить запись</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. General error
  if (status === 'error') {
    return (
      <div className="mt-4 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/30 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Не удалось записать проверку в блокчейн. Попробуйте ещё раз.</span>
          </div>

          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 font-medium text-xs transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            type="button"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Попробовать ещё раз</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
