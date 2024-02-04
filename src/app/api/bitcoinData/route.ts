import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");

  const lastBitcoinUpdate = await db
    .collection("metadata")
    .findOne({ type: "lastBitcoinUpdate" });
  const now = new Date();

  if (
    !lastBitcoinUpdate ||
    now.getTime() - new Date(lastBitcoinUpdate.date).getTime() >
      3600000
  ) {
    const url =
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily";
    const response = await axios.get(url);
    const { market_caps, prices, total_volumes } = response.data;

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
