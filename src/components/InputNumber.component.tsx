import { useEffect, useState } from 'react';
import {
  Select,
  InputNumber as AntdInputNumber,
  InputNumberProps as AntdInputNumberProps,
} from 'antd';

import { MetricMap } from '../types';
import { calculationService } from '../services/calculation.service';

type InputNumberProps = AntdInputNumberProps<number>;

export function InputNumber(props: InputNumberProps) {
  return <AntdInputNumber size="large" type="number" {...props} />;
}

export function InputWithMetricSelect<T extends MetricMap<T>>({
  value,
  onChange,
  metricMap,
  ...props
}: {
  metricMap: T;
  value: number;
  onChange: (value: number) => void;
  // defaultMetricKey: keyof T;
} & Omit<InputNumberProps, 'onChange'>) {
  const [metric, setMetric] = useState<number>(() =>
    calculationService.getMetricValue(value, metricMap)
  );
  const [_value, setValue] = useState<number | null>(() =>
    Math.ceil(value / metric)
  );
  useEffect(() => {
    onChange((_value || 0) * metric);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value, metric]);

  return (
    <InputNumber
      {...props}
      value={_value}
      onChange={setValue}
      addonAfter={
        <Select value={metric} style={{ width: 70 }} onChange={setMetric}>
          {Object.entries(metricMap).map(([key, value]) => (
            <Select.Option value={value} key={key}>
              {key}
            </Select.Option>
          ))}
        </Select>
      }
    />
  );
}
