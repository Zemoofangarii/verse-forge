import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { Enemy, EnemyType } from '@/types/combat';

interface EnemyCharacterProps {
  enemy: Enemy;
}

// Enemy colors by type
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

function GoblinModel({ color }: { color: string }) {
  return (
    <>
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
      {/* Eyes */}
      <mesh position={[0.08, 0.65, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.08, 0.65, 0.15]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function SkeletonModel({ color }: { color: string }) {
  return (
    <>
      {/* Ribcage */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Skull */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eye sockets */}
      <mesh position={[0.06, 0.78, 0.12]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.12]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Glowing eyes */}
      <mesh position={[0.06, 0.78, 0.13]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.13]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
    </>
  );
}

function OrcModel({ color }: { color: string }) {
  return (
    <>
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
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.9, 0.14]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function DemonModel({ color }: { color: string }) {
  return (
    <>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
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
      {/* Glowing eyes */}
      <mesh position={[0.08, 0.95, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.08, 0.95, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} />
      </mesh>
      {/* Flame aura */}
      <pointLight position={[0, 0.5, 0]} color="#ff4400" intensity={0.5} distance={3} />
    </>
  );
}

function BossModel({ color }: { color: string }) {
  return (
    <>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
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
      {/* Crown spikes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.22,
            1.72,
            Math.sin((i / 5) * Math.PI * 2) * 0.22
          ]}
        >
          <coneGeometry args={[0.04, 0.15, 6]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Eyes */}
      <mesh position={[0.12, 1.35, 0.22]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.12, 1.35, 0.22]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </mesh>
      {/* Aura */}
      <pointLight position={[0, 1, 0]} color="#7c3aed" intensity={1} distance={5} />
    </>
  );
}

function EnemyModel({ type, color }: { type: EnemyType; color: string }) {
  switch (type) {
    case 'goblin':
      return <GoblinModel color={color} />;
    case 'skeleton':
      return <SkeletonModel color={color} />;
    case 'orc':
      return <OrcModel color={color} />;
    case 'demon':
      return <DemonModel color={color} />;
    case 'boss':
      return <BossModel color={color} />;
    default:
      return <GoblinModel color={color} />;
  }
}

export function EnemyCharacter({ enemy }: EnemyCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);
  
  const color = ENEMY_COLORS[enemy.type];
  const scale = ENEMY_SCALE[enemy.type];
  const healthPercent = enemy.health / enemy.maxHealth;
  
  // Animation
  useFrame((state) => {
    if (!groupRef.current || enemy.state === 'dead') return;
    
    // Bobbing animation
    const bob = Math.sin(state.clock.elapsedTime * 3 + bobOffset.current) * 0.05;
    groupRef.current.position.y = enemy.position.y + bob;
    
    // Face direction of movement
    groupRef.current.rotation.y = enemy.rotation;
  });
  
  if (enemy.state === 'dead') return null;
  
  return (
    <group
      ref={groupRef}
      position={[enemy.position.x, enemy.position.y, enemy.position.z]}
      scale={[scale, scale, scale]}
    >
      {/* Enemy type label */}
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
      
      {/* Health bar background */}
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[0.6, 0.08]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar fill */}
      <mesh position={[-0.3 * (1 - healthPercent), 1.3, 0.01]}>
        <planeGeometry args={[0.6 * healthPercent, 0.06]} />
        <meshBasicMaterial color={healthPercent > 0.3 ? '#22c55e' : '#ef4444'} />
      </mesh>
      
      {/* Enemy model */}
      <EnemyModel type={enemy.type} color={color} />
      
      {/* Attack indicator when attacking */}
      {enemy.state === 'attacking' && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 16]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
