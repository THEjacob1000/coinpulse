import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

type PortfolioDataItem = {
  name: string;
  dateAdded: Date;
  amountOwned: number;
  valueAtBuy: number;
};

type PortfolioData = {
  data: PortfolioDataItem[];
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

    const response = await db
      .collection("portfolioData")
      .insertOne(portfolioData);

    return new NextResponse(
      JSON.stringify({
        message: "Portfolio data added successfully",
        id: response.insertedId.toString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Failed to insert portfolio data", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to insert portfolio data",
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
