 import * as THREE from "three";
 import { useRef } from "react";
 import { useFrame } from "@react-three/fiber";
 
 interface HumanAvatarProps {
   color: string;
   outfit: string;
 }
 
 // Skin tone based on avatar color brightness
 function getSkinTone(color: string): string {
   return "#e0b59a"; // Default warm skin tone
 }
 
 // Human body with different outfit styles
 export function HumanAvatar({ color, outfit }: HumanAvatarProps) {
   const skinTone = getSkinTone(color);
   
   return (
     <group>
       {/* Legs */}
       <Legs outfit={outfit} color={color} skinTone={skinTone} />
       {/* Torso */}
       <Torso outfit={outfit} color={color} />
       {/* Arms */}
       <Arms outfit={outfit} color={color} skinTone={skinTone} />
       {/* Head */}
       <Head outfit={outfit} color={color} skinTone={skinTone} />
     </group>
   );
 }
 
 function Legs({ outfit, color, skinTone }: { outfit: string; color: string; skinTone: string }) {
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
   
   return (
     <group position={[0, 0.25, 0]}>
       {/* Left leg */}
       <mesh position={[-0.1, 0, 0]} castShadow>
         <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
         <meshStandardMaterial color={pantColor} />
       </mesh>
       {/* Right leg */}
       <mesh position={[0.1, 0, 0]} castShadow>
         <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
         <meshStandardMaterial color={pantColor} />
       </mesh>
       {/* Feet */}
       <mesh position={[-0.1, -0.22, 0.05]} castShadow>
         <boxGeometry args={[0.1, 0.06, 0.15]} />
         <meshStandardMaterial color={outfit === "ninja" ? "#1a1a1a" : "#2a2a2a"} />
       </mesh>
       <mesh position={[0.1, -0.22, 0.05]} castShadow>
         <boxGeometry args={[0.1, 0.06, 0.15]} />
         <meshStandardMaterial color={outfit === "ninja" ? "#1a1a1a" : "#2a2a2a"} />
       </mesh>
     </group>
   );
 }
 
 function Torso({ outfit, color }: { outfit: string; color: string }) {
   switch (outfit) {
     case "ninja":
       return <NinjaTorso color={color} />;
     case "knight":
       return <KnightTorso color={color} />;
     case "wizard":
       return <WizardTorso color={color} />;
     case "warrior":
       return <WarriorTorso color={color} />;
     case "casual":
       return <CasualTorso color={color} />;
     default:
       return <DefaultTorso color={color} />;
   }
 }
 
 function DefaultTorso({ color }: { color: string }) {
   return (
     <group position={[0, 0.65, 0]}>
       <mesh castShadow>
         <capsuleGeometry args={[0.18, 0.25, 8, 16]} />
         <meshStandardMaterial 
           color={color} 
           emissive={color}
           emissiveIntensity={0.15}
         />
       </mesh>
     </group>
   );
 }
 
 function NinjaTorso({ color }: { color: string }) {
   return (
     <group position={[0, 0.65, 0]}>
       {/* Main body */}
       <mesh castShadow>
         <capsuleGeometry args={[0.16, 0.28, 8, 16]} />
         <meshStandardMaterial color="#1a1a1a" />
       </mesh>
       {/* Chest wrap/vest */}
       <mesh position={[0, 0.02, 0.08]} castShadow>
         <boxGeometry args={[0.28, 0.22, 0.08]} />
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
       </mesh>
       {/* Belt */}
       <mesh position={[0, -0.12, 0]}>
         <cylinderGeometry args={[0.17, 0.17, 0.05, 16]} />
         <meshStandardMaterial color="#8b4513" />
       </mesh>
       {/* Belt buckle */}
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
       {/* Armor body */}
       <mesh castShadow>
         <capsuleGeometry args={[0.2, 0.25, 8, 16]} />
         <meshStandardMaterial 
           color="#6b6b6b" 
           metalness={0.8} 
           roughness={0.3}
         />
       </mesh>
       {/* Chest plate */}
       <mesh position={[0, 0.05, 0.12]} castShadow>
         <boxGeometry args={[0.28, 0.25, 0.06]} />
         <meshStandardMaterial 
           color={color}
           metalness={0.7}
           roughness={0.3}
         />
       </mesh>
       {/* Belt */}
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
       {/* Robe body */}
       <mesh castShadow>
         <capsuleGeometry args={[0.18, 0.3, 8, 16]} />
         <meshStandardMaterial color="#2d1b69" />
       </mesh>
       {/* Robe overlay */}
       <mesh position={[0, -0.05, 0.06]} castShadow>
         <boxGeometry args={[0.3, 0.35, 0.1]} />
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
       </mesh>
       {/* Mystical orb */}
       <mesh position={[0, 0.05, 0.18]}>
         <sphereGeometry args={[0.04, 16, 16]} />
         <meshStandardMaterial 
           color="#00ffff" 
           emissive="#00ffff" 
           emissiveIntensity={1}
           transparent
           opacity={0.8}
         />
       </mesh>
     </group>
   );
 }
 
 function WarriorTorso({ color }: { color: string }) {
   return (
     <group position={[0, 0.65, 0]}>
       {/* Muscular body */}
       <mesh castShadow>
         <capsuleGeometry args={[0.2, 0.28, 8, 16]} />
         <meshStandardMaterial color="#5c3d2e" />
       </mesh>
       {/* Leather straps */}
       <mesh position={[0.1, 0.08, 0.14]} rotation={[0, 0, 0.5]}>
         <boxGeometry args={[0.04, 0.3, 0.02]} />
         <meshStandardMaterial color={color} />
       </mesh>
       <mesh position={[-0.1, 0.08, 0.14]} rotation={[0, 0, -0.5]}>
         <boxGeometry args={[0.04, 0.3, 0.02]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Fur collar */}
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
       {/* T-shirt body */}
       <mesh castShadow>
         <capsuleGeometry args={[0.17, 0.26, 8, 16]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Collar detail */}
       <mesh position={[0, 0.18, 0.08]}>
         <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
         <meshStandardMaterial color={color} />
       </mesh>
     </group>
   );
 }
 
 function Arms({ outfit, color, skinTone }: { outfit: string; color: string; skinTone: string }) {
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
   
   return (
     <group position={[0, 0.65, 0]}>
       {/* Left arm */}
       <group position={[-0.25, 0.05, 0]} rotation={[0, 0, 0.2]}>
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
       <group position={[0.25, 0.05, 0]} rotation={[0, 0, -0.2]}>
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
 
 function Head({ outfit, color, skinTone }: { outfit: string; color: string; skinTone: string }) {
   switch (outfit) {
     case "ninja":
       return <NinjaHead color={color} skinTone={skinTone} />;
     case "knight":
       return <KnightHead color={color} skinTone={skinTone} />;
     case "wizard":
       return <WizardHead color={color} skinTone={skinTone} />;
     case "warrior":
       return <WarriorHead color={color} skinTone={skinTone} />;
     case "casual":
       return <CasualHead color={color} skinTone={skinTone} />;
     default:
       return <DefaultHead color={color} skinTone={skinTone} />;
   }
 }
 
 function DefaultHead({ color, skinTone }: { color: string; skinTone: string }) {
   return (
     <group position={[0, 1.05, 0]}>
       {/* Head */}
       <mesh castShadow>
         <sphereGeometry args={[0.15, 16, 16]} />
         <meshStandardMaterial color={skinTone} />
       </mesh>
       {/* Hair */}
       <mesh position={[0, 0.08, 0]}>
         <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Eyes */}
       <mesh position={[0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       <mesh position={[-0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       {/* Pupils */}
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
       {/* Head with mask */}
       <mesh castShadow>
         <sphereGeometry args={[0.15, 16, 16]} />
         <meshStandardMaterial color="#1a1a1a" />
       </mesh>
       {/* Face opening */}
       <mesh position={[0, 0.02, 0.1]}>
         <boxGeometry args={[0.2, 0.08, 0.1]} />
         <meshStandardMaterial color={skinTone} />
       </mesh>
       {/* Headband */}
       <mesh position={[0, 0.08, 0]}>
         <torusGeometry args={[0.155, 0.025, 8, 32]} />
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
       </mesh>
       {/* Headband tails */}
       <mesh position={[-0.18, 0.08, -0.08]} rotation={[0, 0.5, 0.2]}>
         <boxGeometry args={[0.12, 0.03, 0.01]} />
         <meshStandardMaterial color={color} />
       </mesh>
       <mesh position={[-0.22, 0.05, -0.12]} rotation={[0, 0.3, 0.4]}>
         <boxGeometry args={[0.1, 0.03, 0.01]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Eyes */}
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
       {/* Helmet */}
       <mesh castShadow>
         <sphereGeometry args={[0.16, 16, 16]} />
         <meshStandardMaterial color="#6b6b6b" metalness={0.8} roughness={0.3} />
       </mesh>
       {/* Helmet top ridge */}
       <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
         <capsuleGeometry args={[0.02, 0.15, 8, 16]} />
         <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
       </mesh>
       {/* Visor */}
       <mesh position={[0, 0, 0.12]}>
         <boxGeometry args={[0.18, 0.1, 0.05]} />
         <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
       </mesh>
       {/* Visor slits */}
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
       {/* Head */}
       <mesh castShadow>
         <sphereGeometry args={[0.15, 16, 16]} />
         <meshStandardMaterial color={skinTone} />
       </mesh>
       {/* Wizard hat brim */}
       <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
         <ringGeometry args={[0.12, 0.25, 16]} />
         <meshStandardMaterial color="#2d1b69" side={THREE.DoubleSide} />
       </mesh>
       {/* Wizard hat cone */}
       <mesh position={[0, 0.3, 0]}>
         <coneGeometry args={[0.15, 0.4, 16]} />
         <meshStandardMaterial color="#2d1b69" />
       </mesh>
       {/* Hat stars */}
       <mesh position={[0.1, 0.25, 0.08]}>
         <octahedronGeometry args={[0.025]} />
         <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} />
       </mesh>
       <mesh position={[-0.05, 0.35, 0.1]}>
         <octahedronGeometry args={[0.02]} />
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
       </mesh>
       {/* Beard */}
       <mesh position={[0, -0.08, 0.08]}>
         <coneGeometry args={[0.08, 0.15, 8]} />
         <meshStandardMaterial color="#cccccc" />
       </mesh>
       {/* Eyes */}
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
       {/* Head */}
       <mesh castShadow>
         <sphereGeometry args={[0.15, 16, 16]} />
         <meshStandardMaterial color={skinTone} />
       </mesh>
       {/* War paint */}
       <mesh position={[0, 0.03, 0.13]}>
         <boxGeometry args={[0.2, 0.03, 0.05]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Mohawk */}
       <mesh position={[0, 0.15, 0]} rotation={[0.3, 0, 0]}>
         <boxGeometry args={[0.03, 0.12, 0.2]} />
         <meshStandardMaterial color="#1a1a1a" />
       </mesh>
       {/* Eyes */}
       <mesh position={[0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       <mesh position={[-0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       {/* Angry eyebrows */}
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
       {/* Head */}
       <mesh castShadow>
         <sphereGeometry args={[0.15, 16, 16]} />
         <meshStandardMaterial color={skinTone} />
       </mesh>
       {/* Hair */}
       <mesh position={[0, 0.06, 0]}>
         <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Hair fringe */}
       <mesh position={[0, 0.08, 0.1]}>
         <boxGeometry args={[0.18, 0.04, 0.06]} />
         <meshStandardMaterial color={color} />
       </mesh>
       {/* Eyes */}
       <mesh position={[0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       <mesh position={[-0.05, 0.02, 0.13]}>
         <sphereGeometry args={[0.025, 8, 8]} />
         <meshStandardMaterial color="#ffffff" />
       </mesh>
       {/* Pupils */}
       <mesh position={[0.05, 0.02, 0.155]}>
         <sphereGeometry args={[0.012, 8, 8]} />
         <meshStandardMaterial color="#000000" />
       </mesh>
       <mesh position={[-0.05, 0.02, 0.155]}>
         <sphereGeometry args={[0.012, 8, 8]} />
         <meshStandardMaterial color="#000000" />
       </mesh>
       {/* Smile */}
       <mesh position={[0, -0.04, 0.14]} rotation={[0, 0, 0]}>
         <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
         <meshStandardMaterial color="#cc6666" />
       </mesh>
     </group>
   );
 }