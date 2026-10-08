import { DrugBatch } from '../types';

export const PRIMARY_BATCH: DrugBatch = {
  id: 'amoxicillin-500',
  batchNumber: 'MP-2026-08421',
  name: 'Amoxicillin 500 mg',
  dosage: '500 мг (капсулы)',
  manufacturer: 'MedPharm',
  manufactureDate: '12.09.2026',
  expiryDate: '12.09.2028',
  lastPoint: 'Аптека №24',
  blockchainId: '7xK…9F2',
  fullSignature: '7xKy8M4vW2Pq9F2eA1cT8hJ5bN6mZ3rX4uV7dE2sK9F2',
  verified: true,
  network: 'Solana Devnet',
  registrationStandard: 'GMP EU / ISO 13485',
  storageConditions: '+15°C … +25°C, в сухом месте',
  chainSteps: [
    {
      id: 'step-1',
      role: 'Производитель',
      entity: 'MedPharm',
      location: 'Завод MedPharm, цех №3',
      date: '12.09.2026',
      status: 'Выпуск партии и запись в реестр Solana',
      txHash: '5tP…3k1',
      completed: true,
      notes: 'Спецификация партии сертифицирована. QR-код криптографически закреплён за серией.'
    },
    {
      id: 'step-2',
      role: 'Дистрибьютор',
      entity: 'ФармЛогистик Центр',
      location: 'Хаб «Северный», склад класса А',
      date: '18.09.2026',
      status: 'Контроль холодовой цепи и приёмка партии',
      txHash: '3wQ…8m9',
      completed: true,
      notes: 'Датчики температуры подтвердили соблюдение регламента +18.4°C.'
    },
    {
      id: 'step-3',
      role: 'Аптека',
      entity: 'Аптека №24',
      location: 'г. Алматы / ул. Достык, 89',
      date: '25.09.2026',
      status: 'Входной контроль и размещение на витрине',
      txHash: '9aR…1p0',
      completed: true,
      notes: 'Упаковки промаркированы, партия допущена к розничной реализации.'
    },
    {
      id: 'step-4',
      role: 'Покупатель',
      entity: 'Конечный потребитель',
      location: 'Сканирование при покупке',
      date: 'Сегодня',
      status: 'Проверка подлинности перед приёмом',
      txHash: '7xK…9F2',
      completed: true,
      notes: 'Оригинальная упаковка подтверждена. Риск фальсификата 0%.'
    }
  ]
};

export const ALTERNATIVE_BATCHES: DrugBatch[] = [
  PRIMARY_BATCH,
  {
    id: 'paracetamol-500',
    batchNumber: 'PC-2026-09142',
    name: 'Paracetamol 500 mg',
    dosage: '500 мг (таблетки)',
    manufacturer: 'Biolab Pharma',
    manufactureDate: '01.08.2026',
    expiryDate: '01.08.2029',
    lastPoint: 'Аптека «Биосфера»',
    blockchainId: '4mB…8d1',
    fullSignature: '4mBq2W1nK8v9xP3zL0rT5uY7eJ6aC8sD2fG4hM9kL8d1',
    verified: true,
    network: 'Solana Devnet',
    registrationStandard: 'GMP / WHO Certificate',
    storageConditions: 'Не выше +25°C',
    chainSteps: [
      {
        id: 'step-1',
        role: 'Производитель',
        entity: 'Biolab Pharma',
        location: 'Производственный комплекс №1',
        date: '01.08.2026',
        status: 'Партия выпущена и зафиксирована',
        txHash: '2bX…4k9',
        completed: true
      },
      {
        id: 'step-2',
        role: 'Дистрибьютор',
        entity: 'МедТрейд Логистика',
        location: 'Центральный распределительный центр',
        date: '10.08.2026',
        status: 'Логистическая верификация',
        txHash: '7yN…2w4',
        completed: true
      },
      {
        id: 'step-3',
        role: 'Аптека',
        entity: 'Аптека «Биосфера»',
        location: 'г. Астана, пр. Республики, 12',
        date: '19.08.2026',
        status: 'Финальная точка цепочки поставок',
        txHash: '1aK…5v7',
        completed: true
      },
      {
        id: 'step-4',
        role: 'Покупатель',
        entity: 'Покупатель',
        location: 'Верификация смартфона',
        date: 'Сегодня',
        status: 'Подтверждено в сети Solana',
        txHash: '4mB…8d1',
        completed: true
      }
    ]
  }
];
