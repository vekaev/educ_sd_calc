import React, { useCallback, useEffect, useMemo } from 'react';

import { Button, Switch } from 'antd';
import { useLocalStorage } from 'react-use';

// interface Tables {
//   persons: {
//     id: string;
//     name: string
//   },
//   animals: {
//     createdAt: Date
//     name: string
//   }
// }

// type V<Keys> = {
//   [K]
// }

// type MetricMap<T> = {
//   [K in keyof T]: number;
// };

// declare function select<
//   TableName extends keyof Tables,
//   Keys extends keyof Tables[TableName]
// >(tableName: TableName, keys: Keys[]): Tables[TableName];

// const a = select('animals', ['createdAt'])

import {
  InputNumber,
  InputWithMetricSelect,
} from './components/InputNumber.component';
import { calculationService } from './services/calculation.service';

import { Metrics, SystemUsageMetric } from './types';
import {
  AMOUNT_METRIC_MAP,
  MEMORY_METRIC_MAP,
} from './constants/metric.constants';

const DEFAULT_SYSTEM_USAGE_METRICS: Metrics & {
  dau: number;
} = {
  dau: 1 * AMOUNT_METRIC_MAP.M,
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
  }, [isStrictMode]);

  const handleChange = (key: SystemUsageMetric) => (value: number | null) => {
    setMetrics({
      ...metrics,
      [key]: value,
    });
  };

  const rps = calculationService.formatUnits(
    calculationService.getRps(metrics.dau * (metrics.reads + metrics.writes))
  );

  const handleSwitchChange = (value: boolean) => {
    setIsStrictMode(value);
    // TODO: fix later
    // calculationService.isStrictMode = value;
  };

  return (
    <>
      Strict mode:{' '}
      <Switch
        checkedChildren="😎"
        unCheckedChildren="🤤"
        checked={isStrictMode}
        onChange={handleSwitchChange}
      />
      <InputWithMetricSelect
        addonBefore="DAU"
        value={metrics.dau}
        metricMap={AMOUNT_METRIC_MAP}
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

function MemoryCalculationTable({ wps }: { wps: number }) {
  const [totalMemory, setTotalMemory] = useLocalStorage<number>(
    'temp',
    1 * MEMORY_METRIC_MAP.MB
  );
  const [memoryPerDay, memoryPerMonth, memoryPerYear] = [
    calculationService.getValueWithMemoryUnits(wps * totalMemory),
    calculationService.getValueWithMemoryUnits(wps * totalMemory * 30),
    calculationService.getValueWithMemoryUnits(wps * totalMemory * 365),
  ];

  return (
    <>
      <InputWithMetricSelect
        value={totalMemory}
        onChange={setTotalMemory}
        metricMap={MEMORY_METRIC_MAP}
      />
      <p>Day: {memoryPerDay}</p>
      <p>Month: {memoryPerMonth}</p>
      <p>Year: {memoryPerYear}</p>
    </>
  );
}

export default App;
