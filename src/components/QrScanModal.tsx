import React, { useState, useEffect } from 'react';
import { X, Camera, QrCode, ScanLine, CheckCircle2 } from 'lucide-react';

interface QrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({ isOpen, onClose, onDetected }) => {
  const [scanningStatus, setScanningStatus] = useState<'searching' | 'detected'>('searching');

  useEffect(() => {
    if (isOpen) {
      setScanningStatus('searching');
      // Simulate fast auto-detection after 1.4 seconds
      const timer = setTimeout(() => {
        setScanningStatus('detected');
        const triggerTimer = setTimeout(() => {
          onDetected('MP-2026-08421');
          onClose();
        }, 800);
        return () => clearTimeout(triggerTimer);
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onDetected, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0d131f] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Сканирование QR-кода упаковки</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="my-6 relative rounded-xl bg-black/60 aspect-square border border-white/10 flex items-center justify-center overflow-hidden">
          {/* Laser scan line animation */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-[scan_2s_ease-in-out_infinite]" />

          {/* Viewfinder corner brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

          {/* Center simulated QR code card */}
          <div className="flex flex-col items-center justify-center p-6 text-center z-10 transition-all">
            {scanningStatus === 'searching' ? (
              <>
                <div className="w-24 h-24 border border-dashed border-emerald-400/40 rounded-xl flex items-center justify-center bg-white/[0.02] mb-3">
                  <QrCode className="w-12 h-12 text-emerald-400/80 animate-pulse" />
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  Наведите камеру на защитный QR-код
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Партия маркировки «Честный Знак / MedTrace»
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-white">QR-код распознан</span>
                <span className="text-xs font-mono text-emerald-400 mt-0.5">MP-2026-08421</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer instant actions */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Тестовый режим эмулятора</span>
          <button
            onClick={() => {
              onDetected('MP-2026-08421');
              onClose();
            }}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            type="button"
          >
            Применить код MP-2026-08421 →
          </button>
        </div>
      </div>
    </div>
  );
};
