// src/app/api/get-client-ip/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return NextResponse.json({ ip });
}