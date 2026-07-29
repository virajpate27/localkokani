// src/app/api/revalidate/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    const { paths } = await request.json();

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: "paths array is required" }, { status: 400 });
    }

    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({ revalidated: true, paths });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}