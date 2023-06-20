import {
  MemoryUnit,
  MEMORY_UNITS,
  SECONDS_IN_DAY,
  MEMORY_METRIC_MAP,
  AMOUNT_METRIC_MAP,
  AmountMetric,
  AMOUNT_UNITS,
} from '../constants/metric.constants';
import { MetricMap } from '../types';

export class CalculationService {
  secondsInDay = SECONDS_IN_DAY;

  constructor(isStrictMode?: boolean) {
    if (isStrictMode !== undefined) this.isStrictMode = isStrictMode;
  }

  get isStrictMode(): boolean {
    return this.secondsInDay === SECONDS_IN_DAY;
  }

  set isStrictMode(isStrict: boolean) {
    this.secondsInDay = isStrict ? SECONDS_IN_DAY : 100000;
  }

  getRps = (reqAmount: number): number => {
    return this.formatValue(reqAmount / this.secondsInDay);
  };

  formatValue = (value: number): number => {
    return this.isStrictMode ? value : Math.round(value);
  };

  getValueWithMemoryUnits = (value: number): string => {
    let unitIndex = 0;

    while (
      value >= MEMORY_METRIC_MAP[MemoryUnit.KB] &&
      unitIndex < MEMORY_UNITS.length - 1
    ) {
      value /= MEMORY_METRIC_MAP[MemoryUnit.KB];
      unitIndex++;
    }

    return `${this.formatValue(value)} ${MEMORY_UNITS[unitIndex]}`;
  };

  formatUnits = (value: number): string => {
    let unitIndex = 0;

    while (
      value >= AMOUNT_METRIC_MAP[AmountMetric.K] &&
      unitIndex < AMOUNT_UNITS.length - 1
    ) {
      value /= AMOUNT_METRIC_MAP[AmountMetric.K];
      unitIndex++;
    }

    return `${this.formatValue(value)} ${AMOUNT_UNITS[unitIndex]}`;
  };

  getMetricValue = <T extends MetricMap<T>>(
    value: number,
    metricMap: T
  ): number => {
    let result = 1;

    for (const key in metricMap) {
      if (metricMap[key] > value) break;

      result = metricMap[key];
    }

    return result;
  };
}

export const calculationService = new CalculationService(false);
