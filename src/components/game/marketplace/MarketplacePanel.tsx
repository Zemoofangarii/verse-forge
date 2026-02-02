import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Building, 
  ShoppingCart, 
  Package, 
  Coins,
  TrendingUp,
  Home,
  Building2,
  Store,
  Castle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/marketplace";
import { PropertyCard } from "./PropertyCard";
import { SellPropertyDialog } from "./SellPropertyDialog";

interface MarketplacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  myProperties: Property[];
  coins: number;
  isLoading: boolean;
  onBuyProperty: (property: Property) => Promise<boolean>;
  onSellProperty: (property: Property, askingPrice: number) => Promise<boolean>;
}

const getPropertyIcon = (modelType: string) => {
  switch (modelType) {
    case "cottage":
      return Home;
    case "loft":
      return Building;
    case "tower":
      return Building2;
    case "shop":
      return Store;
    case "palace":
      return Castle;
    default:
      return Building;
  }
};

export function MarketplacePanel({
  isOpen,
  onClose,
  properties,
  myProperties,
  coins,
  isLoading,
  onBuyProperty,
  onSellProperty,
}: MarketplacePanelProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");

  const handleSellClick = (property: Property) => {
    setSelectedProperty(property);
    setIsSellDialogOpen(true);
  };

  const handleSellConfirm = async (askingPrice: number) => {
    if (selectedProperty) {
      const success = await onSellProperty(selectedProperty, askingPrice);
      if (success) {
        setIsSellDialogOpen(false);
        setSelectedProperty(null);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl border border-primary/20 rounded-2xl" />
            
            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">
                      Property Marketplace
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Buy and sell virtual properties
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Coin Balance */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
                  >
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="font-display font-bold text-yellow-400 text-lg">
                      {coins.toLocaleString()}
                    </span>
                  </motion.div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-xl hover:bg-destructive/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl mb-6">
                    <TabsTrigger
                      value="buy"
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="font-semibold">Buy Properties</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-background/20 text-xs">
                        {properties.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="sell"
                      className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg py-3"
                    >
                      <Package className="w-4 h-4" />
                      <span className="font-semibold">My Properties</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-background/20 text-xs">
                        {myProperties.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Buy Tab */}
                  <TabsContent value="buy" className="flex-1 overflow-y-auto mt-0">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    ) : properties.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Building className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground">
                          No properties available
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          Check back later for new listings
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            type="buy"
                            coins={coins}
                            onAction={() => onBuyProperty(property)}
                            Icon={getPropertyIcon(property.property_type?.model_type || "building")}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Sell Tab */}
                  <TabsContent value="sell" className="flex-1 overflow-y-auto mt-0">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      </div>
                    ) : myProperties.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground">
                          You don't own any properties
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          Purchase properties from the marketplace to get started
                        </p>
                        <Button
                          variant="gaming"
                          className="mt-4"
                          onClick={() => setActiveTab("buy")}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Browse Properties
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myProperties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            type="sell"
                            coins={coins}
                            onAction={() => handleSellClick(property)}
                            Icon={getPropertyIcon(property.property_type?.model_type || "building")}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Footer Stats */}
              <div className="p-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{properties.length} available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{myProperties.length} owned</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span>Market is open</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sell Dialog */}
          <SellPropertyDialog
            isOpen={isSellDialogOpen}
            onClose={() => {
              setIsSellDialogOpen(false);
              setSelectedProperty(null);
            }}
            property={selectedProperty}
            onConfirm={handleSellConfirm}
          />
        </>
      )}
    </AnimatePresence>
  );
}
