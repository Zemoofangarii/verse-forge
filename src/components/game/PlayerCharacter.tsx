 import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { Player, MovementInput, PlayerPosition } from "@/types/game";
import { Text } from "@react-three/drei";
import { AvatarHat } from "./avatar/AvatarHats";
import { AvatarAccessory } from "./avatar/AvatarAccessories";
 import { AvatarParticle } from "./avatar/AvatarParticles";
 import { HumanAvatar } from "./avatar/HumanAvatar";

 const MOVE_SPEED = 5;
 
 // Human outfit types (replaces abstract shapes)
 const OUTFIT_TYPES = ["ninja", "knight", "wizard", "warrior", "casual"];
const JUMP_FORCE = 5;
const FALL_THRESHOLD = -20;
const SPAWN_POSITION = { x: 0, y: 3, z: 0 };

interface PlayerCharacterProps {
  player: Player;
  isCurrentPlayer?: boolean;
  movement?: MovementInput;
  onPositionUpdate?: (position: PlayerPosition, rotationY: number) => void;
  cameraRef?: React.RefObject<THREE.Object3D>;
}

 // Map old shape names to outfit types for backwards compatibility
 function getOutfitFromShape(shape: string): string {
   switch (shape) {
     case "ninja": return "ninja";
     case "robot": return "knight";
     case "sphere": return "wizard";
     case "cube": return "warrior";
     case "capsule": 
     default: return "casual";
   }
 }

 function AvatarMesh({ 
   color, 
   shape,
   hat,
   accessory,
   particle 
 }: { 
   color: string; 
   shape: string;
   hat?: string;
   accessory?: string;
   particle?: string;
 }) {
   const outfit = useMemo(() => getOutfitFromShape(shape), [shape]);
 
   return (
     <>
       <HumanAvatar color={color} outfit={outfit} />
       {hat && hat !== "none" && <AvatarHat hat={hat} color={color} />}
       {accessory && accessory !== "none" && <AvatarAccessory accessory={accessory} color={color} />}
       {particle && particle !== "none" && <AvatarParticle particle={particle} color={color} />}
     </>
   );
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

    // Respawn if fallen below threshold
    if (position.y < FALL_THRESHOLD) {
      rb.setTranslation(SPAWN_POSITION, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

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
  const characterHat = player.avatar_hat || "none";
  const characterAccessory = player.avatar_accessory || "none";
  const characterParticle = player.avatar_particle || "none";

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
          <AvatarMesh 
            color={characterColor} 
            shape={characterShape}
            hat={characterHat}
            accessory={characterAccessory}
            particle={characterParticle}
          />
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
      <AvatarMesh 
        color={characterColor} 
        shape={characterShape}
        hat={characterHat}
        accessory={characterAccessory}
        particle={characterParticle}
      />
    </group>
  );
}
