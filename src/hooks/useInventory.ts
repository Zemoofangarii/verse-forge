import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem } from "@/components/game/inventory/InventoryPanel";
import { WEAPONS } from "@/types/combat";

const CONSUMABLE_INFO: Record<string, { name: string; description: string; effect: string; value: number }> = {
  health_potion: { name: "Health Potion", description: "Restores 30 HP", effect: "heal", value: 30 },
  large_health_potion: { name: "Large Health Potion", description: "Restores 60 HP", effect: "heal", value: 60 },
};

const ARMOR_INFO: Record<string, { name: string; description: string }> = {
  demon_armor: { name: "Demon Armor", description: "Dark armor forged in hellfire. +15 max HP" },
  legendary_armor: { name: "Legendary Armor", description: "Legendary protection. +30 max HP" },
};

export function useInventory(profileId: string | null, onHeal?: (amount: number) => void, onEquipWeapon?: (weaponId: string) => void) {
  const [dbItems, setDbItems] = useState<any[]>([]);

  // Fetch inventory from DB
  useEffect(() => {
    if (!profileId) return;
    
    const fetchInventory = async () => {
      const { data } = await supabase
        .from("player_inventory")
        .select("*")
        .eq("profile_id", profileId);
      if (data) setDbItems(data);
    };
    fetchInventory();
  }, [profileId]);

  // Convert DB items to UI items
  const items: InventoryItem[] = dbItems.map((item) => {
    if (item.item_type === "weapon") {
      const weapon = WEAPONS[item.item_name];
      return {
        id: item.id,
        name: weapon?.name || item.item_name,
        type: "weapon" as const,
        description: weapon ? `${weapon.damage} DMG • ${weapon.type}` : "Unknown weapon",
        icon: "sword" as const,
        quantity: 1,
        equipped: item.equipped,
      };
    }
    if (item.item_type === "armor") {
      const armor = ARMOR_INFO[item.item_name];
      return {
        id: item.id,
        name: armor?.name || item.item_name,
        type: "armor" as const,
        description: armor?.description || "Protective armor",
        icon: "shield" as const,
        quantity: 1,
        equipped: item.equipped,
      };
    }
    // consumable
    const consumable = CONSUMABLE_INFO[item.item_name];
    return {
      id: item.id,
      name: consumable?.name || item.item_name,
      type: "consumable" as const,
      description: consumable?.description || "A useful item",
      icon: "heart" as const,
      quantity: (item.item_data as any)?.quantity || 1,
      equipped: false,
    };
  });

  const addItem = useCallback(async (itemType: string, itemName: string) => {
    if (!profileId) return;

    // For consumables, stack quantity
    if (itemType === "consumable") {
      const existing = dbItems.find(i => i.item_name === itemName && i.item_type === "consumable");
      if (existing) {
        const newQty = ((existing.item_data as any)?.quantity || 1) + 1;
        const { data } = await supabase
          .from("player_inventory")
          .update({ item_data: { quantity: newQty } })
          .eq("id", existing.id)
          .select()
          .single();
        if (data) {
          setDbItems(prev => prev.map(i => i.id === existing.id ? data : i));
        }
        return;
      }
    }

    // Check if weapon already owned
    if (itemType === "weapon") {
      const existing = dbItems.find(i => i.item_name === itemName && i.item_type === "weapon");
      if (existing) return; // Already have it
    }

    const { data } = await supabase
      .from("player_inventory")
      .insert({
        profile_id: profileId,
        item_type: itemType,
        item_name: itemName,
        item_data: itemType === "consumable" ? { quantity: 1 } : null,
      })
      .select()
      .single();
    
    if (data) {
      setDbItems(prev => [...prev, data]);
    }
  }, [profileId, dbItems]);

  const useItem = useCallback(async (itemId: string) => {
    const item = dbItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.item_type === "consumable") {
      const info = CONSUMABLE_INFO[item.item_name];
      if (info?.effect === "heal" && onHeal) {
        onHeal(info.value);
      }

      const qty = (item.item_data as any)?.quantity || 1;
      if (qty <= 1) {
        await supabase.from("player_inventory").delete().eq("id", itemId);
        setDbItems(prev => prev.filter(i => i.id !== itemId));
      } else {
        const { data } = await supabase
          .from("player_inventory")
          .update({ item_data: { quantity: qty - 1 } })
          .eq("id", itemId)
          .select()
          .single();
        if (data) {
          setDbItems(prev => prev.map(i => i.id === itemId ? data : i));
        }
      }
    }
  }, [dbItems, onHeal]);

  const equipItem = useCallback(async (itemId: string) => {
    const item = dbItems.find(i => i.id === itemId);
    if (!item) return;

    const newEquipped = !item.equipped;

    // Unequip others of same type
    if (newEquipped) {
      const sameType = dbItems.filter(i => i.item_type === item.item_type && i.equipped && i.id !== itemId);
      for (const other of sameType) {
        await supabase.from("player_inventory").update({ equipped: false }).eq("id", other.id);
      }
      setDbItems(prev => prev.map(i => 
        i.item_type === item.item_type && i.id !== itemId ? { ...i, equipped: false } : i
      ));
    }

    await supabase.from("player_inventory").update({ equipped: newEquipped }).eq("id", itemId);
    setDbItems(prev => prev.map(i => i.id === itemId ? { ...i, equipped: newEquipped } : i));

    // If equipping a weapon, switch to it
    if (item.item_type === "weapon" && newEquipped && onEquipWeapon) {
      onEquipWeapon(item.item_name);
    }
  }, [dbItems, onEquipWeapon]);

  return { items, addItem, useItem, equipItem };
}
