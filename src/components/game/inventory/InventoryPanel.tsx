import { motion, AnimatePresence } from "framer-motion";
import { X, Sword, Shield, Heart, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "coins";
  description: string;
  icon: "sword" | "shield" | "heart" | "sparkles" | "package";
  quantity: number;
  equipped?: boolean;
  onUse?: () => void;
}

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onEquipItem: (itemId: string) => void;
}

const ICON_MAP = {
  sword: Sword,
  shield: Shield,
  heart: Heart,
  sparkles: Sparkles,
  package: Package,
};

const TYPE_COLORS: Record<string, string> = {
  weapon: "text-red-400 bg-red-500/20 border-red-500/30",
  armor: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  consumable: "text-green-400 bg-green-500/20 border-green-500/30",
  coins: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
};

export function InventoryPanel({
  isOpen,
  onClose,
  items,
  onUseItem,
  onEquipItem,
}: InventoryPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel rounded-2xl w-[420px] max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="font-display font-bold text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Inventory
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Items grid */}
            <div className="p-4 overflow-y-auto max-h-[55vh]">
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your inventory is empty.</p>
                  <p className="text-xs mt-1">Defeat enemies to collect loot!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item) => {
                    const IconComponent = ICON_MAP[item.icon] || Package;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative rounded-xl border p-3 transition-all hover:scale-[1.02]",
                          TYPE_COLORS[item.type] || "border-border",
                          item.equipped && "ring-2 ring-primary"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="text-sm font-semibold truncate">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {item.quantity > 1 && (
                            <span className="text-xs font-semibold">
                              x{item.quantity}
                            </span>
                          )}
                          {item.equipped && (
                            <span className="text-xs text-primary font-semibold">
                              Equipped
                            </span>
                          )}
                          <div className="flex gap-1 ml-auto">
                            {item.type === "consumable" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs px-2"
                                onClick={() => onUseItem(item.id)}
                              >
                                Use
                              </Button>
                            )}
                            {(item.type === "weapon" || item.type === "armor") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs px-2"
                                onClick={() => onEquipItem(item.id)}
                              >
                                {item.equipped ? "Unequip" : "Equip"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
