import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Coin } from "@/components/CoinCard";

type PortfolioDataItem = {
  coin: Coin;
  name: string;
  dateAdded: Date;
  amountOwned: number;
  valueAtBuy: number;
};

type PortfolioData = {
  data: PortfolioDataItem;
};

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  try {
    const portfolioData: PortfolioData = await req.json();

    const client = await clientPromise;
    const db = client.db("coins");

    const filter = { "data.coin.id": portfolioData.data.coin.id };

    const update = { $set: { ...portfolioData.data } };
    const options = { upsert: true };

    const response = await db
      .collection("portfolioData")
      .updateOne(filter, update, options);

    let message = "";
    if (response.upsertedCount > 0) {
      message = "Portfolio data added successfully";
    } else if (response.modifiedCount > 0) {
      message = "Portfolio data updated successfully";
    } else {
      message = "No changes made to the portfolio data";
    }

    return new NextResponse(JSON.stringify({ message }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Failed to update or insert portfolio data", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to update or insert portfolio data",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
