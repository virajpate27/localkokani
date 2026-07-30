// src/hooks/useFocusTrap.js
"use client";

import { useEffect, useRef } from "react";

export function useFocusTrap(isOpen) {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;

    const container = containerRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableEls = container?.querySelectorAll(focusableSelector);
    const firstEl = focusableEls?.[0];
    const lastEl = focusableEls?.[focusableEls.length - 1];

    firstEl?.focus();

    const handleKeyDown = (e) => {
      if (e.key !== "Tab" || !focusableEls?.length) return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl?.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.(); // restore focus to trigger element on close
    };
  }, [isOpen]);

  return containerRef;
}