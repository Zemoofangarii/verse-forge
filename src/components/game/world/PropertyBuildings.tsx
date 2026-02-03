import { useEffect, useState } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyType } from "@/types/marketplace";
import { Text } from "@react-three/drei";

interface PropertyWithType extends Property {
  property_type: PropertyType;
  owner: {
    id: string;
    username: string;
    avatar_color: string;
  } | null;
}

function CottageModel({ color, isOwned }: { color: string; isOwned: boolean }) {
  const opacity = isOwned ? 1 : 0.7;
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.8, 0.8, 4]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.4, 1.01]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#5d3a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[-0.5, 0.6, 1.01]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" metalness={0.5} roughness={0.3} emissive="#87ceeb" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.5, 0.6, 1.01]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#87ceeb" metalness={0.5} roughness={0.3} emissive="#87ceeb" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function LoftModel({ color, isOwned }: { color: string; isOwned: boolean }) {
  const opacity = isOwned ? 1 : 0.7;
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[2.6, 0.15, 2.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1, 1.01]} castShadow>
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshStandardMaterial color="#1e90ff" metalness={0.6} roughness={0.2} emissive="#1e90ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 1.2]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TowerModel({ color, isOwned }: { color: string; isOwned: boolean }) {
  const opacity = isOwned ? 1 : 0.7;
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 3, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 2, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[1.3, 1.5, 8]} />
        <meshStandardMaterial color="#6b238e" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.2, 6.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.2) * 1.3, 0.8 + i * 0.8, Math.cos(i * 1.2) * 1.3]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} emissive="#ffd700" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ShopModel({ color, isOwned }: { color: string; isOwned: boolean }) {
  const opacity = isOwned ? 1 : 0.7;
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.5, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.3, 1.4]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 1]} />
        <meshStandardMaterial color="#e63946" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 1.26]} castShadow>
        <boxGeometry args={[2.2, 1, 0.05]} />
        <meshStandardMaterial color="#90e0ef" metalness={0.7} roughness={0.1} emissive="#90e0ef" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[1.2, 0.5, 1.26]} castShadow>
        <boxGeometry args={[0.5, 1, 0.05]} />
        <meshStandardMaterial color="#5d3a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 1.3]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshStandardMaterial color="#2a9d8f" metalness={0.5} roughness={0.5} emissive="#2a9d8f" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function PalaceModel({ color, isOwned }: { color: string; isOwned: boolean }) {
  const opacity = isOwned ? 1 : 0.7;
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-2, 2.5, -1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 5, 8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-2, 5.3, -1.5]} castShadow>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2, 2.5, -1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 5, 8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[2, 5.3, -1.5]} castShadow>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 2.01]} castShadow>
        <boxGeometry args={[1.5, 1.6, 0.1]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 2, 2.01]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.05]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.6} roughness={0.2} emissive="#87ceeb" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 2.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.6, 8]} />
          <meshStandardMaterial color="#f5f5dc" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function BuildingModel({ modelType, ownerColor, isOwned }: { modelType: string; ownerColor: string; isOwned: boolean }) {
  switch (modelType) {
    case "cottage":
      return <CottageModel color={ownerColor} isOwned={isOwned} />;
    case "loft":
      return <LoftModel color={ownerColor} isOwned={isOwned} />;
    case "tower":
      return <TowerModel color={ownerColor} isOwned={isOwned} />;
    case "shop":
      return <ShopModel color={ownerColor} isOwned={isOwned} />;
    case "palace":
      return <PalaceModel color={ownerColor} isOwned={isOwned} />;
    default:
      return <CottageModel color={ownerColor} isOwned={isOwned} />;
  }
}

function PropertyBuilding({ property }: { property: PropertyWithType }) {
  const modelType = property.property_type?.model_type || "cottage";
  const isOwned = !!property.owner_id;
  const ownerColor = isOwned ? (property.owner?.avatar_color || "#00ffff") : "#888888";
  const displayName = property.name;
  const statusText = isOwned 
    ? `Owner: ${property.owner?.username || "Unknown"}` 
    : `💰 ${property.price} coins - FOR SALE`;

  const getColliderSize = (): [number, number, number] => {
    switch (modelType) {
      case "palace":
        return [3, 3, 2.5];
      case "tower":
        return [1.5, 3.5, 1.5];
      case "shop":
        return [1.8, 1, 1.5];
      case "loft":
        return [1.5, 1.5, 1.2];
      default:
        return [1.2, 1, 1.2];
    }
  };

  const colliderSize = getColliderSize();

  return (
    <RigidBody
      type="fixed"
      position={[property.position_x, property.position_y, property.position_z]}
    >
      <CuboidCollider args={colliderSize} position={[0, colliderSize[1], 0]} />
      <group>
        <BuildingModel modelType={modelType} ownerColor={ownerColor} isOwned={isOwned} />
        {/* Property name */}
        <Text
          position={[0, colliderSize[1] * 2 + 1, 0]}
          fontSize={0.4}
          color={isOwned ? ownerColor : "#ffcc00"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {displayName}
        </Text>
        {/* Status text */}
        <Text
          position={[0, colliderSize[1] * 2 + 0.5, 0]}
          fontSize={0.25}
          color={isOwned ? "#ffffff" : "#00ff00"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {statusText}
        </Text>
        {/* Glow effect - green for sale, owner color if owned */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[colliderSize[0] + 0.5, 32]} />
          <meshStandardMaterial
            color={isOwned ? ownerColor : "#00ff00"}
            emissive={isOwned ? ownerColor : "#00ff00"}
            emissiveIntensity={isOwned ? 0.3 : 0.6}
            transparent
            opacity={isOwned ? 0.3 : 0.5}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}

export function PropertyBuildings() {
  const [properties, setProperties] = useState<PropertyWithType[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_type:property_types(*),
          owner:profiles!properties_owner_id_fkey(id, username, avatar_color)
        `);

      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }

      setProperties(data || []);
    };

    fetchProperties();

    const channel = supabase
      .channel("property-buildings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {properties.map((property) => (
        <PropertyBuilding key={property.id} property={property} />
      ))}
    </>
  );
}
