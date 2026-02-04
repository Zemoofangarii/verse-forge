import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Projectile as ProjectileType } from '@/types/combat';

interface ProjectileProps {
  projectile: ProjectileType;
}

export function Projectile({ projectile }: ProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    meshRef.current.position.set(
      projectile.position.x,
      projectile.position.y + 0.5,
      projectile.position.z
    );
    
    // Rotate projectile in direction of travel
    const angle = Math.atan2(projectile.direction.x, projectile.direction.z);
    meshRef.current.rotation.y = angle;
  });
  
  return (
    <mesh ref={meshRef} position={[projectile.position.x, projectile.position.y + 0.5, projectile.position.z]}>
      {/* Projectile body */}
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial 
        color="#ffff00" 
        emissive="#ffff00" 
        emissiveIntensity={1} 
      />
      
      {/* Glow effect */}
      <pointLight color="#ffff00" intensity={0.5} distance={2} />
      
      {/* Trail effect */}
      <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.3, 8]} />
        <meshStandardMaterial 
          color="#ff8800" 
          emissive="#ff8800" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </mesh>
  );
}
