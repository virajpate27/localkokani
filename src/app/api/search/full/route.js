// src/app/api/search/full/route.js
import { NextResponse } from "next/server";
import { searchAllFull } from "@/lib/services/searchService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ hotels: [], destinations: [] });
  }

  try {
    const results = await searchAllFull(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Full search API error:", error);
    return NextResponse.json(
      { error: "Search failed", hotels: [], destinations: [] },
      { status: 500 }
    );
  }
}