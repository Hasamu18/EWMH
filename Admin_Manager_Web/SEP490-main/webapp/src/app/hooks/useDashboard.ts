import { App } from "antd";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  getStatistics,
  GetStatisticsParams,
  setRevenueChart,
  setNetGainChart,
  setExtraStats,
  getStatisticsByMonth,
  GetStatisticsByMonthParams,
  setRevenueByMonthChart,
} from "../redux/slice/dashboardSlice";
import { ColumnChartValue, PieChartValue } from "../models/chart";

export function useDashboard() {
  const { notification } = App.useApp();
  const state = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const handleGetStatistics = useCallback(
    async (value: GetStatisticsParams) => {
      const resultAction = await dispatch(getStatistics(value));
      if (getStatistics.fulfilled.match(resultAction)) {
        //Pie Chart
        const revenueChart: PieChartValue[] = resultAction.payload[0]
          .map((item: any) => {
            if (item.x === new Date().getFullYear()) {
              return {
                name: item.name,
                value: item.z,
              };
            }
            return null;
          })
          .filter((item: any) => item !== null);

        const revenueLabelValues: PieChartValue[] = resultAction.payload[0]
          .map((item: any) => {
            if (item.x === new Date().getFullYear()) {
              return {
                name: item.name,
                value: item.u,
              };
            }
            return null;
          })
          .filter((item: any) => item !== null);

        //Column Chart
        const netGainChart: ColumnChartValue[] = resultAction.payload[0].map(
          (item: any) => {
            return {
              name: item.name,
              x: item.x,
              y: item.y,
            };
          },
        );

        dispatch(
          setRevenueChart({
            values: {
              chartValues: revenueChart,
              labelValues: revenueLabelValues,
            },
            total: resultAction.payload[0].map((item: any) => {
              if (item.x === new Date().getFullYear()) {
                return {
                  total: item.v,
                };
              }
              return null;
            })[0]?.total,
          }),
        );
        dispatch(
          setNetGainChart({
            values: { chartValues: netGainChart, labelValues: [] },
            total: resultAction.payload[0].map((item: any) => {
              if (item.x === new Date().getFullYear()) {
                return {
                  total: item.r,
                };
              }
              return null;
            })[0]?.total,
          }),
        );
        dispatch(setExtraStats(resultAction.payload[1]));
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  const handleGetStatisticsByMonth = useCallback(
    async (value: GetStatisticsByMonthParams) => {
      const resultAction = await dispatch(getStatisticsByMonth(value));
      if (getStatisticsByMonth.fulfilled.match(resultAction)) {
        dispatch(
          setRevenueByMonthChart({
            values: {
              chartValues: (resultAction.payload as GetStatisticsByMonthResult)
                .map((resultByMonth) =>
                  Object.values(resultByMonth.result).map((data) => ({
                    name: data.name,
                    x: `${data.x.month} - ${data.x.year}`,
                    y: data.y,
                  })),
                )
                .flat()
                .reverse(),
            },
            total: 0,
          }),
        );
      } else {
        if (resultAction.payload) {
          notification.error({
            message: "Lỗi",
            description: `${resultAction.payload}`,
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: resultAction.error.message,
            placement: "topRight",
          });
        }
      }
    },
    [dispatch, notification],
  );

  return {
    state,
    handleGetStatistics,
    handleGetStatisticsByMonth,
  };
}

type GetStatisticsByMonthResult = {
  currentTime: string;
  result: {
    order: { name: string; x: { year: number; month: number }; y: number };
    servicePackage: {
      name: string;
      x: { year: number; month: number };
      y: number;
    };
    request: { name: string; x: { year: number; month: number }; y: number };
  };
  totalRenevue: number;
}[];
