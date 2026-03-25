import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleWave = () => {
  const pointsRef = useRef();
  const groupRef = useRef();
  const { mouse } = useThree();

  // Grid configuration for a very dense cloth/ribbon
  const countX = 150;
  const countZ = 100;
  const separation = 0.3;
  const totalParticles = countX * countZ;

  // Pre-calculate initial positions
  const [positions, initialX, initialZ] = useMemo(() => {
    const pos = new Float32Array(totalParticles * 3);
    const initX = new Float32Array(totalParticles);
    const initZ = new Float32Array(totalParticles);
    let i = 0;
    
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const x = ix * separation - ((countX * separation) / 2);
        const z = iz * separation - ((countZ * separation) / 2);
        pos[i * 3] = x;
        pos[i * 3 + 1] = 0; // Y
        pos[i * 3 + 2] = z;
        
        initX[i] = x;
        initZ[i] = z;
        i++;
      }
    }
    return [pos, initX, initZ];
  }, [countX, countZ, separation, totalParticles]);

  // Update Y positions based on time to create a complex flowing cloth
  useFrame(({ clock }) => {
    if (!pointsRef.current || !groupRef.current) return;
    const time = clock.elapsedTime * 0.5;
    const array = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < totalParticles; i++) {
        const x = initialX[i];
        const z = initialZ[i];
        
        // Complex parametric surface: twisting and folding ribbon
        let y = Math.sin(x * 0.2 + time) * 3.0; // Primary horizontal wave
        y += Math.sin(z * 0.3 - time * 0.8) * 2.0; // Secondary depth wave
        y += Math.sin((x + z) * 0.1 + time * 1.5) * 1.5; // High frequency detail
        
        array[i * 3 + 1] = y;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Smooth Parallax Interaction Effect (whole wave rotates towards mouse)
    const targetRotationX = (mouse.y * 0.5);
    const targetRotationY = (mouse.x * 0.5);
    
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position"
            count={totalParticles}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        {/* Extremely dense small dots creating a halftone effect */}
        <pointsMaterial 
          size={0.05} 
          color="#1B4EDC" 
          sizeAttenuation={true} 
          transparent={true}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default function HeroWaveBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 8, 25], fov: 50 }} // Pulled back slightly for massive ribbon view
        style={{ background: 'transparent', pointerEvents: 'auto' }} // auto allows catching mouse movements
      >
        {/* Rotate slightly to simulate that OCI angled perspective */}
        <group rotation={[-0.2, 0, -0.1]}>
          <ParticleWave />
        </group>
      </Canvas>
      {/* Subtle radial fade */}
      <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at center, transparent 20%, var(--bg-color) 90%)',
          pointerEvents: 'none'
      }} />
    </div>
  );
}
