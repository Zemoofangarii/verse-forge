import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Palette, Shapes, Crown, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AvatarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  currentShape: string;
  currentHat: string;
  currentAccessory: string;
  currentParticle: string;
  userId: string;
  onUpdate: (updates: {
    color?: string;
    shape?: string;
    hat?: string;
    accessory?: string;
    particle?: string;
  }) => void;
}

const AVATAR_COLORS = [
  { name: "Cyan", value: "#00ffff" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Lime", value: "#00ff00" },
  { name: "Orange", value: "#ff8c00" },
  { name: "Pink", value: "#ff69b4" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#fbbf24" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Rose", value: "#f43f5e" },
];

const AVATAR_SHAPES = [
  { name: "Capsule", value: "capsule", description: "Classic rounded body" },
  { name: "Cube", value: "cube", description: "Blocky robot style" },
  { name: "Sphere", value: "sphere", description: "Round bouncy ball" },
  { name: "Robot", value: "robot", description: "Mechanical warrior" },
  { name: "Ninja", value: "ninja", description: "Sleek and stealthy" },
];

const AVATAR_HATS = [
  { name: "None", value: "none", icon: "✕" },
  { name: "Crown", value: "crown", icon: "👑" },
  { name: "Wizard", value: "wizard", icon: "🧙" },
  { name: "Party", value: "party", icon: "🎉" },
  { name: "Halo", value: "halo", icon: "😇" },
  { name: "Horns", value: "horns", icon: "😈" },
];

const AVATAR_ACCESSORIES = [
  { name: "None", value: "none", icon: "✕" },
  { name: "Wings", value: "wings", icon: "🪽" },
  { name: "Cape", value: "cape", icon: "🦸" },
  { name: "Shield", value: "shield", icon: "🛡️" },
  { name: "Aura", value: "aura", icon: "✨" },
  { name: "Pet", value: "pet", icon: "🐾" },
];

const AVATAR_PARTICLES = [
  { name: "None", value: "none", icon: "✕" },
  { name: "Sparkles", value: "sparkles", icon: "✨" },
  { name: "Fire", value: "fire", icon: "🔥" },
  { name: "Ice", value: "ice", icon: "❄️" },
  { name: "Hearts", value: "hearts", icon: "💕" },
  { name: "Stars", value: "stars", icon: "⭐" },
];

export function AvatarCustomizer({
  isOpen,
  onClose,
  currentColor,
  currentShape,
  currentHat,
  currentAccessory,
  currentParticle,
  userId,
  onUpdate,
}: AvatarCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedShape, setSelectedShape] = useState(currentShape);
  const [selectedHat, setSelectedHat] = useState(currentHat);
  const [selectedAccessory, setSelectedAccessory] = useState(currentAccessory);
  const [selectedParticle, setSelectedParticle] = useState(currentParticle);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_color: selectedColor,
        avatar_shape: selectedShape,
        avatar_hat: selectedHat,
        avatar_accessory: selectedAccessory,
        avatar_particle: selectedParticle,
      })
      .eq("user_id", userId);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    onUpdate({
      color: selectedColor,
      shape: selectedShape,
      hat: selectedHat,
      accessory: selectedAccessory,
      particle: selectedParticle,
    });
    toast({
      title: "Avatar updated!",
      description: "Your new look is ready.",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Customize Avatar
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <div className="flex justify-center p-6 rounded-xl bg-muted/50">
                <AvatarPreview 
                  color={selectedColor} 
                  shape={selectedShape}
                  hat={selectedHat}
                  accessory={selectedAccessory}
                  particle={selectedParticle}
                />
              </div>
            </div>

            {/* Tabs for different customization categories */}
            <Tabs defaultValue="shape" className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="shape" className="flex items-center gap-1">
                  <Shapes className="w-4 h-4" />
                  <span className="hidden sm:inline">Shape</span>
                </TabsTrigger>
                <TabsTrigger value="hat" className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Hat</span>
                </TabsTrigger>
                <TabsTrigger value="accessory" className="flex items-center gap-1">
                  <Wand2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Accessory</span>
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Effects</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shape">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVATAR_SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      onClick={() => setSelectedShape(shape.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedShape === shape.value
                          ? "border-primary bg-primary/10 shadow-neon"
                          : "border-border hover:border-primary/50 bg-muted/30"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">
                        {shape.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shape.description}
                      </p>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hat">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_HATS.map((hat) => (
                    <button
                      key={hat.value}
                      onClick={() => setSelectedHat(hat.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                        selectedHat === hat.value
                          ? "border-primary bg-primary/10 shadow-neon"
                          : "border-border hover:border-primary/50 bg-muted/30"
                      }`}
                    >
                      <span className="text-2xl mb-1">{hat.icon}</span>
                      <span className="text-xs text-foreground">{hat.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="accessory">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_ACCESSORIES.map((accessory) => (
                    <button
                      key={accessory.value}
                      onClick={() => setSelectedAccessory(accessory.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                        selectedAccessory === accessory.value
                          ? "border-primary bg-primary/10 shadow-neon"
                          : "border-border hover:border-primary/50 bg-muted/30"
                      }`}
                    >
                      <span className="text-2xl mb-1">{accessory.icon}</span>
                      <span className="text-xs text-foreground">{accessory.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="effects">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_PARTICLES.map((particle) => (
                    <button
                      key={particle.value}
                      onClick={() => setSelectedParticle(particle.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                        selectedParticle === particle.value
                          ? "border-primary bg-primary/10 shadow-neon"
                          : "border-border hover:border-primary/50 bg-muted/30"
                      }`}
                    >
                      <span className="text-2xl mb-1">{particle.icon}</span>
                      <span className="text-xs text-foreground">{particle.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Color Selection - Always visible */}
            <div className="mb-6">
              <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                COLOR
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      selectedColor === color.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="gaming"
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 2D Preview component
function AvatarPreview({ 
  color, 
  shape,
  hat,
  accessory,
  particle 
}: { 
  color: string; 
  shape: string;
  hat: string;
  accessory: string;
  particle: string;
}) {
  const renderShape = () => {
    switch (shape) {
      case "cube":
        return (
          <div className="relative w-20 h-28">
            {/* Body */}
            <div
              className="absolute bottom-0 w-16 h-20 rounded-sm left-2"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            {/* Head */}
            <div
              className="absolute top-0 left-3 w-14 h-14 rounded-sm"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            {/* Eyes */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-white rounded-sm" />
            <div className="absolute top-4 left-11 w-3 h-3 bg-white rounded-sm" />
          </div>
        );
      case "sphere":
        return (
          <div className="relative w-24 h-28">
            {/* Body - single sphere */}
            <div
              className="absolute bottom-0 w-24 h-24 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}60` }}
            />
            {/* Eyes */}
            <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full" />
            <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full" />
          </div>
        );
      case "robot":
        return (
          <div className="relative w-24 h-32">
            {/* Body */}
            <div
              className="absolute bottom-0 w-20 h-16 rounded-md left-2"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            >
              {/* Chest plate */}
              <div className="absolute inset-2 rounded bg-black/20" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/80" />
            </div>
            {/* Neck */}
            <div
              className="absolute bottom-14 left-1/2 -translate-x-1/2 w-4 h-4"
              style={{ backgroundColor: color }}
            />
            {/* Head */}
            <div
              className="absolute top-0 left-1 w-22 h-14 rounded-md"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40`, width: '88px' }}
            >
              {/* Visor */}
              <div className="absolute top-3 left-2 right-2 h-6 bg-black/40 rounded" />
              {/* Eyes */}
              <div className="absolute top-5 left-4 w-3 h-2 bg-white rounded-sm" />
              <div className="absolute top-5 right-4 w-3 h-2 bg-white rounded-sm" />
            </div>
            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/60" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500" />
          </div>
        );
      case "ninja":
        return (
          <div className="relative w-20 h-28">
            {/* Body - slim */}
            <div
              className="absolute bottom-0 w-12 h-18 rounded-lg left-4"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40`, height: '72px' }}
            />
            {/* Head */}
            <div
              className="absolute top-0 left-2 w-16 h-12 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            {/* Mask band */}
            <div className="absolute top-3 left-0 w-20 h-4 bg-black/60" />
            {/* Eyes */}
            <div className="absolute top-4 left-5 w-3 h-2 bg-white rounded-sm" />
            <div className="absolute top-4 right-5 w-3 h-2 bg-white rounded-sm" />
            {/* Headband tails */}
            <div className="absolute top-5 -right-2 w-6 h-1 bg-black/60 rotate-12" />
            <div className="absolute top-6 -right-1 w-5 h-1 bg-black/60 rotate-6" />
          </div>
        );
      case "capsule":
      default:
        return (
          <div className="relative w-20 h-28">
            {/* Body */}
            <div
              className="absolute bottom-0 w-14 h-20 rounded-full left-3"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            {/* Head */}
            <div
              className="absolute top-0 left-3 w-14 h-14 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
            />
            {/* Eyes */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-white rounded-full" />
            <div className="absolute top-4 left-11 w-3 h-3 bg-white rounded-full" />
          </div>
        );
    }
  };

  const renderHatIcon = () => {
    const hatItem = AVATAR_HATS.find(h => h.value === hat);
    if (!hatItem || hat === "none") return null;
    return (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
        {hatItem.icon}
      </span>
    );
  };

  const renderAccessoryIcon = () => {
    const accItem = AVATAR_ACCESSORIES.find(a => a.value === accessory);
    if (!accItem || accessory === "none") return null;
    return (
      <span className="absolute top-1/2 -right-6 text-xl">
        {accItem.icon}
      </span>
    );
  };

  const renderParticleIcon = () => {
    const partItem = AVATAR_PARTICLES.find(p => p.value === particle);
    if (!partItem || particle === "none") return null;
    return (
      <>
        <span className="absolute -top-2 -left-4 text-sm animate-pulse">{partItem.icon}</span>
        <span className="absolute top-1/3 -right-4 text-sm animate-pulse delay-100">{partItem.icon}</span>
        <span className="absolute bottom-0 -left-2 text-sm animate-pulse delay-200">{partItem.icon}</span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {renderShape()}
        {renderHatIcon()}
        {renderAccessoryIcon()}
        {renderParticleIcon()}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{shape}</span>
        {hat !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{hat}</span>}
        {accessory !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{accessory}</span>}
        {particle !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{particle}</span>}
      </div>
    </div>
  );
}
