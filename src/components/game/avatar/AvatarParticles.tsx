import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleProps {
  color: string;
}

function ParticleSystem({
  count,
  color,
  size,
  speed,
  spread,
  height,
}: {
  count: number;
  color: string;
  size: number;
  speed: number;
  spread: number;
  height: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * speed + speed / 2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [count, spread, height, speed]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * delta * 60;
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

      // Reset particle when it goes too high
      if (positions[i * 3 + 1] > height) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export function SparklesParticle({ color }: ParticleProps) {
  return (
    <group position={[0, 0, 0]}>
      <ParticleSystem
        count={30}
        color="#ffd700"
        size={0.05}
        speed={0.02}
        spread={1}
        height={1.5}
      />
    </group>
  );
}

export function FireParticle({ color }: ParticleProps) {
  return (
    <group position={[0, 0, 0]}>
      <ParticleSystem
        count={40}
        color="#ff4500"
        size={0.08}
        speed={0.04}
        spread={0.5}
        height={1.2}
      />
      <ParticleSystem
        count={20}
        color="#ffa500"
        size={0.06}
        speed={0.03}
        spread={0.3}
        height={1}
      />
    </group>
  );
}

export function IceParticle({ color }: ParticleProps) {
  const iceRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (iceRef.current) {
      iceRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={iceRef} position={[0, 0.5, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i * Math.PI * 2) / 6) * 0.6,
            Math.sin(i * 0.5) * 0.3,
            Math.cos((i * Math.PI * 2) / 6) * 0.6,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <octahedronGeometry args={[0.08]} />
          <meshStandardMaterial
            color="#87ceeb"
            emissive="#87ceeb"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeartsParticle({ color }: ParticleProps) {
  const heartsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (heartsRef.current) {
      heartsRef.current.children.forEach((heart, i) => {
        const t = state.clock.elapsedTime + i * 0.5;
        heart.position.y = 0.5 + ((t * 0.5) % 1.5);
        heart.position.x = Math.sin(t * 2 + i) * 0.3;
        heart.rotation.z = Math.sin(t * 3) * 0.2;
        const scale = 1 - ((t * 0.5) % 1.5) / 1.5;
        heart.scale.setScalar(scale * 0.1);
      });
    }
  });

  return (
    <group ref={heartsRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.5, 0]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ff69b4"
            emissive="#ff69b4"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function StarsParticle({ color }: ParticleProps) {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      starsRef.current.children.forEach((star, i) => {
        const t = state.clock.elapsedTime + i * 0.3;
        star.position.y = 0.5 + Math.sin(t * 2) * 0.2;
        star.rotation.z = t * 2;
        const pulse = 1 + Math.sin(t * 4) * 0.2;
        star.scale.setScalar(0.06 * pulse);
      });
    }
  });

  return (
    <group ref={starsRef} position={[0, 0.5, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i * Math.PI * 2) / 6) * 0.7,
            0,
            Math.cos((i * Math.PI * 2) / 6) * 0.7,
          ]}
        >
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function AvatarParticle({
  particle,
  color,
}: {
  particle: string;
  color: string;
}) {
  switch (particle) {
    case "sparkles":
      return <SparklesParticle color={color} />;
    case "fire":
      return <FireParticle color={color} />;
    case "ice":
      return <IceParticle color={color} />;
    case "hearts":
      return <HeartsParticle color={color} />;
    case "stars":
      return <StarsParticle color={color} />;
    default:
      return null;
  }
}
