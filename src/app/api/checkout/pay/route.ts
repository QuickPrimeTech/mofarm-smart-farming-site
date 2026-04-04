import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Received checkout data:", body);

  return NextResponse.json(
    { message: "STK Push initiated successfully" },
    { status: 200 },
  );
}
