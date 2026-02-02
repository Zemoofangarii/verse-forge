import { motion } from "framer-motion";
import { Coins, LucideIcon, Tag, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/marketplace";

interface PropertyCardProps {
  property: Property;
  type: "buy" | "sell";
  coins: number;
  onAction: () => void;
  Icon: LucideIcon;
}

export function PropertyCard({ property, type, coins, onAction, Icon }: PropertyCardProps) {
  const canAfford = coins >= property.price;
  const estimatedSellValue = Math.floor(property.price * 0.8);

  // Generate gradient based on property type
  const getGradient = () => {
    const modelType = property.property_type?.model_type || "building";
    switch (modelType) {
      case "cottage":
        return "from-green-500/20 to-emerald-600/20";
      case "loft":
        return "from-blue-500/20 to-cyan-600/20";
      case "tower":
        return "from-purple-500/20 to-violet-600/20";
      case "shop":
        return "from-amber-500/20 to-orange-600/20";
      case "palace":
        return "from-pink-500/20 to-rose-600/20";
      default:
        return "from-primary/20 to-accent/20";
    }
  };

  const getIconColor = () => {
    const modelType = property.property_type?.model_type || "building";
    switch (modelType) {
      case "cottage":
        return "text-green-400";
      case "loft":
        return "text-blue-400";
      case "tower":
        return "text-purple-400";
      case "shop":
        return "text-amber-400";
      case "palace":
        return "text-pink-400";
      default:
        return "text-primary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50 group-hover:opacity-70 transition-opacity`} />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl" />
      </div>

      <div className="relative p-4">
        {/* Icon & Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-3 rounded-lg bg-background/50 border border-border/50`}>
            <Icon className={`w-6 h-6 ${getIconColor()}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-foreground truncate">
              {property.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {property.property_type?.name || "Property"}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
          {property.description || "A beautiful virtual property"}
        </p>

        {/* Price section */}
        <div className="flex items-center justify-between mb-4">
          {type === "buy" ? (
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-display font-bold text-lg text-yellow-400">
                {property.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span>Original: {property.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-green-400">
                  Est. value: {estimatedSellValue.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <Button
          onClick={onAction}
          disabled={type === "buy" && !canAfford}
          variant={type === "buy" ? "gaming" : "outline"}
          className="w-full"
        >
          {type === "buy" ? (
            canAfford ? (
              <>
                <Coins className="w-4 h-4 mr-2" />
                Buy Now
              </>
            ) : (
              "Not enough coins"
            )
          ) : (
            <>
              <Tag className="w-4 h-4 mr-2" />
              Sell Property
            </>
          )}
        </Button>

        {/* Affordability indicator for buy */}
        {type === "buy" && (
          <div className="mt-2 text-center">
            {canAfford ? (
              <span className="text-xs text-success">
                You'll have {(coins - property.price).toLocaleString()} coins left
              </span>
            ) : (
              <span className="text-xs text-destructive">
                Need {(property.price - coins).toLocaleString()} more coins
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
