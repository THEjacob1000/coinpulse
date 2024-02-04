import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

interface SparklineProps {
  lastWeekData: number[];
  coinName: string;
}

const Sparkline = ({ lastWeekData, coinName }: SparklineProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && lastWeekData.length > 0) {
      const ctx = (chartRef.current as HTMLCanvasElement).getContext(
        "2d"
      );
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: lastWeekData.map((_, index) => index.toString()),
            datasets: [
              {
                label: coinName,
                data: lastWeekData,
                fill: false,
                borderColor: "rgba(120, 120, 250, 1)",
                tension: 0.1,
              },
            ],
          },
        });
      }
    }
  }, [lastWeekData, coinName]);

  return <canvas ref={chartRef} id={`${coinName}-chart`} />;
};

export default Sparkline;
