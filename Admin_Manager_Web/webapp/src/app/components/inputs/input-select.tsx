import { Select, SelectProps, Spin } from "antd";
import { useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";

export function CustomSelect(props: CustomSelectProps) {
  return (
    <Select
      optionFilterProp="label"
      showSearch
      allowClear
      notFoundContent={props.loading ? <Spin size="small" /> : null}
      {...props}
    />
  );
}

export function CustomSelectTag(props: CustomSelectProps) {
  return (
    <Select
      optionFilterProp="label"
      showSearch
      mode="multiple"
      allowClear
      notFoundContent={props.loading ? <Spin size="small" /> : null}
      {...props}
    />
  );
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

CustomSelect.Tag = CustomSelectTag;
CustomSelect.Debounce = DebounceSelect;

export default CustomSelect;

type CustomSelectProps = Omit<SelectProps, "style">;
type DebounceSelectProps<ValueType = any> = Omit<
  SelectProps<ValueType | ValueType[]>,
  "options" | "children"
> & {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
};
