import { ConfigProvider, Table, TableProps } from "antd";

function CustomTable<T extends object>({
  fontSize,
  ...rest
}: CustomTableProps<T>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            cellFontSize: fontSize ?? 17,
            headerBg: "#4CC9C7",
            headerColor: "#fff",
            headerSortActiveBg: "#52d9d7",
            headerSortHoverBg: "#52d9d7",
          },
        },
      }}
    >
      <Table<T> {...rest} />
    </ConfigProvider>
  );
}

export default CustomTable;

type CustomTableProps<T> = TableProps<T> & {
  fontSize?: number;
};
