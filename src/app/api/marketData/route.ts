import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");

  const lastUpdate = await db
    .collection("metadata")
    .findOne({ type: "lastMarketUpdate" });

  const now = new Date();

  if (
    !lastUpdate ||
    now.getTime() - new Date(lastUpdate.date).getTime() > 3600000
  ) {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/global"
      );
      const data = response.data;
      await db.collection("marketData").deleteMany({});
      await db.collection("marketData").insertOne(data);
      await db
        .collection("metadata")
        .updateOne(
          { type: "lastMarketUpdate" },
          { $set: { date: now } },
          { upsert: true }
        );
      // console.log(data);
      return NextResponse.json(data);
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({
        error: "Failed to fetch market data",
        details: error.message,
      });
    }
  } else {
    const marketData = await db
      .collection("marketData")
      .find({})
      .toArray();
    return NextResponse.json(marketData);
  }
}
