import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, AlertTriangle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Property } from "@/types/marketplace";

interface SellPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onConfirm: (askingPrice: number) => void;
}

export function SellPropertyDialog({
  isOpen,
  onClose,
  property,
  onConfirm,
}: SellPropertyDialogProps) {
  const [askingPrice, setAskingPrice] = useState(0);

  useEffect(() => {
    if (property) {
      setAskingPrice(property.price);
    }
  }, [property]);

  if (!property) return null;

  const minPrice = Math.floor(property.price * 0.5);
  const maxPrice = Math.floor(property.price * 1.5);
  const estimatedReturn = Math.floor(askingPrice * 0.8);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md"
          >
            <div className="relative bg-gradient-to-br from-background/98 via-background/95 to-background/98 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl">
              {/* Glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    Sell Property
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-xl hover:bg-destructive/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Property info */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-6">
                  <h4 className="font-semibold text-foreground mb-1">{property.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.property_type?.name || "Property"}
                  </p>
                </div>

                {/* Price slider */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <Label>Asking Price</Label>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <Input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setAskingPrice(Math.min(maxPrice, Math.max(minPrice, val)));
                        }}
                        className="w-24 text-center font-bold"
                      />
                    </div>
                  </div>

                  <Slider
                    value={[askingPrice]}
                    onValueChange={([val]) => setAskingPrice(val)}
                    min={minPrice}
                    max={maxPrice}
                    step={50}
                    className="py-4"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {minPrice.toLocaleString()}</span>
                    <span>Original: {property.price.toLocaleString()}</span>
                    <span>Max: {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Estimated return */}
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-400">Instant Sale</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    The marketplace will buy your property immediately at 80% of the asking price.
                  </p>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-display font-bold text-yellow-400">
                      {estimatedReturn.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">coins</span>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-200">
                    This action cannot be undone. The property will be listed for other players to purchase.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gaming"
                    onClick={() => onConfirm(askingPrice)}
                    className="flex-1"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Sell for {estimatedReturn.toLocaleString()}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
