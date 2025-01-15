import { ColumnChart } from "../../../components/charts";
import { useDashboard } from "../../../hooks/useDashboard";

export function NetGainByMonthChart() {
  const { state: dashboardState } = useDashboard();

  return (
    <div>
      <ColumnChart
        data={dashboardState.revenueByMonthChart.values.chartValues}
        loading={dashboardState.isFetching}
      />
    </div>
  );
}
