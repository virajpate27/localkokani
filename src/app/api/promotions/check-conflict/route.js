// src/app/api/promotions/check-conflict/route.js
import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  console.log("DEBUG — projectId:", process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log("DEBUG — clientEmail:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  console.log("DEBUG — privateKey exists:", !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  console.log("DEBUG — privateKey starts with:", process.env.FIREBASE_ADMIN_PRIVATE_KEY?.substring(0, 30));

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

export async function POST(request) {
  try {
    const { entityId, promotionType } = await request.json();

    if (!entityId || !promotionType) {
      return NextResponse.json({ error: "entityId and promotionType are required" }, { status: 400 });
    }

    const db = getAdminDb();
    const snap = await db
      .collection("promotionRequests")
      .where("entityId", "==", entityId)
      .where("promotionType", "==", promotionType)
      .where("status", "in", ["pending_payment", "scheduled", "active"])
      .get();

    return NextResponse.json({ hasConflict: !snap.empty });
  } catch (error) {
    console.error("Promotion conflict check error:", error);
    // TEMPORARY — return the actual error message for debugging, remove once fixed
    return NextResponse.json(
      { error: "Check failed", debugMessage: error.message },
      { status: 500 }
    );
  }
}