"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "../ui/button";
import Sparkline from "../Sparkline";

export type MobileTableCoin = {
  id: number;
  name: [string, string];
  sparkline: number[];
  price: [number, number];
};

export const mobileColumns: ColumnDef<MobileTableCoin>[] = [
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
  {
    accessorFn: (row) => row.price[0],
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
    cell: (info) => {
      const [price, change] = info.row.original.price;
      const value = change;
      const isNegative = value < 0;
      return (
        <div className="flex flex-col items-center justify-start space-x-1">
          <div className="text-xl">${price.toFixed(2)}</div>
          <div className="flex justify-around items-center gap-2">
            <div
              className={`w-0 h-0 border-x-4 border-x-transparent border-b-[6px] ${
                isNegative
                  ? "border-b-rose-500 rotate-180"
                  : "border-b-cyan-400"
              } inline-block`}
            />
            <div
              className={
                isNegative ? "text-rose-500" : "text-cyan-400"
              }
            >
              {value.toFixed(2)}%
            </div>
          </div>
        </div>
      );
    },
  },
];
