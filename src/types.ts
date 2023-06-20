export enum SystemUsageMetric {
  DAU = 'dau',
  READS = 'reads',
  WRITES = 'writes',
}

export interface Metrics {
  [SystemUsageMetric.READS]: number;
  [SystemUsageMetric.WRITES]: number;
}

export type MetricMap<T> = {
  [K in keyof T]: number;
};