export interface SupplyChainStep {
  id: string;
  role: 'Производитель' | 'Дистрибьютор' | 'Аптека' | 'Покупатель';
  entity: string;
  location: string;
  date: string;
  status: string;
  txHash: string;
  completed: boolean;
  notes?: string;
}

export interface DrugBatch {
  id: string;
  batchNumber: string;
  name: string;
  dosage: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate: string;
  lastPoint: string;
  blockchainId: string;
  fullSignature: string;
  verified: boolean;
  network: string;
  chainSteps: SupplyChainStep[];
  registrationStandard: string;
  storageConditions: string;
}

export interface BlockchainRecord {
  id: string;
  drugName: string;
  batchId: string;
  status: string; // 'VERIFIED'
  timestamp: string;
  signature: string;
  explorerUrl: string;
  custodian: string;
  manufacturer: string;
}

