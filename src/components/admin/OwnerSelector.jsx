// src/components/admin/OwnerSelector.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { FiUser, FiSearch, FiX, FiCheck } from "react-icons/fi";
import { getAllOwnersAdmin } from "@/lib/services/ownerService";

export default function OwnerSelector({ value, valueName, onChange }) {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    getAllOwnersAdmin().then(setOwners).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOwners = owners.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      o.fullName?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.mobile?.includes(q)
    );
  });

  const handleSelect = (owner) => {
    onChange(owner.uid, owner.fullName);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null, null);
  };

  return (
    <div ref={containerRef} className="relative">
      {value ? (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-secondary/40 bg-secondary/5">
          <span className="flex items-center gap-2 text-sm font-medium text-primary">
            <FiUser className="text-secondary" /> {valueName}
          </span>
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-red-500" aria-label="Remove owner assignment">
            <FiX className="text-sm" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-secondary cursor-pointer transition-colors"
        >
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={isLoading ? "Loading owners..." : "Search and select an owner..."}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>
      )}

      {isOpen && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-64 overflow-y-auto z-50">
          {filteredOwners.length === 0 ? (
            <p className="p-4 text-center text-gray-400 text-sm">
              {owners.length === 0 ? "No registered owners yet" : "No owners match your search"}
            </p>
          ) : (
            filteredOwners.map((owner) => (
              <button
                key={owner.uid}
                type="button"
                onClick={() => handleSelect(owner)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-primary text-sm">{owner.fullName}</p>
                  <p className="text-gray-400 text-xs">{owner.email} · {owner.mobile}</p>
                </div>
                {value === owner.uid && <FiCheck className="text-secondary" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}