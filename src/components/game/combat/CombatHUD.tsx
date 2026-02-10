import { motion } from 'framer-motion';
import { Heart, Zap, Crosshair, Sword, Target, Hand, Footprints } from 'lucide-react';
import { CombatState, WEAPONS, AttackType, ATTACK_TYPES } from '@/types/combat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CombatHUDProps {
  combatState: CombatState;
  notifications: string[];
  currentAttackType: AttackType | null;
  onEquipWeapon: (weaponId: string) => void;
  onAttack: () => void;
  onPunch: () => void;
  onKick: () => void;
}

export function CombatHUD({ 
  combatState, 
  notifications, 
  currentAttackType,
  onEquipWeapon,
  onAttack,
  onPunch,
  onKick
}: CombatHUDProps) {
  const healthPercent = (combatState.health / combatState.maxHealth) * 100;
  const xpPercent = (combatState.xp / combatState.xpToNextLevel) * 100;
  
  const weapons = Object.values(WEAPONS);
  
  return (
    <>
      {/* Health and XP bars - bottom left */}
      <div className="absolute bottom-20 left-4 w-64 space-y-2 pointer-events-auto">
        {/* Health bar */}
        <div className="glass-panel rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-xs text-foreground font-semibold">
              {Math.ceil(combatState.health)} / {combatState.maxHealth}
            </span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: healthPercent > 30 
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)' 
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${healthPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        {/* XP bar */}
        <div className="glass-panel rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-foreground font-semibold">
                Level {combatState.level}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {combatState.xp} / {combatState.xpToNextLevel} XP
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
      {/* Weapon selector - bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="glass-panel rounded-xl p-2 flex items-center gap-2">
          {weapons.map((weapon, index) => (
            <Button
              key={weapon.id}
              variant="ghost"
              size="sm"
              onClick={() => onEquipWeapon(weapon.id)}
              className={cn(
                "relative w-12 h-12 p-1 rounded-lg transition-all",
                combatState.equippedWeapon.id === weapon.id 
                  ? "bg-primary/30 ring-2 ring-primary" 
                  : "hover:bg-muted/50"
              )}
              title={weapon.name}
            >
              {weapon.type === 'melee' ? (
                <Sword className="w-6 h-6" />
              ) : (
                <Target className="w-6 h-6" />
              )}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-muted rounded text-xs flex items-center justify-center">
                {index + 1}
              </span>
            </Button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-1">
          <span className="text-primary font-semibold">{combatState.equippedWeapon.name}</span>
          {' • '}
          <span className="text-red-400">{combatState.equippedWeapon.damage} DMG</span>
        </p>
      </div>
      
      {/* Attack button - bottom right (for mobile) */}
      <div className="absolute bottom-16 right-4 flex flex-col gap-2 pointer-events-auto">
        {/* Punch button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onPunch}
          className={cn(
            "w-14 h-14 rounded-xl glass-panel transition-all",
            currentAttackType === 'punch' && "ring-2 ring-orange-500 bg-orange-500/20"
          )}
          title="Punch (Q)"
        >
          <Hand className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded text-xs flex items-center justify-center text-white font-bold">Q</span>
        </Button>
        
        {/* Kick button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onKick}
          className={cn(
            "w-14 h-14 rounded-xl glass-panel transition-all",
            currentAttackType === 'kick' && "ring-2 ring-blue-500 bg-blue-500/20"
          )}
          title="Kick (E)"
        >
          <Footprints className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded text-xs flex items-center justify-center text-white font-bold">E</span>
        </Button>
        
        {/* Weapon attack button */}
        <Button
          variant="gaming"
          size="lg"
          onClick={onAttack}
          className={cn(
            "w-14 h-14 rounded-xl transition-all",
            currentAttackType === 'weapon' && "ring-2 ring-primary scale-95"
          )}
          title="Weapon Attack (Ctrl/LMB)"
        >
          {combatState.equippedWeapon.type === 'ranged' ? (
            <Target className="w-6 h-6" />
          ) : (
            <Sword className="w-6 h-6" />
          )}
        </Button>
      </div>
      
      {/* Crosshair - center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
      
      {/* Enemy counter */}
      <div className="absolute top-20 right-4 glass-panel rounded-xl p-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold text-foreground">
            Enemies: {combatState.enemies.filter(e => e.state !== 'dead').length}
          </span>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 space-y-2 pointer-events-none">
        {notifications.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/80 to-amber-500/80 text-black font-bold text-center"
          >
            {msg}
          </motion.div>
        ))}
      </div>
      
      {/* Controls hint */}
      <div className="absolute top-20 left-4 glass-panel rounded-xl p-3 pointer-events-auto text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Combat Controls:</p>
        <p><span className="text-orange-400 font-semibold">Q</span> Punch ({ATTACK_TYPES.punch.damage} DMG)</p>
        <p><span className="text-blue-400 font-semibold">E</span> Kick ({ATTACK_TYPES.kick.damage} DMG)</p>
        <p><span className="text-primary font-semibold">Ctrl / LMB</span> Weapon Attack</p>
        <p><span className="text-yellow-400 font-semibold">1-6</span> Switch Weapon</p>
      </div>
    </>
  );
}
