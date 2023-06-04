import { Button, Switch } from 'antd';
import { useSessionStorage } from 'react-use';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  InputNumber,
  DauInputNumber,
  MemoryInputNumber,
} from './components/InputNumber.component';
// import MemoryCalculationTable from './components/MemoryCalculation.component';
import { calculationService } from './services/calculation.service';

import { SystemUsageMetric } from './types';
import {
  AMOUNT_METRIC_MAP,
  MEMORY_METRIC_MAP,
} from './constants/metric.constants';

const DEFAULT_SYSTEM_USAGE_METRICS: Record<SystemUsageMetric, number> = {
  dau: AMOUNT_METRIC_MAP.M,
  reads: 10,
  writes: 1,
};

// TODO: move to utils
const reset = () => {
  location.reload();
  localStorage.clear();
  sessionStorage.clear();
};

function App() {
  const [isStrictMode, setIsStrictMode] = useSessionStorage(
    'isStrictMode',
    true
  );
  const [metrics, setMetrics] = useSessionStorage(
    'SystemUsageMetrics',
    DEFAULT_SYSTEM_USAGE_METRICS
  );

  useEffect(() => {
    calculationService.isStrictMode = isStrictMode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: SystemUsageMetric) => (value: number | null) => {
    setMetrics({
      ...metrics,
      [key]: value,
    });
  };
  const handleSwitchChange = useCallback((value: boolean) => {
    setIsStrictMode(value);
    calculationService.isStrictMode = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rps = calculationService.formatUnits(
    calculationService.getRps(metrics.dau * (metrics.reads + metrics.writes))
  );

  return (
    <>
      Strict mode:{' '}
      <Switch
        checkedChildren="😎"
        unCheckedChildren="🤤"
        checked={isStrictMode}
        onChange={handleSwitchChange}
      />
      <DauInputNumber
        addonBefore="DAU"
        value={metrics.dau}
        onChange={handleChange(SystemUsageMetric.DAU)}
      />
      <InputNumber
        min={1}
        value={metrics.reads}
        addonBefore="READS per user"
        onChange={handleChange(SystemUsageMetric.READS)}
      />
      <InputNumber
        min={0}
        value={metrics.writes}
        addonBefore="WRITES per user"
        onChange={handleChange(SystemUsageMetric.WRITES)}
      />
      {rps} RPS
      <MemoryCalculationTable wps={metrics.dau * metrics.writes} />
      <Button onClick={reset}>Reset</Button>
    </>
  );
}

const MemoryCalculationTable = ({ wps }: { wps: number }) => {
  const [totalMemoryEntityAmount, setTotalMemoryEntityAmount] =
    useSessionStorage<number | null>('temp', MEMORY_METRIC_MAP.MB);
  const memory = useMemo(
    () =>
      totalMemoryEntityAmount
        ? calculationService.formatMemory(wps * totalMemoryEntityAmount)
        : 0,
    [totalMemoryEntityAmount, wps]
  );
  // const memoryWithReplication = useMemo(
  //   () => calculationService.getMemoryWithReplication(wps),
  //   [wps]
  // );

  return (
    <>
      <MemoryInputNumber
        value={totalMemoryEntityAmount}
        onChange={setTotalMemoryEntityAmount}
      />
      {memory}
    </>
  );
};

export default App;
