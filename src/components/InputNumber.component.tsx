import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  InputNumber as AntdInputNumber,
  Select,
  InputNumberProps as AntdInputNumberProps,
} from 'antd';

const { Option } = Select;

interface InputNumberProps
  extends Omit<AntdInputNumberProps<number>, 'onChange'> {
  onChange?: (value: number) => void;
}

export const InputNumber: React.FC<InputNumberProps> = React.memo(
  ({ onChange, ...props }) => {
    const handleChange = useCallback(
      (value: number | null) => onChange?.(value || 0),
      [onChange]
    );

    return (
      <AntdInputNumber
        min={0}
        size="large"
        type="number"
        defaultValue={0}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

enum MetricDefinition {
  K = 'K',
  M = 'M',
  B = 'B',
  T = 'T',
}

const METRIC_MAP = {
  '-': 1,
  [MetricDefinition.K]: Math.pow(10, 3),
  [MetricDefinition.M]: Math.pow(10, 6),
  [MetricDefinition.B]: Math.pow(10, 9),
  [MetricDefinition.T]: Math.pow(10, 12),
};

const withMetric = (
  InputComponent: React.FC<InputNumberProps>,
  defaultMetric = METRIC_MAP[MetricDefinition.M]
) => {
  return ({ ...props }: InputNumberProps) => {
    const [value, setValue] = useState<number>(props.value || 0);
    const [metric, setMetric] = useState<number>(defaultMetric);

    useEffect(() => {
      props.onChange?.(value * metric);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, metric]);

    const selectAfter = useMemo(
      () => (
        <Select value={metric} style={{ width: 60 }} onChange={setMetric}>
          {Object.entries(METRIC_MAP).map(([key, value]) => (
            <Option value={value} key={key}>
              {key}
            </Option>
          ))}
        </Select>
      ),
      [metric]
    );

    return (
      <InputComponent
        {...props}
        value={value}
        addonAfter={selectAfter}
        onChange={setValue}
      />
    );
  };
};

export const MetricInputNumber = withMetric(InputNumber);
