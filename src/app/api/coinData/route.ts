import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId")!;
  const client = await clientPromise;
  const db = client.db("coins");

  const coinData = await db
    .collection("coinData")
    .findOne({ id: coinId });

  const now = new Date();

  if (
    !coinData ||
    now.getTime() - new Date(coinData.lastUpdate).getTime() >
      24 * 3600 * 1000
  ) {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      );
      const newData = response.data;

      await db
        .collection("coinData")
        .updateOne(
          { id: coinId },
          { $set: { ...newData, lastUpdate: now } },
          { upsert: true }
        );
      console.log(newData);
      return NextResponse.json(newData);
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        error: "Failed to fetch coin data",
        details: error.message,
      });
    }
  } else {
    return NextResponse.json(coinData);
  }
}
