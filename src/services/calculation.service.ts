import {
  MemoryUnit,
  MEMORY_UNITS,
  SECONDS_IN_DAY,
  MEMORY_METRIC_MAP,
  AMOUNT_METRIC_MAP,
  AmountMetric,
  AMOUNT_UNITS,
} from '../constants/metric.constants';

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
    const rps = reqAmount / this.secondsInDay;

    return this.isStrictMode ? rps : Math.round(rps);
  };

  formatMemory = (value: number): string => {
    let unitIndex = 0;

    while (
      value >= MEMORY_METRIC_MAP[MemoryUnit.KB] &&
      unitIndex < MEMORY_UNITS.length - 1
    ) {
      value /= MEMORY_METRIC_MAP[MemoryUnit.KB];
      unitIndex++;
    }

    return `${value}${MEMORY_UNITS[unitIndex]}`;
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

    return `${value}${AMOUNT_UNITS[unitIndex]}`;
  };
}

export const calculationService = new CalculationService();
