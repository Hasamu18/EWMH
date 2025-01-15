import { PieChart } from "../../../components/charts";
import { useDashboard } from "../../../hooks/useDashboard";

export function RevenueChart() {
  const { state } = useDashboard();

  return (
    <>
      <div className="mb-10 flex gap-10 text-sm font-semibold">
        {state.revenueChart.values.labelValues.map((item: any) => (
          <div key={item.name}>
            <span className="text-gray-400">{item.name}</span>
            <span className="ml-2 text-gray-700">{item.value}</span>
          </div>
        ))}
      </div>
      <PieChart
        data={state.revenueChart.values.chartValues}
        loading={state.isFetching}
      />
    </>
  );
}
