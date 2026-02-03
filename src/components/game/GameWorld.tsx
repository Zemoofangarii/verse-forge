import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { WorldObject } from "@/types/game";
import { PropertyBuildings } from "./world/PropertyBuildings";
import { Terrain } from "./world/Terrain";

// Simplified world objects (removed many since terrain now provides decoration)
const DEFAULT_WORLD_OBJECTS: WorldObject[] = [
  // Floating platforms for parkour
  { id: "platform-1", type: "platform", position: [15, 2, -15], scale: [3, 0.3, 3], color: "#6366f1" },
  { id: "platform-2", type: "platform", position: [-15, 3, -18], scale: [4, 0.3, 4], color: "#8b5cf6" },
  { id: "platform-3", type: "platform", position: [20, 4, -22], scale: [5, 0.3, 5], color: "#a855f7" },
];

function WorldObjectMesh({ object }: { object: WorldObject }) {
  const scale = object.scale || [1, 1, 1];
  const rotation = object.rotation || [0, 0, 0];
  const color = object.color || "#00ffff";

  const renderGeometry = () => {
    switch (object.type) {
      case "sphere":
        return <sphereGeometry args={[scale[0], 16, 16]} />;
      case "platform":
      case "ramp":
      case "cube":
      default:
        return <boxGeometry args={scale as [number, number, number]} />;
    }
  };

  return (
    <RigidBody type="fixed" position={object.position} rotation={rotation as [number, number, number]}>
      {object.type === "sphere" ? (
        <CuboidCollider args={[scale[0], scale[0], scale[0]]} />
      ) : (
        <CuboidCollider args={[scale[0] / 2, scale[1] / 2, scale[2] / 2]} />
      )}
      <mesh castShadow receiveShadow>
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </RigidBody>
  );
}

export function GameWorld() {
  return (
    <>
      {/* Terrain with streets and gardens */}
      <Terrain />

      {/* Floating platforms */}
      {DEFAULT_WORLD_OBJECTS.map((obj) => (
        <WorldObjectMesh key={obj.id} object={obj} />
      ))}

      {/* Property buildings */}
      <PropertyBuildings />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />

      {/* Main sun light */}
      <directionalLight
        position={[30, 40, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Fill light */}
      <directionalLight
        position={[-20, 20, -20]}
        intensity={0.3}
        color="#b3e5fc"
      />

      {/* Hemisphere light for natural outdoor feel */}
      <hemisphereLight
        color="#87ceeb"
        groundColor="#4a7c4e"
        intensity={0.5}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={["#e3f2fd", 40, 120]} />
    </>
  );
}
