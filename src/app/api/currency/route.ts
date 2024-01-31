import axios from "axios";
import { NextResponse } from "next/server";

const getCurrencyExchange = async () => {
  const options = {
    method: "GET",
    url: "https://currencyapi-net.p.rapidapi.com/rates",
    params: {
      output: "JSON",
      base: "USD",
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "currencyapi-net.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export async function GET() {
  const currency = await getCurrencyExchange();
  return NextResponse.json(currency);
}
