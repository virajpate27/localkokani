// src/components/admin/ImageUploader.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FiUpload, FiX, FiLoader, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ImageUploader({
  value,          // { url, publicId } | null
  onChange,       // (imageObj | null) => void
  folder = "general",
  label = "Image",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file, folder);
      onChange(result);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium dark:text-gray-300 mb-2">
        {label}
      </label>

      {value?.url ? (
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] border dark:border-gray-800">
          <Image src={value.url} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            aria-label="Remove image"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive
              ? "border-secondary bg-secondary/5"
              : "dark:border-gray-800 hover:border-secondary/50"
          }`}
        >
          {isUploading ? (
            <>
              <FiLoader className="animate-spin text-2xl text-secondary mb-2" />
              <p className="dark:text-gray-500 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <FiImage className="text-3xl text-gray-300 mb-2" />
              <p className="dark:text-gray-500 text-sm font-medium flex items-center gap-1.5">
                <FiUpload /> Click or drag an image here
              </p>
              <p className="dark:text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}