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
          {/* Body */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
            <meshStandardMaterial
              color={characterColor}
              emissive={characterColor}
              emissiveIntensity={0.2}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={characterColor}
              emissive={characterColor}
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
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial
          color={characterColor}
          emissive={characterColor}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={characterColor}
          emissive={characterColor}
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
    </group>
  );
}
