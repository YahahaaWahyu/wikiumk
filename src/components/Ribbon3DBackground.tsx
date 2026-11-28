"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Konfigurasi utama 3D Twisted Ribbon Background (khusus section Artikel Wiki).
 */
const RIBBON_CONFIG = {
  desktopCardCount: 120,
  mobileCardCount: 64,
  ribbonSpan: 21,
  waveAmplitudeY: 1.55,
  waveAmplitudeZ: 1.75,
  twistAmount: Math.PI * 2.4,
  speed: 0.65,
  particleCount: 150,
  colors: [
    "#0f766e", // deep teal
    "#2563eb", // deep blue
    "#7e22ce", // purple
    "#db2777", // magenta / pink
    "#f43f5e", // coral red
  ],
};

function samplePalette(t: number, palette: THREE.Color[], out: THREE.Color) {
  const scaled = Math.max(0, Math.min(1, t)) * (palette.length - 1);
  const idx = Math.floor(scaled);
  const next = Math.min(idx + 1, palette.length - 1);
  const frac = scaled - idx;
  out.copy(palette[idx]).lerp(palette[next], frac);
}

export default function Ribbon3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = window.innerWidth < 768;
    const cardCount = isMobile
      ? RIBBON_CONFIG.mobileCardCount
      : RIBBON_CONFIG.desktopCardCount;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 12.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
    keyLight.position.set(5, 8, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf9a8d4, 0.95);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
    fillLight.position.set(-5, -5, 6);
    scene.add(fillLight);

    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);

    const cardGeometry = new THREE.BoxGeometry(0.11, 2.35, 1.05);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.14,
    });

    const instancedMesh = new THREE.InstancedMesh(
      cardGeometry,
      cardMaterial,
      cardCount
    );
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const palette = RIBBON_CONFIG.colors.map((hex) => new THREE.Color(hex));
    const tempColor = new THREE.Color();
    for (let i = 0; i < cardCount; i++) {
      samplePalette(i / (cardCount - 1), palette, tempColor);
      instancedMesh.setColorAt(i, tempColor);
    }
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    ribbonGroup.add(instancedMesh);

    // ~150 Partikel titik kecil
    const particleCount = RIBBON_CONFIG.particleCount;
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: document.documentElement.classList.contains("dark")
        ? 0xa1a1aa
        : 0x3f3f46,
      size: 2.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.55,
    });

    scene.add(new THREE.Points(particleGeometry, particleMaterial));

    const themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      particleMaterial.color.setHex(isDark ? 0xa1a1aa : 0x3f3f46);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };
    const scrollState = { target: 0, current: 0 };

    const onMouseMove = (e: MouseEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      scrollState.target = progress;
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const dummy = new THREE.Object3D();
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let isVisible = !document.hidden;

    const renderFrame = (now: number) => {
      if (!isVisible) return;
      rafId = requestAnimationFrame(renderFrame);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt * RIBBON_CONFIG.speed;

      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;
      scrollState.current += (scrollState.target - scrollState.current) * 0.06;

      ribbonGroup.position.y = scrollState.current * 2.0;
      ribbonGroup.rotation.y = pointer.x * 0.14;
      ribbonGroup.rotation.x = pointer.y * 0.1 + scrollState.current * 0.1;
      camera.rotation.x = -scrollState.current * 0.08;
      container.style.opacity = String(1 - scrollState.current * 0.45);

      for (let i = 0; i < cardCount; i++) {
        const t = i / (cardCount - 1);
        const x = (t - 0.5) * RIBBON_CONFIG.ribbonSpan;
        const centerEnvelope = Math.sin(t * Math.PI);
        const chaos = Math.sin(t * 14 + elapsed * 1.4) * 0.28 * centerEnvelope;

        const y =
          Math.sin(t * Math.PI * 2.2 - elapsed * 1.1) *
            RIBBON_CONFIG.waveAmplitudeY *
            (0.45 + 0.55 * centerEnvelope) +
          chaos;
        const z =
          Math.cos(t * Math.PI * 2.0 - elapsed * 0.9) *
            RIBBON_CONFIG.waveAmplitudeZ *
            centerEnvelope;

        dummy.position.set(x, y, z);

        const twistX =
          t * RIBBON_CONFIG.twistAmount +
          Math.sin(t * 6 - elapsed * 1.2) * 0.55 * centerEnvelope;
        const twistY = Math.cos(t * 5 + elapsed * 0.8) * 0.42;
        const twistZ =
          Math.sin(t * Math.PI * 2 - elapsed) * 0.35 + chaos * 0.4;

        dummy.rotation.set(twistX, twistY, twistZ);
        dummy.scale.set(
          1,
          0.58 + 0.62 * centerEnvelope,
          0.72 + 0.42 * centerEnvelope
        );
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      const posAttr = particleGeometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const phase = particlePhases[i];
        posAttr.setXY(
          i,
          posAttr.getX(i) + Math.cos(elapsed * 0.5 + phase) * 0.002,
          posAttr.getY(i) + Math.sin(elapsed * 0.7 + phase) * 0.0025
        );
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderFrame);
      } else {
        cancelAnimationFrame(rafId);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      themeObserver.disconnect();
      cardGeometry.dispose();
      cardMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip"
      style={{
        clipPath: "inset(0)",
        maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 82%, transparent 100%)",
      }}
    >
      {/* Sticky 100vh supaya ukuran & rasio 3D ribbon selalu konsisten walau jumlah artikel berubah */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full will-change-transform"
      />
    </div>
  );
}
