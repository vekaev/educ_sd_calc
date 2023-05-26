export enum MetricDefinition {
    READS = 'reads',
    WRITES = 'writes',
    DAU = 'dau',
}

export interface Metrics {
  [MetricDefinition.READS]: number;
  [MetricDefinition.WRITES]: number;
}
