// src/components/admin/EntityMultiSelect.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";

export default function EntityMultiSelect({ value = [], onChange, fetchAll, label, placeholder }) {
  const [allEntities, setAllEntities] = useState([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchAll().then(setAllEntities);
  }, [fetchAll]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedEntities = value.map((id) => allEntities.find((e) => e.id === id)).filter(Boolean);
  const availableEntities = allEntities.filter(
    (e) => !value.includes(e.id) && e.name?.toLowerCase().includes(query.toLowerCase())
  );

  const addEntity = (id) => {
    onChange([...value, id]);
    setQuery("");
  };

  const removeEntity = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  const moveEntity = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= value.length) return;
    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {selectedEntities.length > 0 && (
        <div className="space-y-2 mb-3">
          {selectedEntities.map((entity, index) => (
            <div key={entity.id} className="flex items-center justify-between bg-secondary/5 border border-secondary/20 rounded-lg px-3 py-2">
              <span className="text-sm text-primary font-medium">{entity.name}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveEntity(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-primary disabled:opacity-30 text-xs px-1">↑</button>
                <button type="button" onClick={() => moveEntity(index, 1)} disabled={index === selectedEntities.length - 1} className="text-gray-400 hover:text-primary disabled:opacity-30 text-xs px-1">↓</button>
                <button type="button" onClick={() => removeEntity(entity.id)} className="text-gray-400 hover:text-red-500 ml-1"><FiX className="text-sm" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={containerRef} className="relative">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-secondary">
          <FiSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-56 overflow-y-auto z-50">
            {availableEntities.length === 0 ? (
              <p className="p-3 text-center text-gray-400 text-xs">No matches</p>
            ) : (
              availableEntities.slice(0, 20).map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => addEntity(entity.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 text-sm"
                >
                  {entity.name}
                  <FiPlus className="text-gray-300 text-xs" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}