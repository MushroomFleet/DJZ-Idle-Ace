// ============================================
// BATTLE STATE
// ============================================

export interface BattleState {
  status: 'preparing' | 'active' | 'victory' | 'defeat';
  startTime: number;
  endTime: number | null;

  // Combatants
  alliedJets: BattleEntity[];
  enemyJets: BattleEntity[];

  // Tactical Settings
  playerTactic: 'aggressive' | 'defensive';

  // Pre-determined Outcomes
  scheduledEvents: BattleEvent[];
  executedEvents: BattleEvent[];

  // Visual Effects
  projectiles: Projectile[];

  // Results
  results: BattleResults | null;
}

// ============================================
// BATTLE ENTITIES
// ============================================

export interface BattleEntity {
  id: string;
  originalJetId: string;      // Links back to FighterJet
  team: 'allied' | 'enemy';

  // Current State
  health: number;
  maxHealth: number;
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number];

  // Target
  targetId: string | null;

  // Stats (from FighterJet + Pilot)
  weaponStrength: number;
  speed: number;
  agility: number;
  intelligence: number;
  endurance: number;

  // Combat Status
  isDestroyed: boolean;
  isEscaping: boolean;
  killCount: number;

  // Behavior State
  behaviorState: 'idle' | 'pursuing' | 'attacking' | 'evading' | 'regrouping' | 'escaping';
  behaviorTimer: number;
}

// ============================================
// BATTLE EVENTS
// ============================================

export interface BattleEvent {
  timestamp: number;            // ms since battle start
  type: 'hit' | 'miss' | 'destroy' | 'escape';
  attackerId: string;
  targetId: string;
  damage?: number;
  resultingHealth?: number;
}

// ============================================
// PROJECTILES (VISUAL ONLY)
// ============================================

export interface Projectile {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  color: number;          // 0x00B4D8 (blue)
  lifespan: number;       // ms remaining
  createdAt: number;
}

// ============================================
// BATTLE RESULTS
// ============================================

export interface BattleResults {
  victory: boolean;
  survivingAllied: number;
  destroyedAllied: number;
  survivingEnemy: number;
  destroyedEnemy: number;
  enemiesEscaped: number;
  duration: number;
  rewards: {
    credits: number;
    researchPoints: number;
    highScoreBonus: number;
  };
  pilotStats: {
    pilotId: string;
    kills: number;
    damage: number;
    survival: boolean;
  }[];
}

// ============================================
// TACTICAL BEHAVIORS
// ============================================

export interface TacticalBehavior {
  formation: 'spread' | 'tight' | 'flanking';
  engagement: 'aggressive' | 'defensive';
  targetSelection: 'nearest' | 'weakest' | 'strongest';
}

// ============================================
// HUD / IFF SYSTEMS
// ============================================

export interface TargetLock {
  targetId: string;
  lockStrength: number;      // 0-100%
  timeToIntercept: number;   // seconds
  closureRate: number;       // m/s (positive = closing)
  iffStatus: 'friend' | 'foe' | 'unknown';
}

export interface HUDState {
  primaryTarget: TargetLock | null;
  secondaryTargets: TargetLock[];
  radarMode: 'search' | 'track' | 'boresight';
}
