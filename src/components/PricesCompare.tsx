"use client";
import { Chart } from "chart.js/auto";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Coin } from "./CoinCard";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PriceChartProps {
  prices: Coin;
  type: 1 | 2;
}

const PricesCompare = ({ prices, type }: PriceChartProps) => {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  useEffect(() => {
    const pricesData = {
      name: prices.id,
      data: prices.sparkline_in_7d.price,
    };
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (chartRef.current) {
      const chartContext = chartRef.current.getContext("2d");
      if (chartContext) {
        const datasets = [
          {
            label: pricesData.name,
            borderColor:
              type === 1
                ? "rgba(120, 120, 250, 1)"
                : "rgba(216, 120, 250, 1)",
            backgroundColor:
              type === 1
                ? "rgba(116, 116, 242, 0.1)"
                : "rgba(216, 120, 250, 0.1)",
            data: pricesData.data,
            fill: true,
            tension: 0.5,
            pointRadius: 0,
          },
        ];

        chartInstanceRef.current = new Chart(chartContext, {
          type: "line",
          data: {
            labels: pricesData.data.map((_, index) => index),
            datasets,
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
  }, [prices, type]);
  const today = new Date();
  const formattedDate = format(today, "MMMM dd, yyyy");
  return (
    <div
      className={cn(
        "flex-0 lg:w-5/12 w-full p-12 rounded-lg",
        theme === "light" ? "bg-white" : "bg-[#191932]"
      )}
    >
      <div className="w-40 flex-col justify-start items-start gap-6 inline-flex mb-12">
        <div className="w-40 text-xl font-['Space Grotesk']">
          {prices.name} (
          <span className="uppercase">{prices.symbol}</span>)
        </div>
        <div className="flex-col justify-start items-start gap-4 flex">
          <div className="text-2xl font-bold font-['Space Grotesk'] leading-7 w-fit inline-flex">
            $
            {Math.floor(
              prices.sparkline_in_7d.price[
                prices.sparkline_in_7d.price.length - 1
              ] * 1000
            ) / 1000}{" "}
          </div>
          <div className="w-40 text-muted-foreground font-['Space Grotesk']">
            {formattedDate}
          </div>
        </div>
      </div>
      <div>
        <canvas
          ref={chartRef}
          id="pricesCompareChart"
          className="h-48 md:h-64"
        />
      </div>
    </div>
  );
};

export default PricesCompare;
