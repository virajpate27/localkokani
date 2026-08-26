// src/app/admin/landing-pages/[id]/edit/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import LandingPageForm from "@/components/admin/LandingPageForm";
import { getLandingPageById } from "@/lib/services/landingPageService";

export default function EditLandingPagePage() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { getLandingPageById(id).then(setPage).finally(() => setIsLoading(false)); }, [id]);

  if (isLoading) return <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>;
  if (!page) return <div className="card p-10 text-center text-gray-400">Page not found.</div>;

  return <div><p className="text-gray-400 text-sm mb-6">Editing <span className="font-medium text-primary">{page.h1}</span></p><LandingPageForm initialData={page} /></div>;
}