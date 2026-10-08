import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Clock, ShieldCheck, Trash2 } from 'lucide-react';
import { BlockchainRecord } from '../types';

interface RecordsHistoryProps {
  records: BlockchainRecord[];
  onClearHistory: () => void;
}

export const RecordsHistory: React.FC<RecordsHistoryProps> = ({ records, onClearHistory }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (records.length === 0) {
    return null;
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatShortSignature = (sig: string) => {
    if (!sig || sig.length < 12) return sig;
    return `${sig.slice(0, 6)}...${sig.slice(-6)}`;
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-10 pt-8 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            История успешных записей в блокчейне ({records.length})
          </h3>
        </div>

        <button
          onClick={onClearHistory}
          className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
          type="button"
          title="Очистить историю записей"
        >
          <Trash2 className="w-3 h-3" />
          <span>Очистить</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {records.map((record) => (
          <div
            key={record.id}
            className="p-3.5 sm:p-4 rounded-xl bg-[#0d131f] border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            {/* Left: Drug, Batch, Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm font-sans">
                  {record.drugName}
                </span>
                <span className="text-white/20">·</span>
                <span className="font-mono text-emerald-400 font-medium">
                  {record.batchId}
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  {record.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{record.timestamp}</span>
                </span>
                <span className="text-white/10">|</span>
                <span>{record.manufacturer}</span>
                <span className="text-white/10">|</span>
                <span>{record.custodian}</span>
              </div>
            </div>

            {/* Right: Signature & Explorer Link */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-slate-400">
                  {formatShortSignature(record.signature)}
                </span>
                <button
                  onClick={() => handleCopy(record.id, record.signature)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  type="button"
                  title="Копировать Transaction Signature"
                >
                  {copiedId === record.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <a
                href={record.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                <span>Посмотреть запись</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
