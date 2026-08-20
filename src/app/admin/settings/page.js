// src/app/admin/settings/page.js
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSave, FiLoader } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";
import { getSiteSettings, updateSiteSettings } from "@/lib/services/settingsService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { triggerRevalidation } from "@/utils/revalidate";

export default function AdminSettingsPage() {
  const [heroImage, setHeroImage] = useState(null);
  const [originalHeroImage, setOriginalHeroImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSiteSettings().then((settings) => {
      setHeroImage(settings.heroImage || null);
      setOriginalHeroImage(settings.heroImage || null);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteSettings({ heroImage });

      if (originalHeroImage?.publicId && originalHeroImage.publicId !== heroImage?.publicId) {
        await deleteFromCloudinary(originalHeroImage.publicId);
      }

      await triggerRevalidation(["/"]);
      setOriginalHeroImage(heroImage);
      toast.success("Settings saved");
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg text-primary mb-1">Homepage Hero Banner</h2>
        <p className="text-gray-400 text-sm mb-4">
          The background image shown behind the homepage search bar. Recommended: a wide landscape photo, at least 1920px wide.
        </p>
        <ImageUploader value={heroImage} onChange={setHeroImage} folder="site-settings" label="Hero Banner Image" />
      </div>

      <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
        {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
        {isSaving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}