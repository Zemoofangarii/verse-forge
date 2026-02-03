import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useMemo } from "react";

// Generate random positions for decorations
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.6, 0.9, 8]} />
        <meshStandardMaterial color="#388e3c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.4, 0.7, 8]} />
        <meshStandardMaterial color="#43a047" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#558b2f" roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.15, 0.1]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#689f38" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 0.18, -0.1]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#7cb342" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 4]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Bench({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.6, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.08]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      {/* Legs */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.17, 0]} castShadow>
          <boxGeometry args={[0.08, 0.35, 0.4]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
        <meshStandardMaterial color="#424242" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.3, 2.9, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#424242" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Light */}
      <mesh position={[0.5, 2.8, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#fff9c4" emissive="#fff9c4" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0.5, 2.8, 0]} color="#fff9c4" intensity={15} distance={12} />
    </group>
  );
}

export function Terrain() {
  // Generate decorations with seeded random for consistency
  const decorations = useMemo(() => {
    const trees: [number, number, number][] = [];
    const bushes: [number, number, number][] = [];
    const flowers: { position: [number, number, number]; color: string }[] = [];
    const benches: { position: [number, number, number]; rotation: number }[] = [];
    const lamps: [number, number, number][] = [];

    const flowerColors = ["#e91e63", "#9c27b0", "#2196f3", "#ffeb3b", "#ff5722", "#ffffff"];

    // Generate trees around the perimeter and scattered
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 35 + seededRandom(i * 123) * 10;
      trees.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ]);
    }

    // Scattered trees avoiding center
    for (let i = 0; i < 20; i++) {
      const x = (seededRandom(i * 456) - 0.5) * 60;
      const z = (seededRandom(i * 789) - 0.5) * 60;
      if (Math.abs(x) > 8 || Math.abs(z) > 8) {
        trees.push([x, 0, z]);
      }
    }

    // Bushes in clusters
    for (let i = 0; i < 30; i++) {
      const x = (seededRandom(i * 321) - 0.5) * 50;
      const z = (seededRandom(i * 654) - 0.5) * 50;
      if (Math.abs(x) > 5 || Math.abs(z) > 5) {
        bushes.push([x, 0, z]);
      }
    }

    // Flowers in garden patches
    for (let i = 0; i < 80; i++) {
      const patchX = (seededRandom(i * 111) - 0.5) * 40;
      const patchZ = (seededRandom(i * 222) - 0.5) * 40;
      if (Math.abs(patchX) > 6 || Math.abs(patchZ) > 6) {
        flowers.push({
          position: [patchX, 0, patchZ],
          color: flowerColors[Math.floor(seededRandom(i * 333) * flowerColors.length)],
        });
      }
    }

    // Benches along paths
    benches.push(
      { position: [8, 0, 0], rotation: Math.PI / 2 },
      { position: [-8, 0, 0], rotation: -Math.PI / 2 },
      { position: [0, 0, 8], rotation: 0 },
      { position: [0, 0, -8], rotation: Math.PI },
    );

    // Street lamps along main paths
    for (let i = -3; i <= 3; i++) {
      if (i !== 0) {
        lamps.push([i * 10, 0, 3]);
        lamps.push([i * 10, 0, -3]);
        lamps.push([3, 0, i * 10]);
        lamps.push([-3, 0, i * 10]);
      }
    }

    return { trees, bushes, flowers, benches, lamps };
  }, []);

  return (
    <>
      {/* Main ground - grass */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <CuboidCollider args={[50, 0.5, 50]} />
        <mesh receiveShadow>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#4a7c4e" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Central plaza - stone */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.8} />
      </mesh>

      {/* Main streets (cross pattern) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 100]} />
        <meshStandardMaterial color="#424242" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[4, 100]} />
        <meshStandardMaterial color="#424242" roughness={0.7} />
      </mesh>

      {/* Street lane markings */}
      {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((pos, i) => (
        <group key={`lane-${i}`}>
          <mesh position={[pos, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 2]} />
            <meshStandardMaterial color="#ffeb3b" />
          </mesh>
          <mesh position={[0, 0.03, pos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 0.2]} />
            <meshStandardMaterial color="#ffeb3b" />
          </mesh>
        </group>
      ))}

      {/* Sidewalk borders */}
      <mesh position={[2.2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.4, 100]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.6} />
      </mesh>
      <mesh position={[-2.2, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.4, 100]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 2.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 0.4]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, -2.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 0.4]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.6} />
      </mesh>

      {/* Trees */}
      {decorations.trees.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}

      {/* Bushes */}
      {decorations.bushes.map((pos, i) => (
        <Bush key={`bush-${i}`} position={pos} />
      ))}

      {/* Flowers */}
      {decorations.flowers.map((flower, i) => (
        <Flower key={`flower-${i}`} position={flower.position} color={flower.color} />
      ))}

      {/* Benches */}
      {decorations.benches.map((bench, i) => (
        <Bench key={`bench-${i}`} position={bench.position} rotation={bench.rotation} />
      ))}

      {/* Street lamps */}
      {decorations.lamps.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} />
      ))}
    </>
  );
}
