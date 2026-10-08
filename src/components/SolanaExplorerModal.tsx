import React from 'react';
import { X, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { DrugBatch } from '../types';

interface SolanaExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: DrugBatch;
}

export const SolanaExplorerModal: React.FC<SolanaExplorerModalProps> = ({ isOpen, onClose, batch }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(batch.fullSignature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0d131f] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Запись в реестре Solana
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Подтверждено
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Кластер: {batch.network}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical ledger fields */}
        <div className="py-4 space-y-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
              Transaction Signature
            </span>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-slate-300 break-all select-all">
              <span className="text-[11px] flex-1">{batch.fullSignature}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-emerald-400 transition-colors shrink-0"
                type="button"
                title="Копировать сигнатуру"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Slot / Блок
              </span>
              <span className="font-mono text-slate-200">#289,410,248</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Статус финализации
              </span>
              <span className="text-emerald-400 font-medium">Finalized (MAX)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Верифицированные данные партии
            </span>
            <div className="font-mono text-[11px] bg-black/50 p-2.5 rounded border border-white/5 text-emerald-300 space-y-1">
              <div><span className="text-slate-400">batch_id:</span> "{batch.batchNumber}"</div>
              <div><span className="text-slate-400">drug_name:</span> "{batch.name}"</div>
              <div><span className="text-slate-400">manufacturer:</span> "{batch.manufacturer}"</div>
              <div><span className="text-slate-400">expiry_timestamp:</span> "{batch.expiryDate}"</div>
              <div><span className="text-slate-400">current_custodian:</span> "{batch.lastPoint}"</div>
              <div><span className="text-slate-400">integrity_hash:</span> "SHA256: e82f...a109"</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Криптографическая неизменяемость данных в блокчейне исключает возможность подделки сертификата соответствия, повторного использования партии или подмены срока годности недобросовестными поставщиками.
          </p>
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            type="button"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
