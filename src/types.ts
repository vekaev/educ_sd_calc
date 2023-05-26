export enum SystemUsageMetric {
  READS = 'reads',
  WRITES = 'writes',
  DAU = 'dau',
}

export interface Metrics {
  [SystemUsageMetric.READS]: number;
  [SystemUsageMetric.WRITES]: number;
}
