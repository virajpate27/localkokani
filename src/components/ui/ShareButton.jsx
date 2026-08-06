// src/components/ui/ShareButton.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FiShare2, FiCopy, FiCheck, FiX } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ShareButton({ title, text, url, variant = "icon" }) {
    const [showFallback, setShowFallback] = useState(false);
    const [copied, setCopied] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // navigator.share only exists in secure contexts (https) and mostly on mobile browsers
        setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    // Close the fallback popover on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowFallback(false);
            }
        };
        if (showFallback) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFallback]);

    const handleShareClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (canNativeShare) {
            try {
                await navigator.share({ title, text, url });
            } catch (error) {
                // AbortError fires when the user simply closes the native share sheet — not a real error
                if (error.name !== "AbortError") {
                    console.error("Share failed:", error);
                }
            }
        } else {
            setShowFallback((prev) => !prev);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
            setShowFallback(false);
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Couldn't copy link. Please copy it manually.");
        }
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };

    const iconOnly = variant === "icon";

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={handleShareClick}
                aria-label="Share"
                className={
                    iconOnly
                        ? "w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                        : "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
                }
            >
                <FiShare2 className={iconOnly ? "text-lg text-gray-500" : ""} />
                {!iconOnly && "Share"}
            </button>

            {/* Fallback popover — only shown on desktop / browsers without navigator.share */}
            {showFallback && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 w-64 z-50">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Share this</p>
                        <button onClick={() => setShowFallback(false)} aria-label="Close">
                            <FiX className="text-gray-400 hover:text-gray-600 text-sm" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <Link
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                            aria-label="Share on WhatsApp"
                        >
                            <FaWhatsapp className="text-lg" />
                        </Link>
                        <Link
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                            aria-label="Share on Facebook"
                        >
                            <FaFacebook className="text-lg" />
                        </Link>
                        <Link
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-gray-900/10 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                            aria-label="Share on X"
                        >
                            <FaTwitter className="text-lg" />
                        </Link>
                    </div>

                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2.5 rounded-lg transition-colors"
                    >
                        {copied ? <FiCheck className="text-accent-dark" /> : <FiCopy />}
                        {copied ? "Copied!" : "Copy link"}
                    </button>
                </div>
            )}
        </div>
    );
}