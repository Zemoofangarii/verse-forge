import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Palette, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  currentShape: string;
  userId: string;
  onUpdate: (color: string, shape: string) => void;
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

export function AvatarCustomizer({
  isOpen,
  onClose,
  currentColor,
  currentShape,
  userId,
  onUpdate,
}: AvatarCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedShape, setSelectedShape] = useState(currentShape);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_color: selectedColor,
        avatar_shape: selectedShape,
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

    onUpdate(selectedColor, selectedShape);
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
            className="glass-panel rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                <AvatarPreview color={selectedColor} shape={selectedShape} />
              </div>
            </div>

            {/* Shape Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Shapes className="w-4 h-4" />
                SHAPE
              </h3>
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
            </div>

            {/* Color Selection */}
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
function AvatarPreview({ color, shape }: { color: string; shape: string }) {
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

  return (
    <div className="flex flex-col items-center">
      {renderShape()}
      <p className="mt-4 text-sm text-muted-foreground capitalize">{shape}</p>
    </div>
  );
}
