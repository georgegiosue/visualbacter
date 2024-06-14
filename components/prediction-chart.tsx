import { CLASSNAMES } from "@/config/constants";
import { PredictionsResponse } from "@/lib/types/predictions-response";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

function getOptions(predictions: PredictionsResponse) {
  return {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    title: {
      text: "Prediction Chart",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["% Prediction"],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: CLASSNAMES,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Prediction",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 10, 10)",
            },
            {
              offset: 1,
              color: "rgb(220, 10, 150)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: predictions.predictions,
      },
    ],
  };
}

export type PredictionChartProps = {
  predictions: PredictionsResponse;
};

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = getOptions(predictions);

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [predictions]);

  return <div ref={chartRef} style={{ width: "600px", height: "300px" }}/>;
};

export default PredictionChart;
