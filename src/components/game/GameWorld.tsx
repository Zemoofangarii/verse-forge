import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { WorldObject } from "@/types/game";
import { PropertyBuildings } from "./world/PropertyBuildings";

// Default world layout
const DEFAULT_WORLD_OBJECTS: WorldObject[] = [
  // Floating platforms
  { id: "platform-1", type: "platform", position: [5, 2, -5], scale: [3, 0.3, 3], color: "#6366f1" },
  { id: "platform-2", type: "platform", position: [-5, 3, -8], scale: [4, 0.3, 4], color: "#8b5cf6" },
  { id: "platform-3", type: "platform", position: [0, 4, -12], scale: [5, 0.3, 5], color: "#a855f7" },
  { id: "platform-4", type: "platform", position: [8, 1.5, 3], scale: [2, 0.3, 2], color: "#ec4899" },
  { id: "platform-5", type: "platform", position: [-8, 2.5, 5], scale: [3, 0.3, 3], color: "#f43f5e" },
  
  // Cubes/obstacles
  { id: "cube-1", type: "cube", position: [3, 0.5, 3], scale: [1, 1, 1], color: "#06b6d4" },
  { id: "cube-2", type: "cube", position: [-3, 0.5, -3], scale: [1, 1, 1], color: "#14b8a6" },
  { id: "cube-3", type: "cube", position: [6, 0.75, -2], scale: [1.5, 1.5, 1.5], color: "#22c55e" },
  { id: "cube-4", type: "cube", position: [-6, 1, 2], scale: [2, 2, 2], color: "#eab308" },
  
  // Ramp
  { id: "ramp-1", type: "ramp", position: [0, 0.5, 5], rotation: [-0.3, 0, 0], scale: [3, 0.2, 4], color: "#f97316" },
  
  // Spheres
  { id: "sphere-1", type: "sphere", position: [-2, 0.5, 6], scale: [0.5, 0.5, 0.5], color: "#00ffff" },
  { id: "sphere-2", type: "sphere", position: [2, 0.5, -6], scale: [0.5, 0.5, 0.5], color: "#ff00ff" },
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
      {/* Ground */}
      <RigidBody type="fixed" position={[0, -0.5, 0]}>
        <CuboidCollider args={[50, 0.5, 50]} />
        <mesh receiveShadow>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      </RigidBody>

      {/* Grid pattern on ground */}
      <gridHelper
        args={[100, 50, "#00ffff", "#16213e"]}
        position={[0, 0.01, 0]}
      />

      {/* World objects */}
      {DEFAULT_WORLD_OBJECTS.map((obj) => (
        <WorldObjectMesh key={obj.id} object={obj} />
      ))}

      {/* Owned property buildings */}
      <PropertyBuildings />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Colored point lights for atmosphere */}
      <pointLight position={[0, 10, 0]} color="#00ffff" intensity={50} distance={50} />
      <pointLight position={[20, 5, 20]} color="#ff00ff" intensity={30} distance={40} />
      <pointLight position={[-20, 5, -20]} color="#ffff00" intensity={30} distance={40} />

      {/* Fog for depth */}
      <fog attach="fog" args={["#0a0a15", 20, 80]} />
    </>
  );
}
