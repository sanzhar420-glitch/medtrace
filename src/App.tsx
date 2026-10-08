import React, { useState, useEffect } from 'react';
import { 
  Search, 
  QrCode, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
  Layers
} from 'lucide-react';
import { Header } from './components/Header';
import { VerificationCard } from './components/VerificationCard';
import { OnChainRecordingCard, TxRecordingStatus } from './components/OnChainRecordingCard';
import { RecordsHistory } from './components/RecordsHistory';
import { SolanaExplorerModal } from './components/SolanaExplorerModal';
import { QrScanModal } from './components/QrScanModal';
import { PRIMARY_BATCH, ALTERNATIVE_BATCHES } from './data/mockBatches';
import { DrugBatch, BlockchainRecord } from './types';
import { useSolanaWallet, getPhantomProvider } from './hooks/useSolanaWallet';
import { sendDrugVerificationMemo } from './services/solanaMemoService';

const STORAGE_KEY = 'medtrace_blockchain_records';

export default function App() {
  const [batchInput, setBatchInput] = useState<string>('MP-2026-08421');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [currentBatch, setCurrentBatch] = useState<DrugBatch | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // On-chain Solana Devnet transaction states
  const [txStatus, setTxStatus] = useState<TxRecordingStatus>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [recordsHistory, setRecordsHistory] = useState<BlockchainRecord[]>([]);

  // Solana Wallet hook
  const {
    address,
    shortAddress,
    balanceFormatted,
    isConnecting,
    isConnected,
    notification,
    connect,
    disconnect,
    clearNotification,
    refreshBalance
  } = useSolanaWallet();

  // Modals state
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Load audit records from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecordsHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecordToHistory = (newRecord: BlockchainRecord) => {
    setRecordsHistory((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setRecordsHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Real on-chain memo transaction recording
  const triggerOnChainRecord = async (batchToRecord: DrugBatch) => {
    const provider = getPhantomProvider();
    if (!provider || !provider.publicKey) {
      setTxStatus('idle');
      return;
    }

    setTxStatus('recording');
    setTxSignature(null);

    const result = await sendDrugVerificationMemo(provider, batchToRecord);

    if (result.success && result.signature) {
      setTxStatus('confirmed');
      setTxSignature(result.signature);

      // Format date and time
      const now = new Date();
      const formattedTimestamp = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const newRecord: BlockchainRecord = {
        id: result.signature,
        drugName: batchToRecord.name,
        batchId: batchToRecord.batchNumber,
        status: 'VERIFIED',
        timestamp: formattedTimestamp,
        signature: result.signature,
        explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
        custodian: batchToRecord.lastPoint,
        manufacturer: batchToRecord.manufacturer
      };

      saveRecordToHistory(newRecord);
      refreshBalance();
    } else if (result.cancelled) {
      setTxStatus('cancelled');
    } else {
      setTxStatus('error');
    }
  };

  const handleVerify = (overrideCode?: string) => {
    const codeToTest = (overrideCode ?? batchInput).trim();
    if (!codeToTest) {
      setErrorMessage('Пожалуйста, введите номер партии или отсканируйте QR-код');
      return;
    }

    setErrorMessage(null);
    setIsVerifying(true);
    setHasSearched(true);
    setTxStatus('idle');
    setTxSignature(null);

    // Fast display of the test batch data
    setTimeout(() => {
      setIsVerifying(false);

      // Check if matches primary or alternative
      const found = ALTERNATIVE_BATCHES.find(
        (b) => b.batchNumber.toLowerCase() === codeToTest.toLowerCase() ||
               b.id.toLowerCase() === codeToTest.toLowerCase()
      );

      let targetBatch: DrugBatch;
      if (found) {
        targetBatch = found;
      } else if (codeToTest.toLowerCase() === 'test-fake' || codeToTest.toLowerCase() === 'fake') {
        setCurrentBatch(null);
        setErrorMessage('Партия не зарегистрирована в реестре Solana. Возможен риск контрафакта!');
        return;
      } else {
        // By default on MVP, map to primary verified batch
        targetBatch = {
          ...PRIMARY_BATCH,
          batchNumber: codeToTest.toUpperCase(),
        };
      }

      setCurrentBatch(targetBatch);

      // If Phantom is connected, automatically trigger the real on-chain transaction!
      if (isConnected) {
        triggerOnChainRecord(targetBatch);
      }
    }, 450);
  };

  const handleQrDetected = (detectedCode: string) => {
    setBatchInput(detectedCode);
    handleVerify(detectedCode);
  };

  const handleReset = () => {
    setBatchInput('MP-2026-08421');
    setCurrentBatch(null);
    setHasSearched(false);
    setErrorMessage(null);
    setTxStatus('idle');
    setTxSignature(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar Header */}
      <Header
        address={address}
        shortAddress={shortAddress}
        balanceFormatted={balanceFormatted}
        isConnecting={isConnecting}
        isConnected={isConnected}
        notification={notification}
        onConnect={connect}
        onDisconnect={disconnect}
        onClearNotification={clearNotification}
        onRefreshBalance={refreshBalance}
      />

      {/* Main Single-Screen Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Solana Intensive MVP</span>
            <span className="text-emerald-500/40">·</span>
            <span>Антиконтрафактная система</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            MedTrace
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
            Проверь происхождение лекарства за несколько секунд
          </p>
        </div>

        {/* Central Action & Search Form */}
        <div className="w-full max-w-xl mx-auto mb-10">
          <div className="bg-[#0d131f] border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-xl glow-subtle">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Batch Input Field */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Номер партии (напр. MP-2026-08421)"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVerify();
                  }}
                />
                {/* QR Scanner Icon Button */}
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                  type="button"
                  title="Сканировать QR-код"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {/* Big Main Action Button */}
              <button
                onClick={() => handleVerify()}
                disabled={isVerifying}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#080b11] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                type="button"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#080b11] border-t-transparent rounded-full animate-spin" />
                    <span>Сверка в Solana...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Проверить лекарство</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick helper row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 px-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Тестовый номер:</span>
                <button
                  type="button"
                  onClick={() => {
                    setBatchInput('MP-2026-08421');
                    handleVerify('MP-2026-08421');
                  }}
                  className="font-mono text-emerald-400 hover:underline cursor-pointer"
                >
                  MP-2026-08421
                </button>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                type="button"
              >
                <QrCode className="w-3 h-3 text-emerald-400" />
                <span>Открыть сканер камеры</span>
              </button>
            </div>
          </div>

          {/* Error notice if batch invalid */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Verification Result Card Display */}
        {currentBatch && !isVerifying && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
            <VerificationCard 
              batch={currentBatch} 
              onOpenExplorer={() => setIsExplorerOpen(true)}
            />

            {/* Real Solana Devnet Memo Transaction Card */}
            <OnChainRecordingCard
              status={txStatus}
              signature={txSignature}
              isConnected={isConnected}
              onConnectWallet={connect}
              onRetry={() => currentBatch && triggerOnChainRecord(currentBatch)}
            />

            {/* Quick reset action below the card */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors py-1.5 px-3.5 rounded-lg hover:bg-white/[0.03] cursor-pointer"
                type="button"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Сбросить и проверить другую упаковку</span>
              </button>
            </div>
          </div>
        )}

        {/* User's Successful Records History */}
        <RecordsHistory 
          records={recordsHistory} 
          onClearHistory={handleClearHistory} 
        />

        {/* Initial Empty State / Quick Value Points (shown before first search) */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-2">
            <div className="p-4 rounded-xl bg-[#0d131f]/60 border border-white/[0.05] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white mb-0.5">Неизменяемый реестр</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Партия регистрируется производителем в блокчейне Solana в момент выпуска.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d131f]/60 border border-white/[0.05] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white mb-0.5">Полная цепочка поставки</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Прозрачный маршрут от лаборатории завода до конкретной полки аптеки.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0d131f]/60 border border-white/[0.05] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white mb-0.5">Защита от подделок</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  QR-код привязан к криптографической подписи партии, исключая клонирование.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/[0.06] py-5 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MedTrace</span>
            <span className="text-white/20">·</span>
            <span>Solana Intensive MVP</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Покупатели · Аптеки · Дистрибьюторы</span>
            <span className="text-white/20">·</span>
            <span className="text-emerald-400/90 font-mono">Solana Network</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {currentBatch && (
        <SolanaExplorerModal 
          isOpen={isExplorerOpen} 
          onClose={() => setIsExplorerOpen(false)} 
          batch={currentBatch}
        />
      )}

      <QrScanModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onDetected={handleQrDetected}
      />
    </div>
  );
}
