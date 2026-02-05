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
   { name: "Ninja", value: "ninja", description: "Stealthy shadow warrior" },
   { name: "Knight", value: "robot", description: "Armored battle champion" },
   { name: "Wizard", value: "sphere", description: "Mystical spell caster" },
   { name: "Warrior", value: "cube", description: "Fierce tribal fighter" },
   { name: "Casual", value: "capsule", description: "Relaxed street style" },
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
                   <span className="hidden sm:inline">Outfit</span>
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

 // Map shape value to outfit name for display
 function getOutfitName(shape: string): string {
   switch (shape) {
     case "ninja": return "Ninja";
     case "robot": return "Knight";
     case "sphere": return "Wizard";
     case "cube": return "Warrior";
     case "capsule": 
     default: return "Casual";
   }
 }
 
 // 2D Preview component with human-style avatars
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
   const skinTone = "#e0b59a";
   
   const renderHumanAvatar = () => {
     switch (shape) {
       case "ninja":
         return (
           <div className="relative w-24 h-36">
             {/* Legs */}
             <div className="absolute bottom-0 left-6 w-4 h-12 bg-neutral-900 rounded" />
             <div className="absolute bottom-0 left-14 w-4 h-12 bg-neutral-900 rounded" />
             {/* Feet */}
             <div className="absolute bottom-0 left-5 w-5 h-2 bg-neutral-800 rounded" />
             <div className="absolute bottom-0 left-13 w-5 h-2 bg-neutral-800 rounded" style={{ left: '52px' }} />
             {/* Body */}
             <div className="absolute bottom-10 left-4 w-16 h-14 bg-neutral-900 rounded-lg" />
             {/* Vest */}
             <div 
               className="absolute bottom-12 left-6 w-12 h-8 rounded"
               style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }}
             />
             {/* Belt */}
             <div className="absolute bottom-10 left-4 w-16 h-2 bg-amber-800 rounded" />
             {/* Arms */}
             <div className="absolute bottom-14 left-0 w-4 h-10 bg-neutral-900 rounded rotate-12" />
             <div className="absolute bottom-14 right-0 w-4 h-10 bg-neutral-900 rounded -rotate-12" />
             {/* Hands */}
             <div className="absolute bottom-6 left-0 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             <div className="absolute bottom-6 right-0 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* Head with mask */}
             <div className="absolute top-0 left-4 w-16 h-14 bg-neutral-900 rounded-full" />
             {/* Face opening */}
             <div className="absolute top-5 left-6 w-12 h-3 rounded" style={{ backgroundColor: skinTone }} />
             {/* Headband */}
             <div 
               className="absolute top-3 left-4 w-16 h-2 rounded"
               style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }}
             />
             {/* Headband tails */}
             <div style={{ backgroundColor: color }} className="absolute top-4 -right-2 w-5 h-1 rotate-12 rounded" />
             <div style={{ backgroundColor: color }} className="absolute top-5 -right-1 w-4 h-1 rotate-6 rounded" />
             {/* Eyes */}
             <div className="absolute top-5 left-7 w-3 h-1.5 bg-white rounded-sm" />
             <div className="absolute top-5 right-7 w-3 h-1.5 bg-white rounded-sm" />
           </div>
         );
       case "robot": // Knight
         return (
           <div className="relative w-24 h-36">
             {/* Legs */}
             <div className="absolute bottom-0 left-6 w-5 h-11 bg-neutral-500 rounded" />
             <div className="absolute bottom-0 left-13 w-5 h-11 bg-neutral-500 rounded" style={{ left: '52px' }} />
             {/* Feet */}
             <div className="absolute bottom-0 left-5 w-6 h-3 bg-neutral-600 rounded" />
             <div className="absolute bottom-0 right-5 w-6 h-3 bg-neutral-600 rounded" />
             {/* Body armor */}
             <div className="absolute bottom-9 left-3 w-18 h-16 bg-neutral-500 rounded-lg" style={{ width: '72px' }} />
             {/* Chest plate */}
             <div 
               className="absolute bottom-12 left-5 w-14 h-10 rounded"
               style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }}
             />
             {/* Belt */}
             <div className="absolute bottom-9 left-3 w-18 h-3 bg-amber-900 rounded" style={{ width: '72px' }} />
             {/* Arms */}
             <div className="absolute bottom-12 -left-1 w-5 h-12 bg-neutral-500 rounded rotate-6" />
             <div className="absolute bottom-12 -right-1 w-5 h-12 bg-neutral-500 rounded -rotate-6" />
             {/* Helmet */}
             <div className="absolute top-0 left-3 w-18 h-16 bg-neutral-500 rounded-lg" style={{ width: '72px' }} />
             {/* Helmet ridge */}
             <div 
               className="absolute top-1 left-10 w-4 h-8 rounded-full"
               style={{ backgroundColor: color }}
             />
             {/* Visor */}
             <div className="absolute top-5 left-5 w-14 h-5 bg-neutral-800 rounded" />
             {/* Eye slits */}
             <div className="absolute top-6 left-7 w-2 h-3 bg-neutral-600 rounded-sm" />
             <div className="absolute top-6 right-7 w-2 h-3 bg-neutral-600 rounded-sm" />
           </div>
         );
       case "sphere": // Wizard
         return (
           <div className="relative w-24 h-40">
             {/* Robe bottom */}
             <div className="absolute bottom-0 left-2 w-20 h-16 bg-indigo-900 rounded-t-lg" />
             {/* Feet peek */}
             <div className="absolute bottom-0 left-6 w-3 h-2 bg-neutral-700 rounded" />
             <div className="absolute bottom-0 right-6 w-3 h-2 bg-neutral-700 rounded" />
             {/* Body/Robe */}
             <div className="absolute bottom-14 left-3 w-18 h-14 bg-indigo-900 rounded-lg" style={{ width: '72px' }} />
             {/* Robe overlay */}
             <div 
               className="absolute bottom-16 left-5 w-14 h-10 rounded"
               style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }}
             />
             {/* Mystic orb */}
             <div className="absolute bottom-18 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ bottom: '72px', boxShadow: '0 0 10px #00ffff' }} />
             {/* Arms/Sleeves */}
             <div className="absolute bottom-16 -left-1 w-5 h-10 bg-indigo-900 rounded rotate-12" />
             <div className="absolute bottom-16 -right-1 w-5 h-10 bg-indigo-900 rounded -rotate-12" />
             {/* Hands */}
             <div className="absolute bottom-8 -left-1 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             <div className="absolute bottom-8 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* Head */}
             <div className="absolute top-10 left-5 w-14 h-12 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* Wizard hat brim */}
             <div className="absolute top-8 left-2 w-20 h-3 bg-indigo-900 rounded-full" />
             {/* Wizard hat cone */}
             <div className="absolute top-0 left-6 w-0 h-0 border-l-8 border-r-8 border-b-[32px] border-l-transparent border-r-transparent border-b-indigo-900" style={{ borderLeftWidth: '24px', borderRightWidth: '24px', left: '24px' }} />
             {/* Hat stars */}
             <div className="absolute top-2 left-14 w-2 h-2 bg-yellow-400 rotate-45" />
             <div style={{ backgroundColor: color }} className="absolute top-5 left-10 w-1.5 h-1.5 rotate-45" />
             {/* Beard */}
             <div className="absolute top-20 left-8 w-8 h-6 bg-neutral-300 rounded-b-full" />
             {/* Eyes */}
             <div className="absolute top-13 left-7 w-3 h-3 bg-white rounded-full" style={{ top: '52px' }} />
             <div className="absolute top-13 right-7 w-3 h-3 bg-white rounded-full" style={{ top: '52px' }} />
           </div>
         );
       case "cube": // Warrior
         return (
           <div className="relative w-24 h-36">
             {/* Legs */}
             <div className="absolute bottom-0 left-6 w-5 h-11 bg-amber-900 rounded" />
             <div className="absolute bottom-0 left-13 w-5 h-11 bg-amber-900 rounded" style={{ left: '52px' }} />
             {/* Feet */}
             <div className="absolute bottom-0 left-5 w-6 h-2 bg-neutral-800 rounded" />
             <div className="absolute bottom-0 right-5 w-6 h-2 bg-neutral-800 rounded" />
             {/* Body */}
             <div className="absolute bottom-9 left-2 w-20 h-16 bg-amber-900 rounded-lg" />
             {/* Leather straps */}
             <div 
               className="absolute bottom-12 left-5 w-2 h-12 rounded rotate-12"
               style={{ backgroundColor: color }}
             />
             <div 
               className="absolute bottom-12 right-5 w-2 h-12 rounded -rotate-12"
               style={{ backgroundColor: color }}
             />
             {/* Fur collar */}
             <div className="absolute bottom-22 left-4 w-16 h-4 bg-amber-700 rounded-full" style={{ bottom: '88px' }} />
             {/* Arms (bare) */}
             <div className="absolute bottom-14 -left-1 w-5 h-12 rounded rotate-6" style={{ backgroundColor: skinTone }} />
             <div className="absolute bottom-14 -right-1 w-5 h-12 rounded -rotate-6" style={{ backgroundColor: skinTone }} />
             {/* Head */}
             <div className="absolute top-0 left-5 w-14 h-14 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* War paint */}
             <div 
               className="absolute top-6 left-4 w-16 h-1.5 rounded"
               style={{ backgroundColor: color }}
             />
             {/* Mohawk */}
             <div className="absolute -top-1 left-10 w-4 h-8 bg-neutral-900 rounded-t-lg" />
             {/* Eyes */}
             <div className="absolute top-5 left-7 w-3 h-3 bg-white rounded-full" />
             <div className="absolute top-5 right-7 w-3 h-3 bg-white rounded-full" />
             {/* Angry brows */}
             <div className="absolute top-4 left-6 w-4 h-1 bg-neutral-900 rotate-6 rounded" />
             <div className="absolute top-4 right-6 w-4 h-1 bg-neutral-900 -rotate-6 rounded" />
           </div>
         );
       case "capsule": // Casual
       default:
         return (
           <div className="relative w-24 h-36">
             {/* Legs (jeans) */}
             <div className="absolute bottom-0 left-6 w-4 h-12 bg-blue-800 rounded" />
             <div className="absolute bottom-0 left-14 w-4 h-12 bg-blue-800 rounded" style={{ left: '56px' }} />
             {/* Shoes */}
             <div className="absolute bottom-0 left-5 w-5 h-2 bg-neutral-800 rounded" />
             <div className="absolute bottom-0 right-5 w-5 h-2 bg-neutral-800 rounded" />
             {/* Body (T-shirt) */}
             <div 
               className="absolute bottom-10 left-4 w-16 h-14 rounded-lg"
               style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}30` }}
             />
             {/* Collar */}
             <div 
               className="absolute bottom-20 left-8 w-8 h-3 rounded-b-lg"
               style={{ backgroundColor: color, bottom: '80px' }}
             />
             {/* Arms */}
             <div 
               className="absolute bottom-14 left-0 w-4 h-8 rounded rotate-12"
               style={{ backgroundColor: color }}
             />
             <div 
               className="absolute bottom-14 right-0 w-4 h-8 rounded -rotate-12"
               style={{ backgroundColor: color }}
             />
             {/* Hands */}
             <div className="absolute bottom-7 left-0 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             <div className="absolute bottom-7 right-0 w-3 h-3 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* Head */}
             <div className="absolute top-0 left-5 w-14 h-14 rounded-full" style={{ backgroundColor: skinTone }} />
             {/* Hair */}
             <div 
               className="absolute -top-1 left-5 w-14 h-8 rounded-t-full"
               style={{ backgroundColor: color }}
             />
             {/* Hair fringe */}
             <div 
               className="absolute top-1 left-6 w-12 h-3 rounded"
               style={{ backgroundColor: color }}
             />
             {/* Eyes */}
             <div className="absolute top-5 left-7 w-3 h-3 bg-white rounded-full" />
             <div className="absolute top-5 right-7 w-3 h-3 bg-white rounded-full" />
             {/* Pupils */}
             <div className="absolute top-6 left-8 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
             <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-neutral-900 rounded-full" />
             {/* Smile */}
             <div className="absolute top-9 left-9 w-6 h-2 border-b-2 border-neutral-600 rounded-b-full" />
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
         {renderHumanAvatar()}
         {renderHatIcon()}
         {renderAccessoryIcon()}
         {renderParticleIcon()}
       </div>
       <div className="mt-4 flex flex-wrap gap-2 justify-center">
         <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{getOutfitName(shape)}</span>
         {hat !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{hat}</span>}
         {accessory !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{accessory}</span>}
         {particle !== "none" && <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">{particle}</span>}
       </div>
     </div>
   );
 }
