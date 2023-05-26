import { Metrics } from '../types';

const SECONDS_IN_DAY = 86400;

class CalculationService {
  secondsInDay = SECONDS_IN_DAY;

  get isStrictMode(): boolean {
    return this.secondsInDay === SECONDS_IN_DAY;
  }

  set isStrictMode(isStrict: boolean) {
    this.secondsInDay = isStrict ? SECONDS_IN_DAY : 100000;
  }

  getRps = (metrics: Metrics): number => {
    return (metrics.reads + metrics.writes) / this.secondsInDay;
  };
}

export const calculationService = new CalculationService();
