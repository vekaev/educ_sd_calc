import { Button, Switch } from 'antd';
import { useLocalStorage } from 'react-use';
import { useMemo, useCallback, useEffect } from 'react';

import {
  InputNumber,
  AMOUNT_METRIC_MAP,
  withMetricDefinition,
} from './components/InputNumber.component';
// import MemoryCalculationTable from './components/MemoryCalculation.component';
import { calculationService } from './services/calculation.service';

import { SystemUsageMetric } from './types';

const DauInputNumber = withMetricDefinition(
  InputNumber,
  AMOUNT_METRIC_MAP.M,
  'DauMetric'
);

const DEFAULT_SYSTEM_USAGE_METRICS: Record<SystemUsageMetric, number> = {
  dau: AMOUNT_METRIC_MAP.M,
  reads: 10,
  writes: 1,
};

function App() {
  const [isStrictMode, setIsStrictMode] = useLocalStorage(
    'isStrictMode',
    false
  );
  const [metrics, setMetrics] = useLocalStorage(
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
  const handleReset = useCallback(() => {
    location.reload();
    localStorage.clear();
  }, []);
  const rps = useMemo(
    () =>
      (isStrictMode ? '' : '~ ') +
      calculationService.getRps(metrics.dau * (metrics.reads + metrics.writes)),
    [isStrictMode, metrics]
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
      {/* <MemoryCalculationTable /> */}
      <Button onClick={handleReset}>Reset</Button>
    </>
  );
}

export default App;
