import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export type CombatAnimState = {
  isAttacking: boolean;
  attackType: 'punch' | 'kick' | 'weapon' | null;
  isMoving: boolean;
  isDead: boolean;
};

interface HumanAvatarProps {
  color: string;
  outfit: string;
  combatAnim?: CombatAnimState;
}

function getSkinTone(): string {
  return "#e0b59a";
}

export function HumanAvatar({ color, outfit, combatAnim }: HumanAvatarProps) {
  const skinTone = getSkinTone();
  const anim = combatAnim || { isAttacking: false, attackType: null, isMoving: false, isDead: false };

  return (
    <group>
      <AnimatedLegs outfit={outfit} color={color} skinTone={skinTone} anim={anim} />
      <Torso outfit={outfit} color={color} />
      <AnimatedArms outfit={outfit} color={color} skinTone={skinTone} anim={anim} />
      <Head outfit={outfit} color={color} skinTone={skinTone} />
    </group>
  );
}

// ===== ANIMATED LEGS =====
function AnimatedLegs({ outfit, color, skinTone, anim }: { outfit: string; color: string; skinTone: string; anim: CombatAnimState }) {
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const getPantColor = () => {
    switch (outfit) {
      case "ninja": return "#1a1a1a";
      case "knight": return "#4a4a4a";
      case "wizard": return "#2d1b69";
      case "warrior": return "#5c3d2e";
      case "casual": return "#3b5998";
      default: return color;
    }
  };

  const pantColor = getPantColor();

  useFrame((state) => {
    if (!leftLegRef.current || !rightLegRef.current) return;
    const t = state.clock.elapsedTime;

    if (anim.isDead) {
      leftLegRef.current.rotation.x = -0.2;
      rightLegRef.current.rotation.x = 0.2;
      return;
    }

    if (anim.isAttacking && anim.attackType === 'kick') {
      // Kick animation: right leg swings forward
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.3, 0.3);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -1.2, 0.35);
      return;
    }

    if (anim.isMoving) {
      // Walk cycle
      const walkSpeed = 8;
      const walkAmp = 0.5;
      leftLegRef.current.rotation.x = Math.sin(t * walkSpeed) * walkAmp;
      rightLegRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * walkAmp;
    } else {
      // Idle breathing / stance
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group position={[0, 0.25, 0]}>
      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.1, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color={pantColor} />
        </mesh>
        <mesh position={[0, -0.22, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.15]} />
          <meshStandardMaterial color={outfit === "ninja" ? "#1a1a1a" : "#2a2a2a"} />
        </mesh>
      </group>
      {/* Right leg */}
      <group ref={rightLegRef} position={[0.1, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color={pantColor} />
        </mesh>
        <mesh position={[0, -0.22, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.15]} />
          <meshStandardMaterial color={outfit === "ninja" ? "#1a1a1a" : "#2a2a2a"} />
        </mesh>
      </group>
    </group>
  );
}

// ===== ANIMATED ARMS =====
function AnimatedArms({ outfit, color, skinTone, anim }: { outfit: string; color: string; skinTone: string; anim: CombatAnimState }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const getSleeveColor = () => {
    switch (outfit) {
      case "ninja": return "#1a1a1a";
      case "knight": return "#6b6b6b";
      case "wizard": return "#2d1b69";
      case "warrior": return skinTone;
      case "casual": return color;
      default: return color;
    }
  };

  const sleeveColor = getSleeveColor();
  const showHands = outfit !== "knight";

  useFrame((state) => {
    if (!leftArmRef.current || !rightArmRef.current) return;
    const t = state.clock.elapsedTime;

    if (anim.isDead) {
      leftArmRef.current.rotation.x = 0.5;
      leftArmRef.current.rotation.z = 0.8;
      rightArmRef.current.rotation.x = 0.5;
      rightArmRef.current.rotation.z = -0.8;
      return;
    }

    if (anim.isAttacking) {
      if (anim.attackType === 'punch') {
        // Punch: right arm thrusts forward
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.5, 0.4);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.3);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.5, 0.2);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.4, 0.2);
      } else if (anim.attackType === 'kick') {
        // During kick, arms go into guard position
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.8, 0.3);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, 0.3);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.8, 0.3);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, 0.3);
      } else if (anim.attackType === 'weapon') {
        // Weapon slash: both arms swing
        const swingPhase = Math.sin(t * 25) * 0.5;
        rightArmRef.current.rotation.x = -1.2 + swingPhase;
        rightArmRef.current.rotation.z = -0.3;
        leftArmRef.current.rotation.x = -0.6;
        leftArmRef.current.rotation.z = 0.3;
      }
      return;
    }

    if (anim.isMoving) {
      // Arm swing while walking
      const walkSpeed = 8;
      const armAmp = 0.4;
      leftArmRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * armAmp;
      rightArmRef.current.rotation.x = Math.sin(t * walkSpeed) * armAmp;
      leftArmRef.current.rotation.z = 0.2;
      rightArmRef.current.rotation.z = -0.2;
    } else {
      // Idle: ninja stance subtle sway
      const idleSway = Math.sin(t * 2) * 0.05;
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, idleSway, 0.08);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -idleSway, 0.08);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, 0.08);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.08);
    }
  });

  return (
    <group position={[0, 0.65, 0]}>
      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.25, 0.05, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
          <meshStandardMaterial
            color={sleeveColor}
            metalness={outfit === "knight" ? 0.7 : 0}
            roughness={outfit === "knight" ? 0.3 : 0.7}
          />
        </mesh>
        {showHands && (
          <mesh position={[0, -0.18, 0]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>
        )}
      </group>
      {/* Right arm */}
      <group ref={rightArmRef} position={[0.25, 0.05, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.05, 0.2, 8, 16]} />
          <meshStandardMaterial
            color={sleeveColor}
            metalness={outfit === "knight" ? 0.7 : 0}
            roughness={outfit === "knight" ? 0.3 : 0.7}
          />
        </mesh>
        {showHands && (
          <mesh position={[0, -0.18, 0]} castShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ===== TORSO (unchanged) =====
function Torso({ outfit, color }: { outfit: string; color: string }) {
  switch (outfit) {
    case "ninja": return <NinjaTorso color={color} />;
    case "knight": return <KnightTorso color={color} />;
    case "wizard": return <WizardTorso color={color} />;
    case "warrior": return <WarriorTorso color={color} />;
    case "casual": return <CasualTorso color={color} />;
    default: return <DefaultTorso color={color} />;
  }
}

function DefaultTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.18, 0.25, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function NinjaTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.16, 0.28, 8, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.02, 0.08]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, -0.12, 0.17]}>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function KnightTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.25, 8, 16]} />
        <meshStandardMaterial color="#6b6b6b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.05, 0.12]} castShadow>
        <boxGeometry args={[0.28, 0.25, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
        <meshStandardMaterial color="#5c3d2e" />
      </mesh>
    </group>
  );
}

function WizardTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.18, 0.3, 8, 16]} />
        <meshStandardMaterial color="#2d1b69" />
      </mesh>
      <mesh position={[0, -0.05, 0.06]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.05, 0.18]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function WarriorTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.28, 8, 16]} />
        <meshStandardMaterial color="#5c3d2e" />
      </mesh>
      <mesh position={[0.1, 0.08, 0.14]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.1, 0.08, 0.14]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.15, 0.05, 8, 16]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
    </group>
  );
}

function CasualTorso({ color }: { color: string }) {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.17, 0.26, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.18, 0.08]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ===== HEAD (unchanged) =====
function Head({ outfit, color, skinTone }: { outfit: string; color: string; skinTone: string }) {
  switch (outfit) {
    case "ninja": return <NinjaHead color={color} skinTone={skinTone} />;
    case "knight": return <KnightHead color={color} skinTone={skinTone} />;
    case "wizard": return <WizardHead color={color} skinTone={skinTone} />;
    case "warrior": return <WarriorHead color={color} skinTone={skinTone} />;
    case "casual": return <CasualHead color={color} skinTone={skinTone} />;
    default: return <DefaultHead color={color} skinTone={skinTone} />;
  }
}

function DefaultHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.05, 0.02, 0.155]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.155]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function NinjaHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.02, 0.1]}>
        <boxGeometry args={[0.2, 0.08, 0.1]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.155, 0.025, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.18, 0.08, -0.08]} rotation={[0, 0.5, 0.2]}>
        <boxGeometry args={[0.12, 0.03, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.22, 0.05, -0.12]} rotation={[0, 0.3, 0.4]}>
        <boxGeometry args={[0.1, 0.03, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.05, 0.02, 0.14]}>
        <boxGeometry args={[0.04, 0.015, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.14]}>
        <boxGeometry args={[0.04, 0.015, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function KnightHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#6b6b6b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.02, 0.15, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.18, 0.1, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.04, 0, 0.15]}>
        <boxGeometry args={[0.02, 0.05, 0.01]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-0.04, 0, 0.15]}>
        <boxGeometry args={[0.02, 0.05, 0.01]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

function WizardHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.25, 16]} />
        <meshStandardMaterial color="#2d1b69" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color="#2d1b69" />
      </mesh>
      <mesh position={[0.1, 0.25, 0.08]}>
        <octahedronGeometry args={[0.025]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.05, 0.35, 0.1]}>
        <octahedronGeometry args={[0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, -0.08, 0.08]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function WarriorHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0, 0.03, 0.13]}>
        <boxGeometry args={[0.2, 0.03, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.03, 0.12, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.05, 0.05, 0.14]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.01, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.05, 0.05, 0.14]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.04, 0.01, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function CasualHead({ color, skinTone }: { color: string; skinTone: string }) {
  return (
    <group position={[0, 1.05, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0, 0.08, -0.02]}>
        <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.13]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.05, 0.02, 0.155]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.155]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}
