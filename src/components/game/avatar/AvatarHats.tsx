import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface HatProps {
  color: string;
}

export function CrownHat({ color }: HatProps) {
  return (
    <group position={[0, 1.35, 0]}>
      {/* Crown base */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Crown points */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i * Math.PI * 2) / 5) * 0.18,
            0.12,
            Math.cos((i * Math.PI * 2) / 5) * 0.18,
          ]}
        >
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Gems */}
      {[0, 2, 4].map((i) => (
        <mesh
          key={`gem-${i}`}
          position={[
            Math.sin((i * Math.PI * 2) / 5) * 0.18,
            0.18,
            Math.cos((i * Math.PI * 2) / 5) * 0.18,
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export function WizardHat({ color }: HatProps) {
  return (
    <group position={[0, 1.35, 0]}>
      {/* Brim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.35, 16]} />
        <meshStandardMaterial color="#2d1b69" side={THREE.DoubleSide} />
      </mesh>
      {/* Cone */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#2d1b69" />
      </mesh>
      {/* Stars decoration */}
      <mesh position={[0.15, 0.2, 0.1]} rotation={[0, 0, 0.3]}>
        <octahedronGeometry args={[0.03]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[-0.1, 0.35, 0.12]} rotation={[0, 0, -0.2]}>
        <octahedronGeometry args={[0.025]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export function PartyHat({ color }: HatProps) {
  return (
    <group position={[0, 1.35, 0]} rotation={[0, 0, 0.1]}>
      {/* Cone */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.15, 0.35, 16]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
      {/* Stripes */}
      <mesh position={[0, 0.1, 0.08]}>
        <boxGeometry args={[0.02, 0.25, 0.01]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
      <mesh position={[0.07, 0.1, 0.04]}>
        <boxGeometry args={[0.02, 0.25, 0.01]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      {/* Pom pom */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export function HaloHat({ color }: HatProps) {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, 1.5, 0]}>
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.03, 8, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

export function HornsHat({ color }: HatProps) {
  return (
    <group position={[0, 1.25, 0]}>
      {/* Left horn */}
      <mesh position={[-0.15, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.06, 0.25, 8]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
      {/* Right horn */}
      <mesh position={[0.15, 0.1, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.06, 0.25, 8]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
    </group>
  );
}

export function AvatarHat({
  hat,
  color,
}: {
  hat: string;
  color: string;
}) {
  switch (hat) {
    case "crown":
      return <CrownHat color={color} />;
    case "wizard":
      return <WizardHat color={color} />;
    case "party":
      return <PartyHat color={color} />;
    case "halo":
      return <HaloHat color={color} />;
    case "horns":
      return <HornsHat color={color} />;
    default:
      return null;
  }
}
