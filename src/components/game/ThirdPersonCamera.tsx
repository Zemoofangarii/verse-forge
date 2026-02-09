import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Player } from "@/types/game";

interface ThirdPersonCameraProps {
  target: Player | null;
  cameraRef: React.RefObject<THREE.Object3D>;
}

const CAMERA_DISTANCE = 8;
const CAMERA_HEIGHT = 4;
const MOUSE_SENSITIVITY = 0.003;

export function ThirdPersonCamera({ target, cameraRef }: ThirdPersonCameraProps) {
  const { camera, gl } = useThree();
  const rotationRef = useRef({ x: 0.3, y: 0 });
  const isPointerLockedRef = useRef(false);
  const targetPositionRef = useRef(new THREE.Vector3());
  const cameraPositionRef = useRef(new THREE.Vector3());

  // Handle pointer lock
  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = () => {
      canvas.requestPointerLock();
    };

    const handlePointerLockChange = () => {
      isPointerLockedRef.current = document.pointerLockElement === canvas;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLockedRef.current) return;

      rotationRef.current.y -= e.movementX * MOUSE_SENSITIVITY;
      rotationRef.current.x -= e.movementY * MOUSE_SENSITIVITY;

      // Clamp vertical rotation
      rotationRef.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, rotationRef.current.x)
      );
    };

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!target) return;

    // Update camera reference rotation for movement
    if (cameraRef.current) {
      cameraRef.current.rotation.y = rotationRef.current.y;
    }

    // Calculate target position
    targetPositionRef.current.set(
      target.position.x,
      target.position.y + 1,
      target.position.z
    );

    // Calculate camera position based on rotation
    const offsetX =
      Math.sin(rotationRef.current.y) *
      Math.cos(rotationRef.current.x) *
      CAMERA_DISTANCE;
    const offsetY = Math.sin(rotationRef.current.x) * CAMERA_DISTANCE + CAMERA_HEIGHT;
    const offsetZ =
      Math.cos(rotationRef.current.y) *
      Math.cos(rotationRef.current.x) *
      CAMERA_DISTANCE;

    // Smoothly interpolate camera position (reuse vector to avoid GC jitter)
    cameraPositionRef.current.set(
      targetPositionRef.current.x + offsetX,
      targetPositionRef.current.y + offsetY,
      targetPositionRef.current.z + offsetZ
    );
    camera.position.lerp(cameraPositionRef.current, 5 * delta);

    // Look at target
    camera.lookAt(targetPositionRef.current);
  });

  return null;
}
