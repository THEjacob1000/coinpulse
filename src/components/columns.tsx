"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import Sparkline from "./Sparkline";

export type TableCoin = {
  id: number;
  name: [string, string];
  price: string;
  hourChange: string;
  dayChange: string;
  weekChange: string;
  volumeMarketCap: [number, number];
  circulatingTotalSupply: [number, number];
  sparkline: number[];
};

export const columns: ColumnDef<TableCoin>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          #
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => row.name[1],
    id: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          Name
        </Button>
      );
    },
    cell: (info) => {
      const [imageUrl, name] = info.row.original.name;
      return (
        <div className="flex items-center space-x-2">
          <Image
            src={imageUrl}
            alt={name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span>{name}</span>
        </div>
      );
    },
    filterFn: "auto",
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          Price
        </Button>
      );
    },
    cell: (info) => <div>{info.getValue() as string}</div>,
  },
  {
    accessorKey: "hourChange",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          1hr%
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      const isNegative = value < 0;
      return (
        <div className="flex items-center justify-start space-x-1">
          <div
            className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
              isNegative
                ? "border-b-rose-500 rotate-180"
                : "border-b-cyan-400"
            } inline-block`}
          />
          <div
            className={isNegative ? "text-rose-500" : "text-cyan-400"}
          >
            {value}%
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dayChange",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          24hr%
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      const isNegative = value < 0;
      return (
        <div className="flex items-center justify-start space-x-1">
          <div
            className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
              isNegative
                ? "border-b-rose-500 rotate-180"
                : "border-b-cyan-400"
            } inline-block`}
          />
          <div
            className={isNegative ? "text-rose-500" : "text-cyan-400"}
          >
            {value}%
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "weekChange",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          className="flex justify-start items-center"
        >
          7d%
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as number;
      const isNegative = value < 0;
      return (
        <div className="flex items-center justify-start space-x-1">
          <div
            className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
              isNegative
                ? "border-b-rose-500 rotate-180"
                : "border-b-cyan-400"
            } inline-block`}
          />
          <div
            className={isNegative ? "text-rose-500" : "text-cyan-400"}
          >
            {value}%
          </div>
        </div>
      );
    },
  },
  {
    id: "volumeMarketCap",
    header: "24h Volume / Market Cap",
    accessorFn: (row) => row.volumeMarketCap,
    cell: ({ getValue }) => {
      const value = getValue() as TableCoin["volumeMarketCap"];
      const [volume, marketCap] = value;
      return (
        <div className="flex flex-col w-5/6">
          <div className="flex justify-between">
            <div>{(volume / 1000000000).toFixed(2)}B</div>
            <div>{(marketCap / 1000000000).toFixed(2)}B</div>
          </div>
          <Progress
            value={(volume / marketCap) * 100}
            className="h-2"
          />
        </div>
      );
    },
  },
  {
    id: "circulatingTotalSupply",
    header: "Circulating / Total Supply",
    accessorFn: (row) => row.volumeMarketCap,
    cell: ({ getValue }) => {
      const value = getValue() as TableCoin["volumeMarketCap"];
      const [circulating, totalSupply] = value;
      return (
        <div className="flex flex-col w-5/6">
          <div className="flex justify-between">
            <div>{(circulating / 1000000000).toFixed(2)}B</div>
            <div>{(totalSupply / 1000000000).toFixed(2)}B</div>
          </div>
          <Progress
            value={(circulating / totalSupply) * 100}
            className="h-2"
          />
        </div>
      );
    },
  },
  {
    id: "sparkline",
    header: "Last 7d",
    cell: ({ row }) => {
      const sparklineData = row.original.sparkline;
      const coinName = row.original.name[1];
      return (
        <div className="h-20">
          <Sparkline
            lastWeekData={sparklineData}
            coinName={coinName}
          />
        </div>
      );
    },
  },
];
