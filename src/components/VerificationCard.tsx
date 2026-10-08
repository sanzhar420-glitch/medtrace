import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Factory, 
  Truck, 
  Store, 
  UserCheck, 
  Sparkles,
  Share2
} from 'lucide-react';
import { DrugBatch } from '../types';

interface VerificationCardProps {
  batch: DrugBatch;
  onOpenExplorer: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ batch, onOpenExplorer }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(batch.fullSignature || batch.blockchainId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const stepIcons = [
    <Factory className="w-4 h-4 text-emerald-400" key="factory" />,
    <Truck className="w-4 h-4 text-emerald-400" key="truck" />,
    <Store className="w-4 h-4 text-emerald-400" key="store" />,
    <UserCheck className="w-4 h-4 text-emerald-400" key="user" />
  ];

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-[#0d131f] border border-emerald-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-emerald-400 font-semibold text-sm tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Статус: Проверено ✓
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-slate-400">Оригинальный медикамент</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {batch.name}
          </h2>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs text-slate-300 transition-colors"
            title="Поделиться верификацией"
            type="button"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Ссылка скопирована' : 'Поделиться'}</span>
          </button>
        </div>
      </div>

      {/* Primary Key Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 py-6 border-b border-white/[0.08] text-sm">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Производитель
          </span>
          <span className="font-medium text-slate-200 text-base">{batch.manufacturer}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Номер партии
          </span>
          <span className="font-mono-nums font-semibold text-emerald-400 text-base">
            {batch.batchNumber}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Последняя точка цепочки
          </span>
          <span className="font-medium text-slate-200 text-base">{batch.lastPoint}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Дата производства
          </span>
          <span className="font-mono-nums text-slate-300 text-base">{batch.manufactureDate}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Срок годности
          </span>
          <span className="font-mono-nums text-slate-300 text-base">{batch.expiryDate}</span>
        </div>

        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
            Blockchain ID
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono-nums text-slate-300 text-base font-semibold">
              {batch.blockchainId}
            </span>
            <button
              onClick={handleCopyHash}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Копировать полный хэш транзакции"
              type="button"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Supply Chain Section */}
      <div className="py-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            История поставки (Цепочка происхождения)
          </h3>
          <span className="text-xs text-emerald-400 font-mono-nums flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            4 из 4 этапов заверены
          </span>
        </div>

        {/* Visual timeline */}
        <div className="relative">
          {/* Desktop flow bar */}
          <div className="hidden md:block absolute top-6 left-8 right-8 h-[2px] bg-emerald-500/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {batch.chainSteps.map((step, idx) => (
              <div 
                key={step.id} 
                className="flex md:flex-col items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 transition-colors"
              >
                {/* Node icon circle */}
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-sm">
                  {stepIcons[idx] || <Check className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-slate-200">
                      {step.role}
                    </span>
                    <span className="text-[11px] font-mono-nums text-slate-400">
                      {step.date}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-300/90 font-medium truncate">
                    {step.entity}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {step.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solana Confirmation & Explorer verification link */}
      <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
          <span className="text-sm font-medium text-emerald-400 font-sans">
            Данные подтверждены в сети Solana
          </span>
        </div>

        <button
          onClick={onOpenExplorer}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline"
          type="button"
        >
          <span>Проверить запись в Solana Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
