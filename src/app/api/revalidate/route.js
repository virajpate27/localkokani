// src/app/api/revalidate/route.js
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache"; // ⬅️ add revalidateTag

export async function POST(request) {
  try {
    const { paths, tags } = await request.json(); // ⬅️ accept optional tags array

    if (paths && Array.isArray(paths)) {
      paths.forEach((path) => revalidatePath(path));
    }
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => revalidateTag(tag));
    }

    if (!paths && !tags) {
      return NextResponse.json({ error: "paths or tags array is required" }, { status: 400 });
    }

    return NextResponse.json({ revalidated: true, paths, tags });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}