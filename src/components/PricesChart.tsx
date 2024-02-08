import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { startOfToday, subMonths, format, subDays } from "date-fns";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Currency } from "@/lib/store";
import { Skeleton } from "./ui/skeleton";

interface PriceChartProps {
  prices: number[][];
  timeframe: number;
  currency: [Currency, number];
}

const PricesChart = ({
  prices,
  timeframe,
  currency,
}: PriceChartProps) => {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timeframes = ["1D", "7D", "14D", "1M"];
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (chartRef.current) {
      const chartContext = chartRef.current.getContext("2d");
      if (chartContext) {
        let startDate;
        switch (timeframes[timeframe]) {
          case "1D":
            startDate = subDays(startOfToday(), 1);
            break;
          case "7D":
            startDate = subDays(startOfToday(), 7);
            break;
          case "14D":
            startDate = subDays(startOfToday(), 14);
            break;
          case "1M":
            startDate = subMonths(startOfToday(), 1);
            break;
          default:
            startDate = subMonths(startOfToday(), 1);
            break;
        }
        const today = startOfToday(); // Use today's date as the end of the range

        chartInstanceRef.current = new Chart(chartContext, {
          type: "line",
          data: {
            labels: prices.map((price) => price[0]),
            datasets: [
              {
                label: "Bitcoin Price",
                data: prices.map((price) => price[1] * currency[1]),
                borderColor: "rgba(120, 120, 250, 1)",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const chartHeight = ctx.canvas.clientHeight || 80;
                  const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    chartHeight
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
                min: startDate.getTime(),
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
    setIsLoading(false);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [prices, timeframe, currency]);

  const today = new Date();
  const formattedDate = format(today, "MMMM dd, yyyy");

  return (
    <>
      {isLoading ? (
        <div
          className={cn(
            "flex-0 lg:w-5/12 w-full p-12 rounded-lg",
            theme === "light" ? "bg-white" : "bg-[#191932]"
          )}
        >
          <div className="w-40 flex-col justify-start items-start gap-6 inline-flex mb-12">
            <Skeleton className="h-6 w-40 mb-2" />{" "}
            <div className="flex-col justify-start items-start gap-4 flex">
              <Skeleton className="h-8 w-32 mb-2" />{" "}
              <Skeleton className="h-4 w-40" />{" "}
            </div>
          </div>
          <Skeleton className="h-48 md:h-64" />{" "}
        </div>
      ) : (
        <div
          className={cn(
            "flex-0 lg:w-5/12 w-full p-12 rounded-lg",
            theme === "light" ? "bg-white" : "bg-[#191932]"
          )}
        >
          <div className="w-40 flex-col justify-start items-start gap-6 inline-flex mb-12">
            <div className="w-40 text-xl font-['Space Grotesk']">
              Bitcoin (BTC)
            </div>
            <div className="flex-col justify-start items-start gap-4 flex">
              <div className="text-2xl font-bold font-['Space Grotesk'] leading-7 w-fit inline-flex">
                {currency[0].symbol}
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
              className="h-48 md:h-64"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PricesChart;
