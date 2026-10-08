import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl
} from '@solana/web3.js';
import { DrugBatch } from '../types';

// Standard Solana Memo Program v2
export const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export interface RecordResult {
  success: boolean;
  signature?: string;
  cancelled?: boolean;
  errorMessage?: string;
}

export async function sendDrugVerificationMemo(
  provider: any,
  batch: DrugBatch
): Promise<RecordResult> {
  if (!provider || !provider.publicKey) {
    return {
      success: false,
      errorMessage: 'Кошелёк Phantom не подключён.'
    };
  }

  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const userPubKey = new PublicKey(provider.publicKey.toString());

    // Prepare memo string according to strict specification:
    // MEDTRACE | batch_id: MP-2026-08421 | drug: Amoxicillin 500 mg | manufacturer: MedPharm | status: VERIFIED | custodian: Аптека №24
    const memoText = `MEDTRACE | batch_id: ${batch.batchNumber} | drug: ${batch.name} | manufacturer: ${batch.manufacturer} | status: VERIFIED | custodian: ${batch.lastPoint}`;

    // Use TextEncoder, not Buffer
    const memoData = new TextEncoder().encode(memoText);

    // Build memo instruction using TextEncoder encoded data
    const instruction = new TransactionInstruction({
      keys: [{ pubkey: userPubKey, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: memoData as any
    });

    const transaction = new Transaction().add(instruction);
    transaction.feePayer = userPubKey;

    const latestBlockhash = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // Sign and send transaction through Phantom wallet
    let txSignature: string;
    if (typeof provider.signAndSendTransaction === 'function') {
      const resp = await provider.signAndSendTransaction(transaction);
      txSignature = typeof resp === 'string' ? resp : resp.signature;
    } else if (typeof provider.signTransaction === 'function') {
      const signedTx = await provider.signTransaction(transaction);
      txSignature = await connection.sendRawTransaction(signedTx.serialize());
    } else {
      throw new Error('Метод отправки транзакции не поддерживается провайдером');
    }

    // Wait for confirmation on Devnet
    await connection.confirmTransaction(
      {
        signature: txSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      },
      'confirmed'
    );

    return {
      success: true,
      signature: txSignature
    };
  } catch (err: any) {
    // Check if user rejected the transaction
    const errMsg = err?.message || '';
    const errCode = err?.code;
    const isCancelled =
      errCode === 4001 ||
      errMsg.toLowerCase().includes('user rejected') ||
      errMsg.toLowerCase().includes('cancelled') ||
      errMsg.toLowerCase().includes('rejected');

    if (isCancelled) {
      return {
        success: false,
        cancelled: true,
        errorMessage: 'Транзакция отменена пользователем.'
      };
    }

    return {
      success: false,
      cancelled: false,
      errorMessage: 'Не удалось записать проверку в блокчейн. Попробуйте ещё раз.'
    };
  }
}
