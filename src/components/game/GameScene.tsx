import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Stars, Preload } from "@react-three/drei";
import * as THREE from "three";

import { GameWorld } from "./GameWorld";
import { PlayerCharacter } from "./PlayerCharacter";
import { ThirdPersonCamera } from "./ThirdPersonCamera";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { GameUI } from "./GameUI";
import { LoadingScreen } from "./LoadingScreen";

export function GameScene() {
  const { currentPlayer, otherPlayers, isConnected, updatePosition, updateAvatar } = useMultiplayer();
  const { movement, setIsChatFocused } = useKeyboardControls();
  const cameraRef = useRef<THREE.Object3D>(new THREE.Object3D());

  if (!currentPlayer) {
    return <LoadingScreen message="Loading your character..." />;
  }

  return (
    <div className="relative w-full h-screen bg-background">
      <Canvas
        shadows
        camera={{
          fov: 60,
          near: 0.1,
          far: 1000,
          position: [0, 5, 10],
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a15"]} />
          
          {/* Starfield background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          <Physics gravity={[0, -20, 0]} debug={false}>
            {/* Game world */}
            <GameWorld />

            {/* Current player */}
            <PlayerCharacter
              player={currentPlayer}
              isCurrentPlayer
              movement={movement}
              onPositionUpdate={updatePosition}
              cameraRef={cameraRef}
            />

            {/* Other players */}
            {otherPlayers.map((player) => (
              <PlayerCharacter key={player.user_id} player={player} />
            ))}
          </Physics>

          {/* Third person camera */}
          <ThirdPersonCamera target={currentPlayer} cameraRef={cameraRef} />

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Game UI overlay */}
      <GameUI
        currentPlayer={currentPlayer}
        otherPlayers={otherPlayers}
        isConnected={isConnected}
        onChatFocus={setIsChatFocused}
        onAvatarUpdate={updateAvatar}
      />
    </div>
  );
}
