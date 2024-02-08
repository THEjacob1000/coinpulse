import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId")!;
  const date = searchParams.get("date")!;
  const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!date || !dateFormatRegex.test(date)) {
    return NextResponse.json({
      error: "Invalid date",
      details: "Please provide a valid date",
    });
  } else if (!coinId) {
    return NextResponse.json({
      error: "Invalid coin ID",
      details: "Please provide a valid coin ID",
    });
  }
  try {
    const connectionString = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}&localization=false`;
    const response = await axios.get(connectionString);
    const newData = response.data.market_data.current_price;
    return NextResponse.json(newData);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error: "Failed to fetch coin data",
      details: error.message,
    });
  }
}
