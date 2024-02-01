import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns"; // Import the adapter
import { subDays, startOfDay, format } from "date-fns"; // For calculating dates
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface VolumeChartProps {
  totalVolumes: number[][];
}

const VolumeChart = ({ totalVolumes }: VolumeChartProps) => {
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
        const twoWeeksAgo = startOfDay(subDays(new Date(), 14)); // Calculate the date two weeks ago
        const today = startOfDay(new Date()); // Use today's date as the end of the range

        chartInstanceRef.current = new Chart(chartContext, {
          type: "bar",
          data: {
            labels: totalVolumes.map((volume) => volume[0]),
            datasets: [
              {
                label: "Bitcoin Volume",
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    450
                  );
                  gradient.addColorStop(0, "rgba(157, 98, 217, 1)");
                  gradient.addColorStop(
                    1,
                    "rgba(179, 116, 242, 0.01)"
                  );
                  return gradient;
                },
                data: totalVolumes.map((volume) => volume[1]),
                borderWidth: 1,
                borderRadius: 5,
                barThickness: 25,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                  tooltipFormat: "MMMM d, yyyy",
                  displayFormats: {
                    day: "MMM d",
                  },
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 14,
                },
                min: twoWeeksAgo.getTime(),
                max: today.getTime(),
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
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
  }, [totalVolumes]);

  const today = new Date();
  const formattedDate = format(today, "MMMM dd, yyyy");
  return (
    <div
      className={cn(
        "flex-0 w-5/12 p-12 rounded-lg",
        theme === "light" ? "bg-white" : "bg-[#1E1932]"
      )}
    >
      <div className="w-40 flex-col justify-start items-start gap-6 inline-flex mb-12">
        <div className="w-40 text-xl font-['Space Grotesk']">
          Volume 24h
        </div>
        <div className="flex-col justify-start items-start gap-4 flex">
          <div className="text-2xl font-bold font-['Space Grotesk'] leading-7 w-48">
            $
            {totalVolumes.length > 0 &&
              (
                Math.floor(
                  (totalVolumes[totalVolumes.length - 1][1] /
                    1000000000) *
                    1000
                ) / 1000
              ).toFixed(3)}{" "}
            billion
          </div>
          <div className="w-40 text-muted-foreground font-['Space Grotesk']">
            {formattedDate}
          </div>
        </div>
      </div>
      <div>
        <canvas
          ref={chartRef}
          id="volumeChart"
          style={{ height: "250px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default VolumeChart;
