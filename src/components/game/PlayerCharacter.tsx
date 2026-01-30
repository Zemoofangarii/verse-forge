import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { Player, MovementInput, PlayerPosition } from "@/types/game";
import { Text } from "@react-three/drei";

const MOVE_SPEED = 5;
const JUMP_FORCE = 5;

interface PlayerCharacterProps {
  player: Player;
  isCurrentPlayer?: boolean;
  movement?: MovementInput;
  onPositionUpdate?: (position: PlayerPosition, rotationY: number) => void;
  cameraRef?: React.RefObject<THREE.Object3D>;
}

// Shape-specific mesh components
function CapsuleShape({ color }: { color: string }) {
  return (
    <>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 1.15, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.1, 1.15, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function CubeShape({ color }: { color: string }) {
  return (
    <>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.12, 1.2, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.12, 1.2, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function SphereShape({ color }: { color: string }) {
  return (
    <>
      {/* Single large sphere body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.15, 0.65, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.15, 0.65, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.15, 0.65, 0.48]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.15, 0.65, 0.48]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </>
  );
}

function RobotShape({ color }: { color: string }) {
  return (
    <>
      {/* Body - chest */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Chest detail */}
      <mesh position={[0, 0.5, 0.21]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Chest light */}
      <mesh position={[0, 0.5, 0.22]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.1, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.55, 0.4, 0.45]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 1.1, 0.23]}>
        <boxGeometry args={[0.45, 0.15, 0.02]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} opacity={0.8} transparent />
      </mesh>
      {/* Eyes behind visor */}
      <mesh position={[0.12, 1.1, 0.22]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.12, 1.1, 0.22]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
    </>
  );
}

function NinjaShape({ color }: { color: string }) {
  return (
    <>
      {/* Body - slim */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      {/* Mask band */}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.23, 0.04, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 1.08, 0.18]}>
        <boxGeometry args={[0.06, 0.03, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.08, 1.08, 0.18]}>
        <boxGeometry args={[0.06, 0.03, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      {/* Headband tails */}
      <mesh position={[0.3, 1.05, -0.1]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.35, 1.0, -0.15]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.15, 0.04, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}

function AvatarMesh({ color, shape }: { color: string; shape: string }) {
  switch (shape) {
    case "cube":
      return <CubeShape color={color} />;
    case "sphere":
      return <SphereShape color={color} />;
    case "robot":
      return <RobotShape color={color} />;
    case "ninja":
      return <NinjaShape color={color} />;
    case "capsule":
    default:
      return <CapsuleShape color={color} />;
  }
}

export function PlayerCharacter({
  player,
  isCurrentPlayer = false,
  movement,
  onPositionUpdate,
  cameraRef,
}: PlayerCharacterProps) {
  const rigidBodyRef = useRef<any>(null);
  const meshRef = useRef<THREE.Group>(null);
  const canJumpRef = useRef(true);
  const velocityRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!isCurrentPlayer || !rigidBodyRef.current || !movement) return;

    const rb = rigidBodyRef.current;
    const currentVel = rb.linvel();
    const position = rb.translation();

    // Calculate movement direction based on camera
    let moveX = 0;
    let moveZ = 0;

    if (movement.forward) moveZ -= 1;
    if (movement.backward) moveZ += 1;
    if (movement.left) moveX -= 1;
    if (movement.right) moveX += 1;

    // Normalize diagonal movement
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX /= length;
      moveZ /= length;
    }

    // Apply camera rotation to movement
    const cameraY = cameraRef?.current?.rotation.y ?? 0;
    const cos = Math.cos(cameraY);
    const sin = Math.sin(cameraY);
    const rotatedX = moveX * cos - moveZ * sin;
    const rotatedZ = moveX * sin + moveZ * cos;

    // Set velocity
    velocityRef.current.set(
      rotatedX * MOVE_SPEED,
      currentVel.y,
      rotatedZ * MOVE_SPEED
    );

    // Jump
    if (movement.jump && canJumpRef.current && Math.abs(currentVel.y) < 0.1) {
      velocityRef.current.y = JUMP_FORCE;
      canJumpRef.current = false;
      setTimeout(() => {
        canJumpRef.current = true;
      }, 300);
    }

    rb.setLinvel(velocityRef.current, true);

    // Rotate character to face movement direction
    if (moveX !== 0 || moveZ !== 0) {
      const targetRotation = Math.atan2(rotatedX, rotatedZ);
      if (meshRef.current) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation,
          10 * delta
        );
      }
    }

    // Update position in database
    if (onPositionUpdate) {
      onPositionUpdate(
        { x: position.x, y: position.y, z: position.z },
        meshRef.current?.rotation.y ?? 0
      );
    }
  });

  // Interpolate other players
  useFrame((_, delta) => {
    if (isCurrentPlayer || !meshRef.current) return;

    meshRef.current.position.lerp(
      new THREE.Vector3(
        player.position.x,
        player.position.y - 0.5,
        player.position.z
      ),
      5 * delta
    );

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      player.rotation.y,
      5 * delta
    );
  });

  const characterColor = player.avatar_color || "#00ffff";
  const characterShape = player.avatar_shape || "capsule";

  if (isCurrentPlayer) {
    return (
      <RigidBody
        ref={rigidBodyRef}
        position={[player.position.x, player.position.y, player.position.z]}
        enabledRotations={[false, false, false]}
        colliders={false}
        mass={1}
        linearDamping={4}
      >
        <CuboidCollider args={[0.3, 0.5, 0.3]} position={[0, 0.5, 0]} />
        <group ref={meshRef}>
          <AvatarMesh color={characterColor} shape={characterShape} />
        </group>
      </RigidBody>
    );
  }

  return (
    <group
      ref={meshRef}
      position={[player.position.x, player.position.y - 0.5, player.position.z]}
      rotation={[0, player.rotation.y, 0]}
    >
      {/* Username label */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.username}
      </Text>
      <AvatarMesh color={characterColor} shape={characterShape} />
    </group>
  );
}
