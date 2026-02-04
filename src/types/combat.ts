// Combat Types and Constants

export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged';
  damage: number;
  attackSpeed: number; // attacks per second
  range: number;
  projectileSpeed?: number;
  ammo?: number;
  maxAmmo?: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  position: { x: number; y: number; z: number };
  rotation: number;
  state: 'idle' | 'roaming' | 'chasing' | 'attacking' | 'dead';
  targetPlayerId?: string;
  xpReward: number;
  coinReward: number;
  lootTable: LootDrop[];
}

export type EnemyType = 'goblin' | 'skeleton' | 'orc' | 'demon' | 'boss';

export interface LootDrop {
  itemType: 'weapon' | 'armor' | 'consumable' | 'coins';
  itemName?: string;
  chance: number; // 0-1
  amount?: number;
}

export interface CombatState {
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  equippedWeapon: Weapon;
  isAttacking: boolean;
  attackCooldown: number;
  enemies: Enemy[];
}

export interface Projectile {
  id: string;
  position: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
  speed: number;
  damage: number;
  ownerId: string;
}

// Default weapons
export const WEAPONS: Record<string, Weapon> = {
  fists: {
    id: 'fists',
    name: 'Fists',
    type: 'melee',
    damage: 5,
    attackSpeed: 2,
    range: 1.5,
  },
  katana: {
    id: 'katana',
    name: 'Ninja Katana',
    type: 'melee',
    damage: 15,
    attackSpeed: 1.5,
    range: 2,
  },
  nunchucks: {
    id: 'nunchucks',
    name: 'Nunchucks',
    type: 'melee',
    damage: 12,
    attackSpeed: 2.5,
    range: 1.8,
  },
  shuriken: {
    id: 'shuriken',
    name: 'Shuriken',
    type: 'ranged',
    damage: 8,
    attackSpeed: 3,
    range: 15,
    projectileSpeed: 20,
    ammo: 20,
    maxAmmo: 20,
  },
  pistol: {
    id: 'pistol',
    name: 'Pistol',
    type: 'ranged',
    damage: 20,
    attackSpeed: 1.5,
    range: 25,
    projectileSpeed: 50,
    ammo: 12,
    maxAmmo: 12,
  },
  rifle: {
    id: 'rifle',
    name: 'Assault Rifle',
    type: 'ranged',
    damage: 15,
    attackSpeed: 5,
    range: 35,
    projectileSpeed: 60,
    ammo: 30,
    maxAmmo: 30,
  },
};

// Enemy definitions
export const ENEMY_TYPES: Record<EnemyType, Omit<Enemy, 'id' | 'position' | 'rotation' | 'state' | 'targetPlayerId'>> = {
  goblin: {
    type: 'goblin',
    health: 30,
    maxHealth: 30,
    damage: 5,
    speed: 3,
    xpReward: 10,
    coinReward: 5,
    lootTable: [
      { itemType: 'coins', amount: 5, chance: 1 },
      { itemType: 'consumable', itemName: 'health_potion', chance: 0.2 },
    ],
  },
  skeleton: {
    type: 'skeleton',
    health: 40,
    maxHealth: 40,
    damage: 8,
    speed: 2.5,
    xpReward: 15,
    coinReward: 10,
    lootTable: [
      { itemType: 'coins', amount: 10, chance: 1 },
      { itemType: 'weapon', itemName: 'shuriken', chance: 0.1 },
    ],
  },
  orc: {
    type: 'orc',
    health: 80,
    maxHealth: 80,
    damage: 15,
    speed: 2,
    xpReward: 30,
    coinReward: 25,
    lootTable: [
      { itemType: 'coins', amount: 25, chance: 1 },
      { itemType: 'weapon', itemName: 'katana', chance: 0.15 },
      { itemType: 'consumable', itemName: 'health_potion', chance: 0.3 },
    ],
  },
  demon: {
    type: 'demon',
    health: 120,
    maxHealth: 120,
    damage: 25,
    speed: 3.5,
    xpReward: 50,
    coinReward: 50,
    lootTable: [
      { itemType: 'coins', amount: 50, chance: 1 },
      { itemType: 'weapon', itemName: 'pistol', chance: 0.2 },
      { itemType: 'armor', itemName: 'demon_armor', chance: 0.1 },
    ],
  },
  boss: {
    type: 'boss',
    health: 500,
    maxHealth: 500,
    damage: 40,
    speed: 2,
    xpReward: 200,
    coinReward: 200,
    lootTable: [
      { itemType: 'coins', amount: 200, chance: 1 },
      { itemType: 'weapon', itemName: 'rifle', chance: 0.5 },
      { itemType: 'armor', itemName: 'legendary_armor', chance: 0.25 },
    ],
  },
};

// Level progression
export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function calculateMaxHealth(level: number): number {
  return 100 + (level - 1) * 10;
}
