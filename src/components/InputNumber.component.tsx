import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import {
  InputNumber as AntdInputNumber,
  Select,
  InputNumberProps as AntdInputNumberProps,
} from 'antd';

const { Option } = Select;

type InputNumberProps = AntdInputNumberProps<number>;

export const InputNumber: React.FC<InputNumberProps> = React.memo(props => {
  return <AntdInputNumber size="large" type="number" {...props} />;
});

enum MetricDefinition {
  K = 'K',
  M = 'M',
  B = 'B',
  T = 'T',
}

export const AMOUNT_METRIC_MAP = {
  '-': 1,
  [MetricDefinition.K]: Math.pow(10, 3),
  [MetricDefinition.M]: Math.pow(10, 6),
  [MetricDefinition.B]: Math.pow(10, 9),
  [MetricDefinition.T]: Math.pow(10, 12),
};

export const withMetricDefinition = (
  InputComponent: React.FC<InputNumberProps>,
  defaultMetric = AMOUNT_METRIC_MAP[MetricDefinition.M],
  persistKey?: string
) => {
  return ({ min = 1, ...props }: InputNumberProps) => {
    const [persistMetric, setPersistMetric] = useLocalStorage<number>(
      persistKey || ' ',
      defaultMetric
    );
    const [metric, setMetric] = useState<number>(
      persistKey ? persistMetric : defaultMetric
    );
    const [value, setValue] = useState<number | null>(
      (props.value || 0) / metric
    );

    useEffect(() => {
      props.onChange?.((value || 0) * metric);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, metric]);

    const selectAfter = useMemo(
      () => (
        <Select
          value={metric}
          style={{ width: 60 }}
          onChange={metric => {
            setMetric(metric);
            setPersistMetric(metric);
          }}
        >
          {Object.entries(AMOUNT_METRIC_MAP).map(([key, value]) => (
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
