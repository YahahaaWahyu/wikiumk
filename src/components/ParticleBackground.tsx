"use client";

import { useEffect, useRef } from "react";

const PARTICLE_CONFIG = {
  desktopCount: 150,
  mobileCount: 80,
  minSize: 1.5,
  maxSize: 3,
  speed: 0.35,
};

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  phase: number;
  alpha: number;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 500;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const count =
      window.innerWidth < 768
        ? PARTICLE_CONFIG.mobileCount
        : PARTICLE_CONFIG.desktopCount;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size:
        PARTICLE_CONFIG.minSize +
        Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize),
      vx: (Math.random() - 0.5) * PARTICLE_CONFIG.speed,
      vy: (Math.random() - 0.5) * PARTICLE_CONFIG.speed,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.35,
    }));

    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let rafId = 0;
    let isVisible = !document.hidden;
    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb = isDark ? "161, 161, 170" : "63, 63, 70";

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx + Math.cos(tick * 0.012 + p.phase) * 0.12;
          p.y += p.vy + Math.sin(tick * 0.015 + p.phase) * 0.12;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!isVisible) return;
      tick += 1;
      draw();
      if (!reducedMotion) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion) {
        rafId = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    draw();
    if (!reducedMotion) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
