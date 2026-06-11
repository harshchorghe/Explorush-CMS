"use client";

import { useEffect, useRef } from "react";

export function HomeCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const left = `${event.clientX}px`;
      const top = `${event.clientY}px`;

      dot.style.left = left;
      dot.style.top = top;
      ring.style.left = left;
      ring.style.top = top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
