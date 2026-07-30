// src/components/admin/MultiImageUploader.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FiUpload, FiX, FiLoader, FiImage, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function MultiImageUploader({
  value = [],       // array of { url, publicId }
  onChange,          // (newArray) => void
  folder = "hotels",
  label = "Hotel Photos",
  maxImages = 10,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const invalidFile = files.find((f) => !f.type.startsWith("image/"));
    if (invalidFile) {
      toast.error("Please upload only image files");
      return;
    }

    const oversizedFile = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      toast.error("Each image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
      const results = await Promise.all(uploadPromises);
      onChange([...value, ...results]);
      toast.success(`${results.length} image${results.length > 1 ? "s" : ""} uploaded`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Some uploads failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const setAsPrimary = (index) => {
    if (index === 0) return;
    const updated = [...value];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{" "}
        <span className="text-gray-400 font-normal">
          ({value.length}/{maxImages})
        </span>
      </label>

      {/* Existing images grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {value.map((img, index) => (
            <div
              key={img.publicId || index}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
            >
              <Image src={img.url} alt={`Photo ${index + 1}`} fill className="object-cover" />

              {index === 0 && (
                <span className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <FiStar className="text-[10px]" /> Cover
                </span>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsPrimary(index)}
                    className="w-8 h-8 rounded-full bg-white/90 text-primary flex items-center justify-center hover:bg-white"
                    title="Set as cover photo"
                    aria-label="Set as cover photo"
                  >
                    <FiStar className="text-sm" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-white"
                  title="Remove"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {value.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`aspect-[16/6] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? "border-secondary bg-secondary/5" : "border-gray-200 hover:border-secondary/50"
          }`}
        >
          {isUploading ? (
            <>
              <FiLoader className="animate-spin text-2xl text-secondary mb-2" />
              <p className="text-gray-400 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <FiImage className="text-2xl text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                <FiUpload /> Click or drag images here
              </p>
              <p className="text-gray-400 text-xs mt-1">
                First image becomes the cover photo
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}