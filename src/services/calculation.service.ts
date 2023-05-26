const SECONDS_IN_DAY = 86400;

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
}

export const calculationService = new CalculationService();
