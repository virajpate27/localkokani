// src/app/api/admin/run-promotion-processing/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/process-promotions`,
      { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } } // server-to-server, secret never touches the browser
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Manual promotion processing trigger error:", error);
    return NextResponse.json({ error: "Failed to trigger processing" }, { status: 500 });
  }
}