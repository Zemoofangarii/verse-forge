import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { Enemy, EnemyType } from '@/types/combat';

interface EnemyCharacterProps {
  enemy: Enemy;
}

const ENEMY_COLORS: Record<EnemyType, string> = {
  goblin: '#4ade80',
  skeleton: '#e5e5e5',
  orc: '#84cc16',
  demon: '#ef4444',
  boss: '#7c3aed',
};

const ENEMY_SCALE: Record<EnemyType, number> = {
  goblin: 0.7,
  skeleton: 0.9,
  orc: 1.2,
  demon: 1.0,
  boss: 2.0,
};

// ===== ANIMATED ENEMY MODELS =====

function GoblinModel({ color, state }: { color: string; state: string }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (state === 'attacking') {
      // Flailing attack
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 15) * 1.2;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 15 + Math.PI) * 1.2;
      if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 10) * 0.15;
    } else if (state === 'chasing') {
      // Running arms
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 10) * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.6;
      if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 10) * 0.05;
    } else {
      // Idle sway
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.1;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 2 + 1) * 0.1;
      if (bodyRef.current) bodyRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.2, 0.75, 0]} rotation={[0, 0, 0.5]} castShadow>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.2, 0.75, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      <group ref={leftArmRef} position={[-0.3, 0.35, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.2, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.3, 0.35, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.2, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      {/* Eyes */}
      <mesh position={[0.08, 0.65, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={state === 'attacking' ? "#ff0000" : "#cc0000"} emissive={state === 'attacking' ? "#ff0000" : "#cc0000"} emissiveIntensity={state === 'attacking' ? 1 : 0.5} />
      </mesh>
      <mesh position={[-0.08, 0.65, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={state === 'attacking' ? "#ff0000" : "#cc0000"} emissive={state === 'attacking' ? "#ff0000" : "#cc0000"} emissiveIntensity={state === 'attacking' ? 1 : 0.5} />
      </mesh>
    </group>
  );
}

function SkeletonModel({ color, state }: { color: string; state: string }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (state === 'attacking') {
      // Skeleton sword slash motion
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.5 + Math.sin(t * 12) * 0.8;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 8) * 0.3;
      if (jawRef.current) jawRef.current.position.y = -0.12 + Math.sin(t * 15) * 0.03;
    } else if (state === 'chasing') {
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 8) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 8 + Math.PI) * 0.5;
      if (jawRef.current) jawRef.current.position.y = -0.1;
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
      if (jawRef.current) jawRef.current.position.y = -0.1;
    }
  });

  return (
    <>
      {/* Ribcage */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      <group ref={leftArmRef} position={[-0.22, 0.5, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.04, 0.25, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.22, 0.5, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.04, 0.25, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Bone weapon */}
        <mesh position={[0, -0.2, 0.05]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.01, 0.3, 6]} />
          <meshStandardMaterial color="#d4c9a0" />
        </mesh>
      </group>
      {/* Skull */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Jaw */}
      <mesh ref={jawRef} position={[0, -0.1, 0.08]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      {/* Eye sockets + glow */}
      <mesh position={[0.06, 0.78, 0.12]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.12]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.06, 0.78, 0.13]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.13]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
    </>
  );
}

function OrcModel({ color, state }: { color: string; state: string }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (state === 'attacking') {
      // Heavy smash animation
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.8 + Math.abs(Math.sin(t * 6)) * 1.5;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.0 + Math.abs(Math.sin(t * 6)) * 0.8;
      if (bodyRef.current) bodyRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.1;
    } else if (state === 'chasing') {
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 6) * 0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 6 + Math.PI) * 0.4;
      if (bodyRef.current) bodyRef.current.position.y = 0;
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
      if (bodyRef.current) bodyRef.current.position.y = 0;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.4, 0.35, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      <group ref={leftArmRef} position={[-0.35, 0.5, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.35, 0.5, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Club */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
          <meshStandardMaterial color="#5c3d2e" />
        </mesh>
      </group>
      {/* Tusks */}
      <mesh position={[0.12, 0.78, 0.15]} rotation={[0.3, 0, 0.2]}>
        <coneGeometry args={[0.03, 0.12, 6]} />
        <meshStandardMaterial color="#fffdd0" />
      </mesh>
      <mesh position={[-0.12, 0.78, 0.15]} rotation={[0.3, 0, -0.2]}>
        <coneGeometry args={[0.03, 0.12, 6]} />
        <meshStandardMaterial color="#fffdd0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.9, 0.14]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={state === 'attacking' ? 1 : 0.5} />
      </mesh>
      <mesh position={[-0.1, 0.9, 0.14]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={state === 'attacking' ? 1 : 0.5} />
      </mesh>
    </group>
  );
}

function DemonModel({ color, state }: { color: string; state: string }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (state === 'attacking') {
      // Clawing attack
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.5 + Math.sin(t * 18) * 0.8;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.5 + Math.sin(t * 18 + 1) * 0.8;
      if (wingsRef.current) wingsRef.current.rotation.x = Math.sin(t * 12) * 0.3;
    } else if (state === 'chasing') {
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.3;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.3;
      if (wingsRef.current) wingsRef.current.rotation.x = Math.sin(t * 8) * 0.2;
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
      if (wingsRef.current) wingsRef.current.rotation.x = Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Arms */}
      <group ref={leftArmRef} position={[-0.3, 0.55, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
        </mesh>
        {/* Claws */}
        <mesh position={[0, -0.2, 0.05]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.03, 0.08, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.3, 0.55, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, -0.2, 0.05]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.03, 0.08, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      {/* Head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Horns */}
      <mesh position={[0.15, 1.1, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.05, 0.25, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.15, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.05, 0.25, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Wings */}
      <group ref={wingsRef} position={[0, 0.6, -0.2]}>
        <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0.5, 0.5]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshStandardMaterial color="#440000" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.3, 0.1, 0]} rotation={[0, -0.5, -0.5]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshStandardMaterial color="#440000" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      </group>
      {/* Glowing eyes */}
      <mesh position={[0.08, 0.95, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
      <mesh position={[-0.08, 0.95, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
      {/* Flame aura */}
      <pointLight position={[0, 0.5, 0]} color="#ff4400" intensity={state === 'attacking' ? 1.5 : 0.5} distance={3} />
    </>
  );
}

function BossModel({ color, state }: { color: string; state: string }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (state === 'attacking') {
      // Massive slam
      if (rightArmRef.current) rightArmRef.current.rotation.x = -2.0 + Math.abs(Math.sin(t * 5)) * 2.0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -2.0 + Math.abs(Math.sin(t * 5 + 0.5)) * 2.0;
      if (bodyRef.current) bodyRef.current.position.y = Math.abs(Math.sin(t * 5)) * 0.15;
    } else if (state === 'chasing') {
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 4) * 0.3;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.3;
      if (bodyRef.current) bodyRef.current.position.y = 0;
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.03);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.03);
      if (bodyRef.current) bodyRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Arms */}
      <group ref={leftArmRef} position={[-0.55, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        {/* Fist */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.55, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>
      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.45]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.22,
            1.72,
            Math.sin((i / 5) * Math.PI * 2) * 0.22,
          ]}
        >
          <coneGeometry args={[0.04, 0.15, 6]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Eyes */}
      <mesh position={[0.12, 1.35, 0.22]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
      <mesh position={[-0.12, 1.35, 0.22]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={state === 'attacking' ? 2 : 1} />
      </mesh>
      {/* Aura */}
      <pointLight position={[0, 1, 0]} color="#7c3aed" intensity={state === 'attacking' ? 2 : 1} distance={5} />
    </group>
  );
}

function EnemyModel({ type, color, state }: { type: EnemyType; color: string; state: string }) {
  switch (type) {
    case 'goblin': return <GoblinModel color={color} state={state} />;
    case 'skeleton': return <SkeletonModel color={color} state={state} />;
    case 'orc': return <OrcModel color={color} state={state} />;
    case 'demon': return <DemonModel color={color} state={state} />;
    case 'boss': return <BossModel color={color} state={state} />;
    default: return <GoblinModel color={color} state={state} />;
  }
}

// ===== DEATH ANIMATION =====
function DeathEffect({ position, color }: { position: { x: number; y: number; z: number }; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    groupRef.current.scale.setScalar(Math.max(0, 1 - elapsed * 2));
    groupRef.current.rotation.y += 0.15;
    groupRef.current.position.y += 0.02;
  });

  return (
    <group ref={groupRef} position={[position.x, position.y + 0.5, position.z]}>
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.4,
            Math.sin(i * 1.3) * 0.3,
            Math.sin((i / 6) * Math.PI * 2) * 0.4,
          ]}
        >
          <octahedronGeometry args={[0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ===== HIT FLASH =====
function HitFlash({ enemy }: { enemy: Enemy }) {
  const flashRef = useRef<THREE.Mesh>(null);
  const prevHealth = useRef(enemy.health);

  useFrame(() => {
    if (!flashRef.current) return;
    if (enemy.health < prevHealth.current) {
      flashRef.current.visible = true;
      setTimeout(() => {
        if (flashRef.current) flashRef.current.visible = false;
      }, 100);
    }
    prevHealth.current = enemy.health;
  });

  return (
    <mesh ref={flashRef} position={[0, 0.5, 0]} visible={false}>
      <sphereGeometry args={[0.8, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </mesh>
  );
}

export function EnemyCharacter({ enemy }: EnemyCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  const color = ENEMY_COLORS[enemy.type];
  const scale = ENEMY_SCALE[enemy.type];
  const healthPercent = enemy.health / enemy.maxHealth;

  useFrame((state) => {
    if (!groupRef.current) return;

    if (enemy.state === 'dead') {
      // Collapse animation
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, 0.05, 0.1);
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, 1.3 * scale, 0.1);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, 1.3 * scale, 0.1);
      return;
    }

    // Normal scale
    groupRef.current.scale.set(scale, scale, scale);

    // Bobbing
    const bobSpeed = enemy.state === 'chasing' ? 6 : enemy.state === 'attacking' ? 8 : 3;
    const bobAmp = enemy.state === 'attacking' ? 0.08 : 0.05;
    const bob = Math.sin(state.clock.elapsedTime * bobSpeed + bobOffset.current) * bobAmp;
    groupRef.current.position.y = enemy.position.y + bob;

    // Lean forward when chasing
    if (enemy.state === 'chasing') {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.15, 0.1);
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
    }

    groupRef.current.rotation.y = enemy.rotation;
  });

  if (enemy.state === 'dead') {
    return (
      <>
        <group
          ref={groupRef}
          position={[enemy.position.x, enemy.position.y, enemy.position.z]}
          scale={[scale, scale, scale]}
        >
          <EnemyModel type={enemy.type} color={color} state="dead" />
        </group>
        <DeathEffect position={enemy.position} color={color} />
      </>
    );
  }

  return (
    <group
      ref={groupRef}
      position={[enemy.position.x, enemy.position.y, enemy.position.z]}
      scale={[scale, scale, scale]}
    >
      {/* Name */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {enemy.type.toUpperCase()}
      </Text>

      {/* Health bar */}
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[0.6, 0.08]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.3 * (1 - healthPercent), 1.3, 0.01]}>
        <planeGeometry args={[0.6 * healthPercent, 0.06]} />
        <meshBasicMaterial color={healthPercent > 0.3 ? '#22c55e' : '#ef4444'} />
      </mesh>

      {/* Enemy model with state */}
      <EnemyModel type={enemy.type} color={color} state={enemy.state} />

      {/* Hit flash */}
      <HitFlash enemy={enemy} />

      {/* Attack ring */}
      {enemy.state === 'attacking' && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 16]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
