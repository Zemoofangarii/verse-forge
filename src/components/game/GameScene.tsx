import { useRef, Suspense, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Stars, Preload } from "@react-three/drei";
import * as THREE from "three";

import { GameWorld } from "./GameWorld";
import { PlayerCharacter } from "./PlayerCharacter";
import { ThirdPersonCamera } from "./ThirdPersonCamera";
import { EnemyCharacter, Projectile, CombatHUD } from "./combat";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useCombat } from "@/hooks/useCombat";
import { useInventory } from "@/hooks/useInventory";
import { GameUI } from "./GameUI";
import { LoadingScreen } from "./LoadingScreen";

// Combat update component that runs inside Canvas
function CombatManager({ 
  combat 
}: { 
  combat: ReturnType<typeof useCombat> 
}) {
  const lastUpdateRef = useRef(0);
  
  useFrame((_, delta) => {
    // Spawn enemies periodically
    combat.spawnEnemy();
    
    // Update enemy AI
    combat.updateEnemies(delta);
    
    // Process enemy attacks
    combat.processEnemyAttacks(delta);
    
    // Update projectiles
    combat.updateProjectiles(delta);
    
    // Process dead enemies (with throttle)
    const now = Date.now();
    if (now - lastUpdateRef.current > 500) {
      lastUpdateRef.current = now;
      combat.processDeadEnemies();
    }
  });
  
  return null;
}

export function GameScene() {
  const { currentPlayer, otherPlayers, isConnected, updatePosition, updateAvatar } = useMultiplayer();
  const { movement, attackInputs, setIsChatFocused, setAttackInputs } = useKeyboardControls();
  const cameraRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const addItemRef = useRef<(itemType: string, itemName: string) => void>(() => {});
  
  // Combat system — uses ref to avoid circular deps
  const combat = useCombat({
    currentPlayer,
    profileId: currentPlayer?.id || null,
    onLootDrop: (itemType, itemName) => addItemRef.current(itemType, itemName),
  });

  // Inventory system
  const { items: inventoryItems, addItem, useItem, equipItem } = useInventory(
    currentPlayer?.id || null,
    combat.heal,
    combat.equipWeapon,
  );
  
  // Keep ref up to date
  addItemRef.current = addItem;
  // Handle keyboard weapon switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const weaponKeys: Record<string, string> = {
        '1': 'fists',
        '2': 'katana',
        '3': 'nunchucks',
        '4': 'shuriken',
        '5': 'pistol',
        '6': 'rifle',
      };
      
      if (weaponKeys[e.key]) {
        combat.equipWeapon(weaponKeys[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combat.equipWeapon]);
  
  // Handle attack inputs
  useEffect(() => {
    if (attackInputs.punch) {
      combat.punch();
      setAttackInputs(prev => ({ ...prev, punch: false }));
    }
    if (attackInputs.kick) {
      combat.kick();
      setAttackInputs(prev => ({ ...prev, kick: false }));
    }
    if (attackInputs.weaponAttack) {
      combat.attack();
      setAttackInputs(prev => ({ ...prev, weaponAttack: false }));
    }
  }, [attackInputs, combat.punch, combat.kick, combat.attack, setAttackInputs]);
  
  // Compute combat animation state for the avatar
  const isMoving = !!(movement?.forward || movement?.backward || movement?.left || movement?.right);
  const combatAnimState = useMemo(() => ({
    isAttacking: combat.combatState.isAttacking,
    attackType: combat.currentAttackType,
    isMoving,
    isDead: combat.combatState.health <= 0,
  }), [combat.combatState.isAttacking, combat.currentAttackType, isMoving, combat.combatState.health]);
  
  // Handle mouse click for attack
  const handleCanvasClick = useCallback(() => {
    combat.attack();
  }, [combat.attack]);
  
  // Handle respawn
  useEffect(() => {
    if (combat.combatState.health <= 0) {
      // Respawn after 2 seconds
      const timeout = setTimeout(() => {
        combat.respawn();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [combat.combatState.health, combat.respawn]);

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
        onClick={handleCanvasClick}
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
              combatAnim={combatAnimState}
            />

            {/* Other players */}
            {otherPlayers.map((player) => (
              <PlayerCharacter key={player.user_id} player={player} />
            ))}
          </Physics>
          
          {/* Enemies */}
          {combat.combatState.enemies.map((enemy) => (
            <EnemyCharacter key={enemy.id} enemy={enemy} />
          ))}
          
          {/* Projectiles */}
          {combat.projectiles.map((proj) => (
            <Projectile key={proj.id} projectile={proj} />
          ))}
          
          {/* Combat manager for updates */}
          <CombatManager combat={combat} />

          {/* Third person camera */}
          <ThirdPersonCamera target={currentPlayer} cameraRef={cameraRef} />

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Combat HUD overlay */}
      <CombatHUD
        combatState={combat.combatState}
        notifications={combat.notifications}
        currentAttackType={combat.currentAttackType}
        onEquipWeapon={combat.equipWeapon}
        onAttack={combat.attack}
        onPunch={combat.punch}
        onKick={combat.kick}
      />

      {/* Game UI overlay */}
      <GameUI
        currentPlayer={currentPlayer}
        otherPlayers={otherPlayers}
        isConnected={isConnected}
        onChatFocus={setIsChatFocused}
        onAvatarUpdate={updateAvatar}
        inventoryItems={inventoryItems}
        onUseItem={useItem}
        onEquipItem={equipItem}
      />
    </div>
  );
}
