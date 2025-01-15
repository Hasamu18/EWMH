import { Column } from "@ant-design/plots";
import { ColumnChartValue } from "../../models/chart";

function ColumnChart({ data, loading }: ColumnChartProps) {
  const config = {
    data,
    xField: "x",
    yField: "y",
    colorField: "name",
    group: true,
  };

  return <Column {...config} loading={loading} />;
}

type ColumnChartProps = {
  data: ColumnChartValue | ColumnChartValue[];
  loading?: boolean;
};

export default ColumnChart;
