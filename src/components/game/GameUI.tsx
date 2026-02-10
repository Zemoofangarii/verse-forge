import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, MessageCircle, Wifi, WifiOff, LogOut, Settings, Store, Coins, Package } from "lucide-react";
import { Player } from "@/types/game";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarCustomizer } from "./AvatarCustomizer";
import { MarketplacePanel } from "./marketplace";
import { InventoryPanel, InventoryItem } from "./inventory/InventoryPanel";

interface GameUIProps {
  currentPlayer: Player;
  otherPlayers: Player[];
  isConnected: boolean;
  onChatFocus: (focused: boolean) => void;
  onAvatarUpdate: (updates: {
    color?: string;
    shape?: string;
    hat?: string;
    accessory?: string;
    particle?: string;
  }) => void;
  inventoryItems: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onEquipItem: (itemId: string) => void;
}

export function GameUI({
  currentPlayer,
  otherPlayers,
  isConnected,
  onChatFocus,
  onAvatarUpdate,
  inventoryItems,
  onUseItem,
  onEquipItem,
}: GameUIProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlayersOpen, setIsPlayersOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const { messages, sendMessage } = useChat();
  const { signOut } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Marketplace integration
  const {
    properties,
    myProperties,
    coins,
    isLoading: isMarketplaceLoading,
    buyProperty,
    sellProperty,
  } = useMarketplace(currentPlayer.id);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await sendMessage(messageInput);
    setMessageInput("");
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
          {/* Player info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-xl p-4 flex items-center gap-4"
          >
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="relative group"
            >
              <div
                className="w-12 h-12 rounded-full transition-transform group-hover:scale-105"
                style={{ backgroundColor: currentPlayer.avatar_color }}
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
            </button>
            <div>
              <p className="font-display font-bold text-foreground">
                {currentPlayer.username}
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-success" />
                    <span className="text-success">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Disconnected</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Coin display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-display font-bold text-yellow-400">
                {coins.toLocaleString()}
              </span>
            </div>
          </motion.div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Inventory button */}
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsInventoryOpen(true)}
              title="Inventory (I)"
              className="relative"
            >
              <Package className="w-5 h-5" />
              {inventoryItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {inventoryItems.length}
                </span>
              )}
            </Button>
            {/* Marketplace button */}
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsMarketplaceOpen(true)}
              title="Property Marketplace"
              className="relative"
            >
              <Store className="w-5 h-5" />
              {myProperties.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground font-bold">
                  {myProperties.length}
                </span>
              )}
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsCustomizerOpen(true)}
              title="Customize Avatar"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsPlayersOpen(!isPlayersOpen)}
              className="relative"
            >
              <Users className="w-5 h-5" />
              {otherPlayers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground font-bold">
                  {otherPlayers.length}
                </span>
              )}
            </Button>
            <Button variant="glass" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Players panel */}
        <AnimatePresence>
          {isPlayersOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-20 right-4 w-64 glass-panel rounded-xl p-4 pointer-events-auto"
            >
              <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Online Players
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Current player */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: currentPlayer.avatar_color }}
                  />
                  <span className="text-sm text-foreground flex-1">{currentPlayer.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{currentPlayer.avatar_shape}</span>
                </div>
                {/* Other players */}
                {otherPlayers.map((player) => (
                  <div
                    key={player.user_id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: player.avatar_color }}
                    />
                    <span className="text-sm text-foreground flex-1">{player.username}</span>
                    <span className="text-xs text-muted-foreground capitalize">{player.avatar_shape}</span>
                  </div>
                ))}
                {otherPlayers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No other players online
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat toggle */}
        <Button
          variant="glass"
          size="icon"
          className="absolute bottom-4 left-4 pointer-events-auto"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle className="w-5 h-5" />
          {messages.length > 0 && !isChatOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>

        {/* Chat panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-4 w-80 glass-panel rounded-xl overflow-hidden pointer-events-auto"
            >
              <div className="p-3 border-b border-border/50">
                <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  World Chat
                </h3>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          msg.user_id === currentPlayer.user_id
                            ? currentPlayer.avatar_color
                            : "#fff",
                      }}
                    >
                      {msg.username}:
                    </span>
                    <span className="text-foreground ml-1">{msg.message}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onFocus={() => onChatFocus(true)}
                    onBlur={() => onChatFocus(false)}
                    placeholder="Type a message..."
                    className="flex-1"
                    maxLength={200}
                  />
                  <Button type="submit" size="icon" variant="gaming">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 glass-panel rounded-xl p-3 pointer-events-auto"
        >
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">WASD</span> Move •{" "}
            <span className="text-primary font-semibold">Space</span> Jump •{" "}
            <span className="text-primary font-semibold">Mouse</span> Look
          </p>
        </motion.div>
      </div>

      {/* Avatar Customizer Modal */}
      <AvatarCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentColor={currentPlayer.avatar_color}
        currentShape={currentPlayer.avatar_shape}
        currentHat={currentPlayer.avatar_hat}
        currentAccessory={currentPlayer.avatar_accessory}
        currentParticle={currentPlayer.avatar_particle}
        userId={currentPlayer.user_id}
        onUpdate={onAvatarUpdate}
      />

      {/* Marketplace Panel */}
      <MarketplacePanel
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        properties={properties}
        myProperties={myProperties}
        coins={coins}
        isLoading={isMarketplaceLoading}
        onBuyProperty={buyProperty}
        onSellProperty={sellProperty}
      />

      {/* Inventory Panel */}
      <InventoryPanel
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventoryItems}
        onUseItem={onUseItem}
        onEquipItem={onEquipItem}
      />
    </>
  );
}
