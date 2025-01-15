import { ConfigProvider, List, ListProps } from "antd";

function CustomList<T>(props: CustomListProps<T>) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: props.fontSize ?? 14,
        },
      }}
    >
      <List {...props} />
    </ConfigProvider>
  );
}
CustomList.Item = List.Item;

export default CustomList;

type CustomListProps<T> = ListProps<T> & {
  fontSize?: number;
};
