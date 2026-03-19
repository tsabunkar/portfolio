/**
 * hooks/useDraggable.js
 *
 * Gives any fixed-position element Spotify-style drag-anywhere behaviour.
 * Uses the Pointer Events API (covers mouse + touch + stylus in one path).
 *
 * Usage:
 *   const { ref, pos, isDragging, resetPos } = useDraggable();
 *   <div ref={ref} style={pos ? { left: pos.x, top: pos.y } : undefined}>…</div>
 *
 *  • pos === null  → element uses its CSS-defined position (bottom-center default)
 *  • pos !== null  → element is pinned to { x, y } via inline style
 */

import { useState, useRef, useCallback, useEffect } from "react";

const SNAP_MARGIN = 12; // px from edges when clamped to viewport

export function useDraggable() {
  const nodeRef    = useRef(null);
  const startRef   = useRef(null);            // { mouseX, mouseY, elemX, elemY }
  const [pos, setPos]           = useState(null);   // null = CSS default
  const [isDragging, setIsDragging] = useState(false);

  /* ── Clamp a proposed position inside the viewport ──────────────── */
  const clamp = useCallback(({ x, y }) => {
    const el = nodeRef.current;
    if (!el) return { x, y };
    const { width, height } = el.getBoundingClientRect();
    return {
      x: Math.min(Math.max(x, SNAP_MARGIN), window.innerWidth  - width  - SNAP_MARGIN),
      y: Math.min(Math.max(y, SNAP_MARGIN), window.innerHeight - height - SNAP_MARGIN),
    };
  }, []);

  /* ── Called the first time the element is about to be dragged ───── */
  const captureInitialPos = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return { x: 0, y: 0 };
    // If already tracking x,y, use that; otherwise read from DOM
    if (pos) return pos;
    const rect = el.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }, [pos]);

  /* ── Pointer-down on the DRAG HANDLE ────────────────────────────── */
  const onPointerDown = useCallback(
    (e) => {
      // Ignore buttons / labelled no-drag zones
      if (e.target.closest("button, [data-no-drag]")) return;

      const elemPos = captureInitialPos();
      startRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        elemX:  elemPos.x,
        elemY:  elemPos.y,
      };

      // setPointerCapture routes all future move/up events here even outside the element
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      e.preventDefault();
    },
    [captureInitialPos]
  );

  /* ── Pointer-move ────────────────────────────────────────────────── */
  const onPointerMove = useCallback(
    (e) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.mouseX;
      const dy = e.clientY - startRef.current.mouseY;
      const raw = {
        x: startRef.current.elemX + dx,
        y: startRef.current.elemY + dy,
      };
      setPos(clamp(raw));
    },
    [clamp]
  );

  /* ── Pointer-up ──────────────────────────────────────────────────── */
  const onPointerUp = useCallback(() => {
    startRef.current = null;
    setIsDragging(false);
  }, []);

  /* ── Re-clamp on window resize ───────────────────────────────────── */
  useEffect(() => {
    if (!pos) return;
    const handler = () => setPos((p) => (p ? clamp(p) : p));
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [pos, clamp]);

  /* ── Reset to CSS default (bottom-center) ───────────────────────── */
  const resetPos = useCallback(() => setPos(null), []);

  return {
    ref: nodeRef,
    pos,
    isDragging,
    resetPos,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp },
  };
}
