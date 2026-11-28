"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ScrollMotionBlur({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    if (reducedMotion || isMobile) return;

    let lastY = window.scrollY;
    let currentBlur = 0;
    let rafId = 0;
    let running = false;

    const tick = () => {
      const y = window.scrollY;
      const velocity = Math.abs(y - lastY);
      lastY = y;

      // Target blur proporsional kecepatan scroll (maks 2.6px)
      const targetBlur = Math.min(velocity * 0.045, 2.6);
      currentBlur += (targetBlur - currentBlur) * 0.25;

      if (currentBlur > 0.04) {
        el.style.filter = `blur(${currentBlur.toFixed(2)}px)`;
        rafId = requestAnimationFrame(tick);
      } else {
        currentBlur = 0;
        el.style.filter = "";
        running = false;
      }
    };

    const onScroll = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      el.style.filter = "";
    };
  }, []);

  return (
    <div ref={ref} className="relative z-10">
      {children}
    </div>
  );
}
