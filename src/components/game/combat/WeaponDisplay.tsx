import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Weapon } from '@/types/combat';

interface WeaponDisplayProps {
  weapon: Weapon;
  isAttacking: boolean;
}

function FistsModel() {
  return null; // No visible weapon for fists
}

function KatanaModel({ isAttacking }: { isAttacking: boolean }) {
  const swordRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!swordRef.current) return;
    
    if (isAttacking) {
      swordRef.current.rotation.x = -Math.PI / 2;
    } else {
      swordRef.current.rotation.x = THREE.MathUtils.lerp(
        swordRef.current.rotation.x,
        -Math.PI / 4,
        0.1
      );
    }
  });
  
  return (
    <group ref={swordRef} position={[0.4, 0.3, 0.3]} rotation={[-Math.PI / 4, 0, 0.3]}>
      {/* Handle */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Guard */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.04]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Blade */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.01]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function NunchucksModel({ isAttacking }: { isAttacking: boolean }) {
  const nunchuckRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!nunchuckRef.current) return;
    
    if (isAttacking) {
      nunchuckRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.5;
    } else {
      nunchuckRef.current.rotation.z = 0;
    }
  });
  
  return (
    <group ref={nunchuckRef} position={[0.4, 0.4, 0.3]}>
      {/* Handle 1 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Chain */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color="#808080" metalness={0.8} />
      </mesh>
      {/* Handle 2 */}
      <mesh position={[0.05, 0.25, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
    </group>
  );
}

function ShurikenModel({ isAttacking }: { isAttacking: boolean }) {
  const shurikenRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!shurikenRef.current) return;
    shurikenRef.current.rotation.z = state.clock.elapsedTime * 5;
  });
  
  return (
    <mesh ref={shurikenRef} position={[0.4, 0.5, 0.3]}>
      <cylinderGeometry args={[0.1, 0.1, 0.01, 4]} />
      <meshStandardMaterial color="#303030" metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function PistolModel({ isAttacking }: { isAttacking: boolean }) {
  const pistolRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!pistolRef.current) return;
    
    if (isAttacking) {
      pistolRef.current.rotation.x = -0.2;
    } else {
      pistolRef.current.rotation.x = THREE.MathUtils.lerp(
        pistolRef.current.rotation.x,
        0,
        0.1
      );
    }
  });
  
  return (
    <group ref={pistolRef} position={[0.4, 0.4, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Handle */}
      <mesh position={[0, -0.08, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.03, 0.12, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.04, 0.06, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function RifleModel({ isAttacking }: { isAttacking: boolean }) {
  const rifleRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!rifleRef.current) return;
    
    if (isAttacking) {
      rifleRef.current.position.z = 0.35;
    } else {
      rifleRef.current.position.z = THREE.MathUtils.lerp(
        rifleRef.current.position.z,
        0.4,
        0.1
      );
    }
  });
  
  return (
    <group ref={rifleRef} position={[0.35, 0.35, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Stock */}
      <mesh position={[0, -0.05, -0.15]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.04, 0.1, 0.2]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.05, 0.08, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.02, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Scope */}
      <mesh position={[0, 0.08, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function WeaponDisplay({ weapon, isAttacking }: WeaponDisplayProps) {
  switch (weapon.id) {
    case 'katana':
      return <KatanaModel isAttacking={isAttacking} />;
    case 'nunchucks':
      return <NunchucksModel isAttacking={isAttacking} />;
    case 'shuriken':
      return <ShurikenModel isAttacking={isAttacking} />;
    case 'pistol':
      return <PistolModel isAttacking={isAttacking} />;
    case 'rifle':
      return <RifleModel isAttacking={isAttacking} />;
    case 'fists':
    default:
      return <FistsModel />;
  }
}
