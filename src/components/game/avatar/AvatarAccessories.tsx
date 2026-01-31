import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AccessoryProps {
  color: string;
}

export function WingsAccessory({ color }: AccessoryProps) {
  const wingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wingsRef.current) {
      const t = state.clock.elapsedTime;
      wingsRef.current.children.forEach((wing, i) => {
        const dir = i === 0 ? 1 : -1;
        wing.rotation.y = dir * (0.2 + Math.sin(t * 4) * 0.15);
      });
    }
  });

  return (
    <group ref={wingsRef} position={[0, 0.7, -0.3]}>
      {/* Left wing */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[0.5, 0.6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.3, 0, 0]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[0.5, 0.6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function CapeAccessory({ color }: AccessoryProps) {
  const capeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (capeRef.current) {
      const t = state.clock.elapsedTime;
      capeRef.current.rotation.x = -0.2 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <mesh ref={capeRef} position={[0, 0.6, -0.35]} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[0.6, 0.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ShieldAccessory({ color }: AccessoryProps) {
  return (
    <group position={[-0.5, 0.5, 0]} rotation={[0, 0.3, 0]}>
      {/* Shield base */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.2, 0.05, 6]} />
        <meshStandardMaterial color="#8b4513" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Shield boss */}
      <mesh position={[0, 0, 0.03]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Shield rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.02, 8, 6]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function AuraAccessory({ color }: AccessoryProps) {
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (auraRef.current) {
      const t = state.clock.elapsedTime;
      auraRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
      auraRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={auraRef} position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.7, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export function PetAccessory({ color }: AccessoryProps) {
  const petRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (petRef.current) {
      const t = state.clock.elapsedTime;
      petRef.current.position.x = 0.6 + Math.sin(t * 2) * 0.1;
      petRef.current.position.y = 0.3 + Math.sin(t * 3) * 0.15;
      petRef.current.position.z = Math.cos(t * 2) * 0.1;
      petRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group ref={petRef} position={[0.6, 0.3, 0]}>
      {/* Pet body */}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Pet eyes */}
      <mesh position={[0.05, 0.03, 0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05, 0.03, 0.1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pet trail */}
      <mesh position={[0, 0, -0.1]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export function AvatarAccessory({
  accessory,
  color,
}: {
  accessory: string;
  color: string;
}) {
  switch (accessory) {
    case "wings":
      return <WingsAccessory color={color} />;
    case "cape":
      return <CapeAccessory color={color} />;
    case "shield":
      return <ShieldAccessory color={color} />;
    case "aura":
      return <AuraAccessory color={color} />;
    case "pet":
      return <PetAccessory color={color} />;
    default:
      return null;
  }
}
