import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CombatState, 
  Enemy, 
  Weapon, 
  Projectile,
  WEAPONS, 
  ENEMY_TYPES,
  EnemyType,
  calculateXpForLevel,
  calculateMaxHealth,
  LootDrop
} from '@/types/combat';
import { Player } from '@/types/game';

const ENEMY_SPAWN_INTERVAL = 5000; // 5 seconds
const MAX_ENEMIES = 8;
const SPAWN_RADIUS = 30;
const DETECTION_RADIUS = 15;
const ATTACK_RADIUS = 2;

interface UseCombatProps {
  currentPlayer: Player | null;
  profileId: string | null;
}

export function useCombat({ currentPlayer, profileId }: UseCombatProps) {
  const [combatState, setCombatState] = useState<CombatState>({
    health: 100,
    maxHealth: 100,
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    equippedWeapon: WEAPONS.fists,
    isAttacking: false,
    attackCooldown: 0,
    enemies: [],
  });
  
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [inventory, setInventory] = useState<Weapon[]>([WEAPONS.fists]);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const lastSpawnRef = useRef<number>(0);
  const lastAttackRef = useRef<number>(0);

  // Fetch player combat stats from DB
  useEffect(() => {
    if (!profileId) return;
    
    const fetchStats = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('xp, level, coins')
        .eq('id', profileId)
        .single();
      
      if (data) {
        const level = data.level || 1;
        setCombatState(prev => ({
          ...prev,
          xp: data.xp || 0,
          level,
          maxHealth: calculateMaxHealth(level),
          health: calculateMaxHealth(level),
          xpToNextLevel: calculateXpForLevel(level),
        }));
      }
    };
    
    fetchStats();
  }, [profileId]);

  // Spawn enemies periodically
  const spawnEnemy = useCallback(() => {
    if (!currentPlayer) return;
    
    const now = Date.now();
    if (now - lastSpawnRef.current < ENEMY_SPAWN_INTERVAL) return;
    
    setCombatState(prev => {
      if (prev.enemies.length >= MAX_ENEMIES) return prev;
      
      lastSpawnRef.current = now;
      
      // Determine enemy type based on player level
      const types: EnemyType[] = ['goblin', 'skeleton'];
      if (prev.level >= 3) types.push('orc');
      if (prev.level >= 5) types.push('demon');
      if (prev.level >= 10 && Math.random() < 0.1) types.push('boss');
      
      const enemyType = types[Math.floor(Math.random() * types.length)];
      const template = ENEMY_TYPES[enemyType];
      
      // Random position around player
      const angle = Math.random() * Math.PI * 2;
      const distance = SPAWN_RADIUS * (0.5 + Math.random() * 0.5);
      
      const newEnemy: Enemy = {
        ...template,
        id: `enemy-${Date.now()}-${Math.random()}`,
        position: {
          x: currentPlayer.position.x + Math.cos(angle) * distance,
          y: 0.5,
          z: currentPlayer.position.z + Math.sin(angle) * distance,
        },
        rotation: Math.random() * Math.PI * 2,
        state: 'roaming',
      };
      
      return {
        ...prev,
        enemies: [...prev.enemies, newEnemy],
      };
    });
  }, [currentPlayer]);

  // Update enemy AI
  const updateEnemies = useCallback((delta: number) => {
    if (!currentPlayer) return;
    
    setCombatState(prev => {
      const updatedEnemies = prev.enemies.map(enemy => {
        if (enemy.state === 'dead') return enemy;
        
        const dx = currentPlayer.position.x - enemy.position.x;
        const dz = currentPlayer.position.z - enemy.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Update state based on distance
        let newState = enemy.state;
        if (distance < ATTACK_RADIUS) {
          newState = 'attacking';
        } else if (distance < DETECTION_RADIUS) {
          newState = 'chasing';
        } else {
          newState = 'roaming';
        }
        
        // Move towards player if chasing
        let newPosition = { ...enemy.position };
        let newRotation = enemy.rotation;
        
        if (newState === 'chasing' || newState === 'attacking') {
          newRotation = Math.atan2(dx, dz);
          
          if (distance > ATTACK_RADIUS) {
            const moveSpeed = enemy.speed * delta;
            newPosition.x += (dx / distance) * moveSpeed;
            newPosition.z += (dz / distance) * moveSpeed;
          }
        } else if (newState === 'roaming') {
          // Random roaming
          newRotation += (Math.random() - 0.5) * 0.1;
          newPosition.x += Math.sin(newRotation) * enemy.speed * delta * 0.3;
          newPosition.z += Math.cos(newRotation) * enemy.speed * delta * 0.3;
        }
        
        return {
          ...enemy,
          position: newPosition,
          rotation: newRotation,
          state: newState,
        };
      });
      
      return { ...prev, enemies: updatedEnemies };
    });
  }, [currentPlayer]);

  // Handle enemy attacks on player
  const processEnemyAttacks = useCallback((delta: number) => {
    setCombatState(prev => {
      let damage = 0;
      
      prev.enemies.forEach(enemy => {
        if (enemy.state === 'attacking') {
          damage += enemy.damage * delta * 0.5; // Damage per second
        }
      });
      
      if (damage > 0) {
        const newHealth = Math.max(0, prev.health - damage);
        return { ...prev, health: newHealth };
      }
      
      return prev;
    });
  }, []);

  // Attack function
  const attack = useCallback(() => {
    const now = Date.now();
    const cooldown = 1000 / combatState.equippedWeapon.attackSpeed;
    
    if (now - lastAttackRef.current < cooldown) return;
    lastAttackRef.current = now;
    
    if (!currentPlayer) return;
    
    setCombatState(prev => ({ ...prev, isAttacking: true }));
    
    setTimeout(() => {
      setCombatState(prev => ({ ...prev, isAttacking: false }));
    }, 200);
    
    const weapon = combatState.equippedWeapon;
    
    if (weapon.type === 'ranged') {
      // Create projectile
      const projectile: Projectile = {
        id: `proj-${Date.now()}`,
        position: { ...currentPlayer.position },
        direction: {
          x: Math.sin(currentPlayer.rotation.y),
          y: 0,
          z: Math.cos(currentPlayer.rotation.y),
        },
        speed: weapon.projectileSpeed || 20,
        damage: weapon.damage,
        ownerId: currentPlayer.id,
      };
      
      setProjectiles(prev => [...prev, projectile]);
    } else {
      // Melee attack - check enemies in range
      setCombatState(prev => {
        const updatedEnemies = prev.enemies.map(enemy => {
          const dx = enemy.position.x - currentPlayer.position.x;
          const dz = enemy.position.z - currentPlayer.position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          // Check if enemy is in front of player and in range
          const angleToEnemy = Math.atan2(dx, dz);
          const playerAngle = currentPlayer.rotation.y;
          const angleDiff = Math.abs(angleToEnemy - playerAngle);
          
          if (distance <= weapon.range && angleDiff < Math.PI / 2) {
            const newHealth = enemy.health - weapon.damage;
            
            if (newHealth <= 0) {
              return { ...enemy, health: 0, state: 'dead' as const };
            }
            
            return { ...enemy, health: newHealth };
          }
          
          return enemy;
        });
        
        return { ...prev, enemies: updatedEnemies };
      });
    }
  }, [combatState.equippedWeapon, currentPlayer]);

  // Update projectiles
  const updateProjectiles = useCallback((delta: number) => {
    setProjectiles(prev => {
      const updated: Projectile[] = [];
      
      prev.forEach(proj => {
        // Move projectile
        const newPos = {
          x: proj.position.x + proj.direction.x * proj.speed * delta,
          y: proj.position.y + proj.direction.y * proj.speed * delta,
          z: proj.position.z + proj.direction.z * proj.speed * delta,
        };
        
        // Check distance traveled
        const totalDist = Math.sqrt(
          Math.pow(newPos.x - proj.position.x, 2) +
          Math.pow(newPos.z - proj.position.z, 2)
        );
        
        if (totalDist > 50) return; // Remove if too far
        
        // Check collision with enemies
        let hit = false;
        setCombatState(combatPrev => {
          const updatedEnemies = combatPrev.enemies.map(enemy => {
            if (enemy.state === 'dead') return enemy;
            
            const dx = enemy.position.x - newPos.x;
            const dz = enemy.position.z - newPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance < 1) {
              hit = true;
              const newHealth = enemy.health - proj.damage;
              
              if (newHealth <= 0) {
                return { ...enemy, health: 0, state: 'dead' as const };
              }
              
              return { ...enemy, health: newHealth };
            }
            
            return enemy;
          });
          
          return { ...combatPrev, enemies: updatedEnemies };
        });
        
        if (!hit) {
          updated.push({ ...proj, position: newPos });
        }
      });
      
      return updated;
    });
  }, []);

  // Process dead enemies and give rewards
  const processDeadEnemies = useCallback(async () => {
    if (!profileId) return;
    
    setCombatState(prev => {
      const deadEnemies = prev.enemies.filter(e => e.state === 'dead');
      const aliveEnemies = prev.enemies.filter(e => e.state !== 'dead');
      
      if (deadEnemies.length === 0) return prev;
      
      let totalXp = 0;
      let totalCoins = 0;
      const lootMessages: string[] = [];
      
      deadEnemies.forEach(enemy => {
        totalXp += enemy.xpReward;
        totalCoins += enemy.coinReward;
        
        // Process loot drops
        enemy.lootTable.forEach(loot => {
          if (Math.random() < loot.chance) {
            if (loot.itemType === 'coins') {
              totalCoins += loot.amount || 0;
            } else if (loot.itemName) {
              lootMessages.push(`Got ${loot.itemName}!`);
            }
          }
        });
      });
      
      // Add notifications
      if (lootMessages.length > 0) {
        setNotifications(n => [...n, ...lootMessages]);
        setTimeout(() => {
          setNotifications(n => n.slice(lootMessages.length));
        }, 3000);
      }
      
      // Calculate new level
      let newXp = prev.xp + totalXp;
      let newLevel = prev.level;
      let xpNeeded = prev.xpToNextLevel;
      
      while (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel++;
        xpNeeded = calculateXpForLevel(newLevel);
        setNotifications(n => [...n, `Level Up! Now level ${newLevel}`]);
      }
      
      // Update database
      supabase
        .from('profiles')
        .update({
          xp: newXp,
          level: newLevel,
          coins: prev.level, // This will be updated with actual coins
        })
        .eq('id', profileId)
        .then(() => {
          // Also add coins
          supabase
            .from('profiles')
            .select('coins')
            .eq('id', profileId)
            .single()
            .then(({ data }) => {
              if (data) {
                supabase
                  .from('profiles')
                  .update({ coins: data.coins + totalCoins })
                  .eq('id', profileId);
              }
            });
        });
      
      return {
        ...prev,
        enemies: aliveEnemies,
        xp: newXp,
        level: newLevel,
        maxHealth: calculateMaxHealth(newLevel),
        xpToNextLevel: xpNeeded,
      };
    });
  }, [profileId]);

  // Equip weapon
  const equipWeapon = useCallback((weaponId: string) => {
    const weapon = WEAPONS[weaponId];
    if (weapon) {
      setCombatState(prev => ({ ...prev, equippedWeapon: weapon }));
    }
  }, []);

  // Heal player
  const heal = useCallback((amount: number) => {
    setCombatState(prev => ({
      ...prev,
      health: Math.min(prev.maxHealth, prev.health + amount),
    }));
  }, []);

  // Respawn
  const respawn = useCallback(() => {
    setCombatState(prev => ({
      ...prev,
      health: prev.maxHealth,
    }));
  }, []);

  return {
    combatState,
    projectiles,
    inventory,
    notifications,
    spawnEnemy,
    updateEnemies,
    processEnemyAttacks,
    attack,
    updateProjectiles,
    processDeadEnemies,
    equipWeapon,
    heal,
    respawn,
  };
}
