// app/bitcoinData/route.ts
import clientPromise from "@/lib/mongodb"; // Adjust the import path as needed
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");

  // Check if there's cached data and if it's still valid
  const lastBitcoinUpdate = await db
    .collection("metadata")
    .findOne({ type: "lastBitcoinUpdate" });
  const now = new Date();

  if (
    !lastBitcoinUpdate ||
    now.getTime() - new Date(lastBitcoinUpdate.date).getTime() >
      24 * 60 * 60 * 1000
  ) {
    // Data is outdated or not present, fetch new data from CoinGecko
    const url =
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily";
    const response = await axios.get(url);
    const { market_caps, prices, total_volumes } = response.data;

    // Save the new data and the last update time to MongoDB
    await db
      .collection("bitcoinData")
      .updateOne(
        { type: "marketCaps" },
        { $set: { data: market_caps } },
        { upsert: true }
      );
    await db
      .collection("bitcoinData")
      .updateOne(
        { type: "prices" },
        { $set: { data: prices } },
        { upsert: true }
      );
    await db
      .collection("bitcoinData")
      .updateOne(
        { type: "totalVolumes" },
        { $set: { data: total_volumes } },
        { upsert: true }
      );
    await db
      .collection("metadata")
      .updateOne(
        { type: "lastBitcoinUpdate" },
        { $set: { date: now } },
        { upsert: true }
      );

    return NextResponse.json({ market_caps, prices, total_volumes });
  } else {
    // Data is up-to-date, fetch it from MongoDB
    const marketCapsData = await db
      .collection("bitcoinData")
      .findOne({ type: "marketCaps" });
    const pricesData = await db
      .collection("bitcoinData")
      .findOne({ type: "prices" });
    const totalVolumesData = await db
      .collection("bitcoinData")
      .findOne({ type: "totalVolumes" });

    return NextResponse.json({
      market_caps: marketCapsData?.data,
      prices: pricesData?.data,
      total_volumes: totalVolumesData?.data,
    });
  }
}
