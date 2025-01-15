import { Pie } from "@ant-design/plots";
import { PieChartValue } from "../../models/chart";

function PieChart({ data, loading }: PieChartProps) {
  const config = {
    data,
    angleField: "value",
    colorField: "name",
    interaction: {
      elementHighlight: true,
    },
    state: {
      inactive: { opacity: 0.5 },
    },
    label: {
      text: ({ name, value }: PieChartValue) => {
        return `${name} (${value}%)`;
      },
      position: "spider",
      fontSize: 17,
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      title: "name",
    },
  };

  return <Pie {...config} loading={loading} />;
}

type PieChartProps = {
  data: PieChartValue[];
  loading?: boolean;
};

export default PieChart;
