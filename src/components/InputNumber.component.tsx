import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'react-use';
import {
  InputNumber as AntdInputNumber,
  Select,
  InputNumberProps as AntdInputNumberProps,
} from 'antd';
import {
  AMOUNT_METRIC_MAP,
  AmountMetric,
  MEMORY_METRIC_MAP,
  MemoryUnit,
} from '../constants/metric.constants';

const { Option } = Select;

type InputNumberProps = AntdInputNumberProps<number>;

export const InputNumber: React.FC<InputNumberProps> = React.memo(props => {
  return <AntdInputNumber size="large" type="number" {...props} />;
});

export const withMetricSelect = (
  InputComponent: React.FC<InputNumberProps>,
  {
    metricMap,
    defaultMetricKey,
    persistKey,
  }: {
    metricMap: Record<string, number>;
    defaultMetricKey: keyof typeof metricMap;
    persistKey?: string;
  }
) => {
  return ({ min = 1, ...props }: InputNumberProps) => {
    const [persistMetric, setPersistMetric] = useSessionStorage<number>(
      persistKey || ' ',
      metricMap[defaultMetricKey]
    );
    const [metric, setMetric] = useState<number>(
      persistKey ? persistMetric : metricMap[defaultMetricKey]
    );
    const [value, setValue] = useState<number | null>(
      (props.value || 0) / metric
    );

    const handleSelect = useCallback((metric: number) => {
      setMetric(metric);
      if (persistKey) setPersistMetric(metric);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      props.onChange?.((value || 0) * metric);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, metric]);

    const selectAfter = useMemo(
      () => (
        <Select value={metric} style={{ width: 70 }} onChange={handleSelect}>
          {Object.entries(metricMap).map(([key, value]) => (
            <Option value={value} key={key}>
              {key}
            </Option>
          ))}
        </Select>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [metric]
    );

    return (
      <InputComponent
        {...props}
        min={min}
        value={value}
        addonAfter={selectAfter}
        onChange={setValue}
      />
    );
  };
};

export const DauInputNumber = withMetricSelect(InputNumber, {
  metricMap: AMOUNT_METRIC_MAP,
  defaultMetricKey: AmountMetric.M,
  persistKey: 'DauMetric',
});

export const MemoryInputNumber = withMetricSelect(InputNumber, {
  metricMap: MEMORY_METRIC_MAP,
  defaultMetricKey: MemoryUnit.MB,
  persistKey: 'EntityMetric',
});
