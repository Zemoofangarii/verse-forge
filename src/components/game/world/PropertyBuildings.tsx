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

function CottageModel({ color }: { color: string }) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.8, 0.8, 4]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.4, 1.01]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#5d3a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Windows */}
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

function LoftModel({ color }: { color: string }) {
  return (
    <group>
      {/* Base floor */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.5, 2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Upper floor */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[2.6, 0.15, 2.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Large window */}
      <mesh position={[0, 1, 1.01]} castShadow>
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshStandardMaterial color="#1e90ff" metalness={0.6} roughness={0.2} emissive="#1e90ff" emissiveIntensity={0.3} />
      </mesh>
      {/* Balcony */}
      <mesh position={[0, 1.5, 1.2]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TowerModel({ color }: { color: string }) {
  return (
    <group>
      {/* Tower base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 3, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Tower middle */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 2, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[1.3, 1.5, 8]} />
        <meshStandardMaterial color="#6b238e" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Flag */}
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.2, 6.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.3} />
      </mesh>
      {/* Windows spiral */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.2) * 1.3, 0.8 + i * 0.8, Math.cos(i * 1.2) * 1.3]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} emissive="#ffd700" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ShopModel({ color }: { color: string }) {
  return (
    <group>
      {/* Shop base */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 1.5, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 1.3, 1.4]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 1]} />
        <meshStandardMaterial color="#e63946" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Storefront window */}
      <mesh position={[0, 0.6, 1.26]} castShadow>
        <boxGeometry args={[2.2, 1, 0.05]} />
        <meshStandardMaterial color="#90e0ef" metalness={0.7} roughness={0.1} emissive="#90e0ef" emissiveIntensity={0.2} />
      </mesh>
      {/* Door */}
      <mesh position={[1.2, 0.5, 1.26]} castShadow>
        <boxGeometry args={[0.5, 1, 0.05]} />
        <meshStandardMaterial color="#5d3a1a" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 1.7, 1.3]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshStandardMaterial color="#2a9d8f" metalness={0.5} roughness={0.5} emissive="#2a9d8f" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function PalaceModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Left tower */}
      <mesh position={[-2, 2.5, -1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 5, 8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-2, 5.3, -1.5]} castShadow>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right tower */}
      <mesh position={[2, 2.5, -1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 5, 8]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[2, 5.3, -1.5]} castShadow>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Central dome */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Grand entrance */}
      <mesh position={[0, 0.8, 2.01]} castShadow>
        <boxGeometry args={[1.5, 1.6, 0.1]} />
        <meshStandardMaterial color="#8b4513" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Windows row */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 2, 2.01]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.05]} />
          <meshStandardMaterial color="#87ceeb" metalness={0.6} roughness={0.2} emissive="#87ceeb" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Pillars */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 2.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.6, 8]} />
          <meshStandardMaterial color="#f5f5dc" metalness={0.3} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function BuildingModel({ modelType, ownerColor }: { modelType: string; ownerColor: string }) {
  switch (modelType) {
    case "cottage":
      return <CottageModel color={ownerColor} />;
    case "loft":
      return <LoftModel color={ownerColor} />;
    case "tower":
      return <TowerModel color={ownerColor} />;
    case "shop":
      return <ShopModel color={ownerColor} />;
    case "palace":
      return <PalaceModel color={ownerColor} />;
    default:
      return <CottageModel color={ownerColor} />;
  }
}

function PropertyBuilding({ property }: { property: PropertyWithType }) {
  const modelType = property.property_type?.model_type || "cottage";
  const ownerColor = property.owner?.avatar_color || "#00ffff";
  const ownerName = property.owner?.username || "Unknown";

  // Get collider size based on model type
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
        <BuildingModel modelType={modelType} ownerColor={ownerColor} />
        {/* Owner name floating above */}
        <Text
          position={[0, colliderSize[1] * 2 + 1, 0]}
          fontSize={0.4}
          color={ownerColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {property.name}
        </Text>
        <Text
          position={[0, colliderSize[1] * 2 + 0.5, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          Owner: {ownerName}
        </Text>
        {/* Glow effect under building */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[colliderSize[0] + 0.5, 32]} />
          <meshStandardMaterial
            color={ownerColor}
            emissive={ownerColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}

export function PropertyBuildings() {
  const [ownedProperties, setOwnedProperties] = useState<PropertyWithType[]>([]);

  useEffect(() => {
    const fetchOwnedProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_type:property_types(*),
          owner:profiles!properties_owner_id_fkey(id, username, avatar_color)
        `)
        .not("owner_id", "is", null);

      if (error) {
        console.error("Error fetching owned properties:", error);
        return;
      }

      setOwnedProperties(data || []);
    };

    fetchOwnedProperties();

    // Subscribe to property changes
    const channel = supabase
      .channel("property-buildings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => {
          fetchOwnedProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {ownedProperties.map((property) => (
        <PropertyBuilding key={property.id} property={property} />
      ))}
    </>
  );
}
