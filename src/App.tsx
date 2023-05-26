import { Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import {
  InputNumber,
  MetricInputNumber,
} from './components/InputNumber.component';
import { calculationService } from './services/calculation.service';

import { MetricDefinition, Metrics } from './types';

function App() {
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [metrics, setMetrics] = useState<
    { [MetricDefinition.DAU]: number } & Metrics
  >({
    dau: 1,
    reads: 1,
    writes: 0,
  });

  useEffect(() => {
    if (isStrictMode !== calculationService.isStrictMode) {
      calculationService.isStrictMode = isStrictMode;
    }
  }, [isStrictMode]);

  const handleChange = (key: MetricDefinition) => (value: number) => {
    setMetrics({
      ...metrics,
      [key]: value,
    });
  };

  const rps = useMemo(() => {
    return calculationService.getRps({
      reads: metrics.dau * metrics.reads,
      writes: metrics.dau * metrics.writes,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, isStrictMode]);

  return (
    <>
      Strict mode:{' '}
      <Switch
        checkedChildren="😎"
        unCheckedChildren="🤤"
        checked={isStrictMode}
        onChange={setIsStrictMode}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MetricInputNumber
          addonBefore="DAU"
          value={metrics.dau}
          onChange={handleChange(MetricDefinition.DAU)}
        />
        <InputNumber
          addonBefore="Reads/user"
          value={metrics.reads}
          onChange={handleChange(MetricDefinition.READS)}
        />
        <InputNumber
          addonBefore="Writes/user"
          value={metrics.writes}
          onChange={handleChange(MetricDefinition.WRITES)}
        />
        {rps} RPS
      </div>
    </>
  );
}

export default App;
