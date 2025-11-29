'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Particles } from './Particles';

export function HeroParticles() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fallback for reduced motion or WebGL unavailable
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-radial from-[var(--color-bg-elevated)] to-[var(--color-bg-base)]" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Suspense fallback={<div className="absolute inset-0 bg-[var(--color-bg-base)]" />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <Particles mousePosition={mousePosition} />
        </Canvas>
      </Suspense>
    </div>
  );
}
