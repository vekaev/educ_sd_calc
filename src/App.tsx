import { Switch } from 'antd';
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

function App() {
  const [isStrictMode, setIsStrictMode] = useLocalStorage(
    'isStrictMode',
    false
  );
  const [metrics, setMetrics] = useLocalStorage<
    Record<SystemUsageMetric, number>
  >('SystemUsageMetrics', {
    dau: AMOUNT_METRIC_MAP.M,
    reads: 10,
    writes: 1,
  });

  useEffect(() => {
    calculationService.isStrictMode = isStrictMode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (key: SystemUsageMetric) => (value: number | null) => {
      if (value === null) return;

      setMetrics(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSwitchChange = useCallback((value: boolean) => {
    setIsStrictMode(value);
    calculationService.isStrictMode = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    </>
  );
}

export default App;
