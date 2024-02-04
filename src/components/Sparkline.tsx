import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

interface SparklineProps {
  lastWeekData: number[];
  coinName: string;
}

const Sparkline = ({ lastWeekData, coinName }: SparklineProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && lastWeekData.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        const newChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: lastWeekData.map((_, index) => index.toString()),
            datasets: [
              {
                label: coinName,
                data: lastWeekData,
                borderColor: "rgba(120, 120, 250, 1)",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    400
                  );
                  gradient.addColorStop(
                    0,
                    "rgba(116, 116, 242, 0.6)"
                  );
                  gradient.addColorStop(
                    1,
                    "rgba(116, 116, 242, 0.01)"
                  );
                  return gradient;
                },
                fill: true,
                tension: 0.5,
                pointRadius: 0,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            scales: {
              x: {
                display: false,
                grid: {
                  display: false,
                },
              },
              y: {
                display: false,
                grid: {
                  display: false,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 1,
              },
              point: {
                radius: 0,
              },
            },
          },
        });

        chartInstanceRef.current = newChartInstance;
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [lastWeekData, coinName]);

  return <canvas ref={chartRef} id={`${coinName}-sparkline`} />;
};

export default Sparkline;
