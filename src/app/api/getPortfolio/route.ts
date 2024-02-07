import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("coins");
  const portfolioData = await db
    .collection("portfolioData")
    .find({})
    .toArray();

  return NextResponse.json(portfolioData);
}
