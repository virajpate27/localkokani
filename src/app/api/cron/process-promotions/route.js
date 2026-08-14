// src/app/api/cron/process-promotions/route.js
// Update to write a status document after each run:

import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getAdminDb() {
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

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  const today = todayString();
  let expiredCount = 0;
  let activatedCount = 0;
  let errorMessage = null;

  try {
    const activeSnap = await db.collection("promotionRequests").where("status", "==", "active").get();
    for (const docSnap of activeSnap.docs) {
      const req = docSnap.data();
      if (req.endDate < today) {
        const untilField = req.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
        const entityRef = db.collection(req.entityType === "hotel" ? "hotels" : "restaurants").doc(req.entityId);
        await entityRef.update({ [req.promotionType]: false, [untilField]: null });
        await docSnap.ref.update({ status: "completed", updatedAt: FieldValue.serverTimestamp() });
        expiredCount++;
      }
    }

    const scheduledSnap = await db.collection("promotionRequests").where("status", "==", "scheduled").get();
    for (const docSnap of scheduledSnap.docs) {
      const req = docSnap.data();
      if (req.startDate <= today) {
        const untilField = req.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
        const promotedAtField = req.promotionType === "featured" ? "featuredPromotedAt" : "sponsoredPromotedAt";
        const entityRef = db.collection(req.entityType === "hotel" ? "hotels" : "restaurants").doc(req.entityId);
        await entityRef.update({
          [req.promotionType]: true,
          [untilField]: req.endDate,
          [promotedAtField]: FieldValue.serverTimestamp(),
        });
        await docSnap.ref.update({ status: "active", updatedAt: FieldValue.serverTimestamp() });
        activatedCount++;
      }
    }
  } catch (error) {
    console.error("Cron promotion processing error:", error);
    errorMessage = error.message;
  }

  // Write a status log — a single document we overwrite each run, so the admin panel
  // can always show the most recent execution without needing a growing history collection.
  await db.collection("systemStatus").doc("promotionCron").set({
    lastRunAt: FieldValue.serverTimestamp(),
    lastRunDate: today,
    expiredCount,
    activatedCount,
    success: !errorMessage,
    errorMessage,
  });

  return NextResponse.json({ expiredCount, activatedCount, ranAt: today, success: !errorMessage });
}