'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

export function Particles({ count = 220, mousePosition }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { size, viewport } = useThree();

  // Generate particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count, viewport]);

  // Particle velocities
  const velocities = useMemo(() => {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = Math.random() * 0.003 + 0.001;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return vel;
  }, [count]);

  // Update particles
  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion (subtle)
      const dx = positions[i3] - mousePosition.x * viewport.width;
      const dy = positions[i3 + 1] - mousePosition.y * viewport.height;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2) {
        const force = (2 - distance) / 2;
        positions[i3] += (dx / distance) * force * 0.01;
        positions[i3 + 1] += (dy / distance) * force * 0.01;
      }

      // Wrap around edges
      if (positions[i3] > viewport.width) positions[i3] = -viewport.width;
      if (positions[i3] < -viewport.width) positions[i3] = viewport.width;
      if (positions[i3 + 1] > viewport.height) positions[i3 + 1] = -viewport.height;
      if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update connection lines
    if (linesRef.current) {
      const linePositions: number[] = [];
      const maxDistance = 1.5;

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
          }
        }
      }

      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesRef.current.geometry.dispose();
      linesRef.current.geometry = lineGeometry;
    }
  });

  return (
    <>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#30D158"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
