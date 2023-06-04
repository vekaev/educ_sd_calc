export const SECONDS_IN_DAY = 86400;

export enum MemoryUnit {
  B = 'B',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
  PB = 'PB',
}

export const MEMORY_UNITS = Object.values(MemoryUnit);

export const MEMORY_METRIC_MAP = {
  [MemoryUnit.B]: 1,
  [MemoryUnit.KB]: Math.pow(2, 10),
  [MemoryUnit.MB]: Math.pow(2, 20),
  [MemoryUnit.GB]: Math.pow(2, 30),
  [MemoryUnit.TB]: Math.pow(2, 40),
  [MemoryUnit.PB]: Math.pow(2, 50),
};

export enum AmountMetric {
  ' ' = '',
  K = 'K',
  M = 'M',
  B = 'B',
  T = 'T',
  P = 'P',
}

export const AMOUNT_UNITS = Object.values(AmountMetric);

export const AMOUNT_METRIC_MAP = {
  ' ': 1,
  [AmountMetric.K]: Math.pow(10, 3),
  [AmountMetric.M]: Math.pow(10, 6),
  [AmountMetric.B]: Math.pow(10, 9),
  [AmountMetric.T]: Math.pow(10, 12),
  [AmountMetric.P]: Math.pow(10, 15),
};
