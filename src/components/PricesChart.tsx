import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { startOfToday, subMonths, format } from "date-fns";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  prices: number[][];
}

const PricesChart = ({ prices }: PriceChartProps) => {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (chartRef.current) {
      const chartContext = chartRef.current.getContext("2d");
      if (chartContext) {
        const threeMonthsAgo = subMonths(startOfToday(), 3); // Calculate the date three months ago
        const today = startOfToday(); // Use today's date as the end of the range

        chartInstanceRef.current = new Chart(chartContext, {
          type: "line",
          data: {
            labels: prices.map((price) => price[0]),
            datasets: [
              {
                label: "Bitcoin Price",
                borderColor: "rgba(120, 120, 250, 1)",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    250
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
                data: prices.map((price) => price[1]),
                fill: true,
                tension: 0.5,
                pointRadius: 0,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "month",
                  tooltipFormat: "MMMM yyyy",
                  displayFormats: {
                    month: "MMM yyyy",
                  },
                },
                min: threeMonthsAgo.getTime(),
                max: today.getTime(),
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 3,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: false,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                display: false,
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [prices]);

  const today = new Date();
  const formattedDate = format(today, "MMMM dd, yyyy");

  return (
    <div
      className={cn(
        "flex-0 w-5/12 p-12 rounded-lg",
        theme === "light" ? "bg-white" : "bg-[#191932]"
      )}
    >
      <div className="w-40 flex-col justify-start items-start gap-6 inline-flex mb-12">
        <div className="w-40 text-xl font-['Space Grotesk']">
          Bitcoin (BTC)
        </div>
        <div className="flex-col justify-start items-start gap-4 flex">
          <div className="text-2xl font-bold font-['Space Grotesk'] leading-7 w-fit inline-flex">
            $
            {prices.length > 0 &&
              Math.floor(prices[prices.length - 1][1] * 1000) /
                1000}{" "}
          </div>
          <div className="w-40 text-muted-foreground font-['Space Grotesk']">
            {formattedDate}
          </div>
        </div>
      </div>
      <div>
        <canvas
          ref={chartRef}
          id="priceChart"
          style={{ height: "250px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default PricesChart;