import { ColumnChart } from "../../../components/charts";
import { useDashboard } from "../../../hooks/useDashboard";
import { useSpecialUI } from "../../../hooks/useSpecialUI";

export function NetGainChart() {
  const { state } = useDashboard();
  const { state: specialUIState } = useSpecialUI();

  return (
    <div>
      {/* <div className="mb-10 text-sm font-semibold">
        Tổng cộng: {formatCurrency(state.netGainChart.total)}
      </div> */}
      <ColumnChart
        data={state.netGainChart.values.chartValues}
        loading={specialUIState.isLoading}
      />
    </div>
  );
}
