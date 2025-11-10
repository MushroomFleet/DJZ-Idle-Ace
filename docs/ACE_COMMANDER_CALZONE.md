# IDLE ACE COMMANDER - CALZONE SPEC
<!-- CALZONE v1.0 | TINS-Compatible Reproduction Documentation -->
<!-- Excludes: docs/, node_modules/, ref/ -->

---

## §1 PROJECT_META

```
name: idle-ace-commander
type: react-typescript-vite-game
stack: React18 + TS5 + Vite5 + Three.js + Tailwind
paradigm: idle/incremental + 3D_combat_sim
```

### §1.1 PACKAGE_DEPS

```
●CORE_RUNTIME
  react: 18.3.1
  react-dom: 18.3.1
  typescript: 5.8.3

●3D_GRAPHICS
  three: 0.164.1
  @react-three/fiber: 8.18.0
  @react-three/drei: 9.122.0

●UI_FRAMEWORK
  @radix-ui/*: [40+ components]
    ├accordion, alert-dialog, aspect-ratio, avatar
    ├checkbox, collapsible, context-menu, dialog
    ├dropdown-menu, hover-card, label, menubar
    ├navigation-menu, popover, progress, radio-group
    ├scroll-area, select, separator, slider
    ├slot, switch, tabs, toast, toggle, tooltip
    └[complete radix-ui primitive set]
  
●STYLING
  tailwindcss: 3.4.17
  tailwindcss-animate: 1.0.7
  @tailwindcss/typography: 0.5.16
  autoprefixer: 10.4.21
  postcss: 8.5.6
  class-variance-authority: 0.7.1
  tailwind-merge: 2.6.0
  clsx: 2.1.1

●FORMS_VALIDATION
  react-hook-form: 7.61.1
  @hookform/resolvers: 3.10.0
  zod: 3.25.76

●ROUTING_QUERY
  react-router-dom: 6.30.1
  @tanstack/react-query: 5.83.0

●UTILS_UI
  lucide-react: 0.462.0
  next-themes: 0.3.0
  sonner: 1.7.4
  cmdk: 1.1.1
  vaul: 0.9.9
  date-fns: 3.6.0
  react-day-picker: 8.10.1
  embla-carousel-react: 8.6.0
  input-otp: 1.4.2
  react-resizable-panels: 2.1.9
  recharts: 2.15.4

●BUILD_TOOLS
  vite: 5.4.19
  @vitejs/plugin-react-swc: 3.11.0
  
●LINTING
  eslint: 9.32.0
  @eslint/js: 9.32.0
  eslint-plugin-react-hooks: 5.2.0
  eslint-plugin-react-refresh: 0.4.20
  typescript-eslint: 8.38.0
  globals: 15.15.0

●DEV_TYPES
  @types/node: 22.16.5
  @types/react: 18.3.23
  @types/react-dom: 18.3.7

●OPTIONAL [Windows-specific]
  @rollup/rollup-win32-x64-msvc: 4.53.1
  
packageManager: pnpm@10.19.0
```

### §1.2 BUILD_CONFIG

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  server: { host: '::', port: 8080 },
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
```

**tsconfig.json**
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**tsconfig.app.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

**tailwind.config.ts**
```typescript
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        },
        "military-green": "#4A5C3A"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
} satisfies Config
```

**postcss.config.js**
```javascript
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

---

## §2 TYPE_SYSTEM

### §2.1 GAME_TYPES

```typescript
// src/types/game.types.ts

export interface GameState {
  highScore: number
  gameStartTime: number
  lastSaveTime: number
  currentView: 'idle' | 'combat' | 'general-briefing' | 'general-results'
  currentMission: Mission | null
  
  resources: {
    credits: number
    researchPoints: number
  }
  
  squadron: FighterJet[]
  pilots: Pilot[]
  research: ResearchState
  missions: MissionState
  settings: Settings
}

export interface FighterJet {
  id: string
  name: string
  level: number
  
  baseWeaponStrength: number
  baseSpeed: number
  baseAgility: number
  
  upgrades: {
    weapons: number      // 0-10
    engines: number      // 0-10
    avionics: number     // 0-10
  }
  
  computedStats: {
    weaponStrength: number
    speed: number
    agility: number
  }
  
  assignedPilotId: string | null
  color: 'green' | 'red'
}

export interface Pilot {
  id: string
  callsign: string
  rank: string
  level: number
  
  intelligence: number   // 1-100, affects accuracy
  endurance: number      // 1-100, affects sustained combat
  
  trainingProgress: {
    intelligence: number // 0-100 progress to next level
    endurance: number    // 0-100 progress to next level
  }
  
  assignedJetId: string | null
  missionsFlown: number
  kills: number
}

export interface Mission {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  
  enemyCount: number
  enemyStats: {
    weaponStrength: number
    speed: number
    agility: number
    intelligence: number
    endurance: number
  }
  
  rewards: {
    credits: number
    researchPoints: number
    highScoreBonus: number
  }
  
  availableAt: number
  cooldown: number       // ms until next mission available
}

export interface MissionState {
  available: Mission[]
  completed: Mission[]
  lastCompletedTime: number
  nextMissionTime: number
}

export interface TechNode {
  id: string
  name: string
  description: string
  category: 'weapons' | 'engines' | 'avionics' | 'pilot'
  
  researchTime: number         // ms to complete research
  researchPointCost: number
  prerequisites: string[]      // IDs of required tech
  
  unlocks: {
    upgradeType: 'weapons' | 'engines' | 'avionics' | 'intelligence' | 'endurance'
    levelUnlocked: number
    statBonus: number
  }
  
  status: 'locked' | 'available' | 'researching' | 'completed'
  researchStartTime: number | null
}

export interface ResearchState {
  completed: TechNode[]
  inProgress: TechNode | null
  available: TechNode[]
  tree: TechNode[]
}

export interface Settings {
  apiKey: string
  selectedModel: string
  volume: number
  showTutorial: boolean
  tts: {
    enabled: boolean
    voice: string
    rate: number
    pitch: number
    volume: number
  }
}
```

### §2.2 COMBAT_TYPES

```typescript
// src/types/combat.types.ts

export interface BattleEntity {
  id: string
  type: 'allied' | 'enemy'
  position: [number, number, number]
  velocity: [number, number, number]
  rotation: [number, number, number]
  health: number
  maxHealth: number
  
  stats: {
    weaponStrength: number
    speed: number
    agility: number
    intelligence: number
    endurance: number
  }
  
  ammo: number
  maxAmmo: number
  
  pilotId?: string
  jetId?: string
  
  destroyed: boolean
  escaped: boolean
}

export interface BattleEvent {
  timestamp: number
  type: 'hit' | 'destroy' | 'escape' | 'miss'
  attackerId: string
  targetId: string
  damage?: number
}

export interface BattleResults {
  victory: boolean
  survivingAllied: number
  destroyedAllied: number
  survivingEnemy: number
  destroyedEnemy: number
  enemiesEscaped: number
  duration: number
  
  rewards: {
    credits: number
    researchPoints: number
    highScoreBonus: number
  }
  
  pilotStats: Array<{
    pilotId: string
    kills: number
    damage: number
    survival: boolean
  }>
}
```

### §2.3 NARRATIVE_TYPES

```typescript
// src/types/narrative.types.ts

export interface DialogueEntry {
  id: string
  type: 'mission-brief' | 'mission-result' | 'general-comment'
  speaker: 'general-martin' | 'pilot' | 'system'
  text: string
  timestamp: number
  dismissed: boolean
  metadata?: {
    victory?: boolean
    casualtyCount?: number
    [key: string]: any
  }
}

export interface NarrativeState {
  warProgress: {
    missionsCompleted: number
    totalKills: number
    pilotsLost: number
    victoriesStreak: number
  }
  dialogueHistory: DialogueEntry[]
  currentDialogue: DialogueEntry | null
}
```

---

## §3 STATE_MANAGEMENT

### §3.1 GAME_STATE_CONTEXT

```typescript
// src/contexts/GameStateContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameState, FighterJet, Pilot, Mission, TechNode } from '@/types/game.types'

interface GameStateContextType {
  gameState: GameState
  updateResources: (credits: number, researchPoints: number) => void
  updateHighScore: (points: number) => void
  setCurrentView: (view: GameState['currentView']) => void
  setCurrentMission: (mission: Mission | null) => void
  updateSquadron: (squadron: FighterJet[]) => void
  updatePilots: (pilots: Pilot[]) => void
  startResearch: (tech: TechNode) => void
  completeResearch: () => void
  addCompletedMission: (mission: Mission) => void
  upgradeJet: (jetId: string, upgradeType: 'weapons' | 'engines' | 'avionics') => void
  trainPilot: (pilotId: string, stat: 'intelligence' | 'endurance', amount: number) => void
  updateTTSSettings: (settings: Partial<GameState['settings']['tts']>) => void
  saveGame: () => void
  resetGame: () => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

const createInitialState = (): GameState => ({
  highScore: 0,
  gameStartTime: Date.now(),
  lastSaveTime: Date.now(),
  currentView: 'idle',
  currentMission: null,
  
  resources: { credits: 1000, researchPoints: 0 },
  
  squadron: [
    {
      id: 'jet-1', name: 'Falcon One', level: 1,
      baseWeaponStrength: 10, baseSpeed: 5, baseAgility: 5,
      upgrades: { weapons: 0, engines: 0, avionics: 0 },
      computedStats: { weaponStrength: 10, speed: 5, agility: 5 },
      assignedPilotId: 'pilot-1', color: 'green'
    },
    {
      id: 'jet-2', name: 'Falcon Two', level: 1,
      baseWeaponStrength: 10, baseSpeed: 5, baseAgility: 5,
      upgrades: { weapons: 0, engines: 0, avionics: 0 },
      computedStats: { weaponStrength: 10, speed: 5, agility: 5 },
      assignedPilotId: 'pilot-2', color: 'green'
    }
  ],
  
  pilots: [
    {
      id: 'pilot-1', callsign: 'Maverick', rank: 'Lieutenant', level: 1,
      intelligence: 50, endurance: 50,
      trainingProgress: { intelligence: 0, endurance: 0 },
      assignedJetId: 'jet-1', missionsFlown: 0, kills: 0
    },
    {
      id: 'pilot-2', callsign: 'Viper', rank: 'Lieutenant', level: 1,
      intelligence: 50, endurance: 50,
      trainingProgress: { intelligence: 0, endurance: 0 },
      assignedJetId: 'jet-2', missionsFlown: 0, kills: 0
    }
  ],
  
  research: { completed: [], inProgress: null, available: [], tree: [] },
  missions: { available: [], completed: [], lastCompletedTime: 0, nextMissionTime: Date.now() + 60000 },
  
  settings: {
    apiKey: '', selectedModel: 'x-ai/grok-4-fast', volume: 50, showTutorial: true,
    tts: { enabled: false, voice: '', rate: 1.0, pitch: 1.0, volume: 1.0 }
  }
})

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('idle-ace-commander-save')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const initial = createInitialState()
        return {
          ...initial, ...parsed,
          settings: {
            ...initial.settings, ...parsed.settings,
            tts: { ...initial.settings.tts, ...(parsed.settings?.tts || {}) }
          }
        }
      } catch (error) {
        console.error('Failed to parse save data:', error)
        return createInitialState()
      }
    }
    return createInitialState()
  })

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => saveGame(), 30000)
    return () => clearInterval(interval)
  }, [gameState])

  const saveGame = () => {
    const saveData = { ...gameState, lastSaveTime: Date.now() }
    localStorage.setItem('idle-ace-commander-save', JSON.stringify(saveData))
    console.log('Game saved')
  }

  const updateResources = (credits: number, researchPoints: number) => {
    setGameState(prev => ({
      ...prev,
      resources: {
        credits: Math.max(0, prev.resources.credits + credits),
        researchPoints: Math.max(0, prev.resources.researchPoints + researchPoints)
      }
    }))
  }

  const updateHighScore = (points: number) => {
    setGameState(prev => ({ ...prev, highScore: prev.highScore + points }))
  }

  const setCurrentView = (view: GameState['currentView']) => {
    setGameState(prev => ({ ...prev, currentView: view }))
  }

  const setCurrentMission = (mission: Mission | null) => {
    setGameState(prev => ({ ...prev, currentMission: mission }))
  }

  const updateSquadron = (squadron: FighterJet[]) => {
    setGameState(prev => ({ ...prev, squadron }))
  }

  const updatePilots = (pilots: Pilot[]) => {
    setGameState(prev => ({ ...prev, pilots }))
  }

  const startResearch = (tech: TechNode) => {
    setGameState(prev => ({
      ...prev,
      research: {
        ...prev.research,
        inProgress: { ...tech, status: 'researching', researchStartTime: Date.now() }
      }
    }))
  }

  const completeResearch = () => {
    setGameState(prev => {
      if (!prev.research.inProgress) return prev
      return {
        ...prev,
        research: {
          ...prev.research,
          completed: [...prev.research.completed, { ...prev.research.inProgress, status: 'completed' }],
          inProgress: null
        }
      }
    })
  }

  const addCompletedMission = (mission: Mission) => {
    setGameState(prev => ({
      ...prev,
      missions: {
        ...prev.missions,
        completed: [...prev.missions.completed, mission],
        lastCompletedTime: Date.now(),
        nextMissionTime: Date.now() + 60000
      }
    }))
  }

  const upgradeJet = (jetId: string, upgradeType: 'weapons' | 'engines' | 'avionics') => {
    setGameState(prev => ({
      ...prev,
      squadron: prev.squadron.map(jet => {
        if (jet.id === jetId) {
          const newUpgrades = {
            ...jet.upgrades,
            [upgradeType]: Math.min(10, jet.upgrades[upgradeType] + 1)
          }
          const computedStats = {
            weaponStrength: jet.baseWeaponStrength + (newUpgrades.weapons * 2),
            speed: jet.baseSpeed + (newUpgrades.engines * 1),
            agility: jet.baseAgility + (newUpgrades.avionics * 1)
          }
          return { ...jet, upgrades: newUpgrades, computedStats }
        }
        return jet
      })
    }))
  }

  const trainPilot = (pilotId: string, stat: 'intelligence' | 'endurance', amount: number) => {
    setGameState(prev => ({
      ...prev,
      pilots: prev.pilots.map(pilot => {
        if (pilot.id === pilotId) {
          const newProgress = pilot.trainingProgress[stat] + amount
          if (newProgress >= 100) {
            return {
              ...pilot,
              [stat]: Math.min(100, pilot[stat] + 10),
              level: pilot.level + 1,
              trainingProgress: { ...pilot.trainingProgress, [stat]: newProgress - 100 }
            }
          } else {
            return {
              ...pilot,
              trainingProgress: { ...pilot.trainingProgress, [stat]: newProgress }
            }
          }
        }
        return pilot
      })
    }))
  }

  const updateTTSSettings = (ttsSettings: Partial<GameState['settings']['tts']>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, tts: { ...prev.settings.tts, ...ttsSettings } }
    }))
  }

  const resetGame = () => {
    localStorage.removeItem('idle-ace-commander-save')
    setGameState(createInitialState())
  }

  const value: GameStateContextType = {
    gameState, updateResources, updateHighScore, setCurrentView, setCurrentMission,
    updateSquadron, updatePilots, startResearch, completeResearch, addCompletedMission,
    upgradeJet, trainPilot, updateTTSSettings, saveGame, resetGame
  }

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
}

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext)
  if (!context) throw new Error('useGameState must be used within GameStateProvider')
  return context
}
```

### §3.2 NARRATIVE_CONTEXT

```typescript
// src/contexts/NarrativeContext.tsx

const createInitialNarrativeState = (): NarrativeState => ({
  warProgress: { missionsCompleted: 0, totalKills: 0, pilotsLost: 0, victoriesStreak: 0 },
  dialogueHistory: [],
  currentDialogue: null
})

interface NarrativeContextType {
  narrativeState: NarrativeState
  addDialogue: (dialogue: DialogueEntry) => void
  dismissDialogue: (id: string) => void
  updateWarProgress: (updates: Partial<NarrativeState['warProgress']>) => void
}

export const NarrativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [narrativeState, setNarrativeState] = useState<NarrativeState>(createInitialNarrativeState)

  const addDialogue = (dialogue: DialogueEntry) => {
    setNarrativeState(prev => ({
      ...prev,
      dialogueHistory: [...prev.dialogueHistory, dialogue],
      currentDialogue: dialogue
    }))
  }

  const dismissDialogue = (id: string) => {
    setNarrativeState(prev => ({
      ...prev,
      dialogueHistory: prev.dialogueHistory.map(d => d.id === id ? { ...d, dismissed: true } : d),
      currentDialogue: prev.currentDialogue?.id === id ? null : prev.currentDialogue
    }))
  }

  const updateWarProgress = (updates: Partial<NarrativeState['warProgress']>) => {
    setNarrativeState(prev => ({
      ...prev,
      warProgress: { ...prev.warProgress, ...updates }
    }))
  }

  return (
    <NarrativeContext.Provider value={{ narrativeState, addDialogue, dismissDialogue, updateWarProgress }}>
      {children}
    </NarrativeContext.Provider>
  )
}

export const useNarrative = (): NarrativeContextType => {
  const context = useContext(NarrativeContext)
  if (!context) throw new Error('useNarrative must be used within NarrativeProvider')
  return context
}
```

---

## §4 GAME_LOGIC

### §4.1 TECH_TREE

```typescript
// src/utils/techTree.ts

export const TECH_TREE: TechNode[] = [
  // Tier 1
  { id: 'weapons-1', name: 'Advanced Missiles', description: 'Unlocks Weapon Upgrade Level 3',
    category: 'weapons', researchTime: 30000, researchPointCost: 20, prerequisites: [],
    unlocks: { upgradeType: 'weapons', levelUnlocked: 3, statBonus: 2 },
    status: 'available', researchStartTime: null },
  { id: 'engines-1', name: 'Afterburner Technology', description: 'Unlocks Engine Upgrade Level 3',
    category: 'engines', researchTime: 30000, researchPointCost: 20, prerequisites: [],
    unlocks: { upgradeType: 'engines', levelUnlocked: 3, statBonus: 1 },
    status: 'available', researchStartTime: null },
  { id: 'avionics-1', name: 'Fly-by-Wire Systems', description: 'Unlocks Avionics Upgrade Level 3',
    category: 'avionics', researchTime: 30000, researchPointCost: 20, prerequisites: [],
    unlocks: { upgradeType: 'avionics', levelUnlocked: 3, statBonus: 1 },
    status: 'available', researchStartTime: null },
  
  // Tier 2
  { id: 'weapons-2', name: 'Plasma Cannons', description: 'Unlocks Weapon Upgrade Level 6',
    category: 'weapons', researchTime: 60000, researchPointCost: 50, prerequisites: ['weapons-1'],
    unlocks: { upgradeType: 'weapons', levelUnlocked: 6, statBonus: 3 },
    status: 'locked', researchStartTime: null },
  { id: 'engines-2', name: 'Ion Propulsion', description: 'Unlocks Engine Upgrade Level 6',
    category: 'engines', researchTime: 60000, researchPointCost: 50, prerequisites: ['engines-1'],
    unlocks: { upgradeType: 'engines', levelUnlocked: 6, statBonus: 2 },
    status: 'locked', researchStartTime: null },
  { id: 'avionics-2', name: 'Neural Interface', description: 'Unlocks Avionics Upgrade Level 6',
    category: 'avionics', researchTime: 60000, researchPointCost: 50, prerequisites: ['avionics-1'],
    unlocks: { upgradeType: 'avionics', levelUnlocked: 6, statBonus: 2 },
    status: 'locked', researchStartTime: null },
  
  // Tier 3
  { id: 'weapons-3', name: 'Antimatter Warheads', description: 'Unlocks Weapon Upgrade Level 10',
    category: 'weapons', researchTime: 120000, researchPointCost: 100, prerequisites: ['weapons-2'],
    unlocks: { upgradeType: 'weapons', levelUnlocked: 10, statBonus: 5 },
    status: 'locked', researchStartTime: null },
  { id: 'engines-3', name: 'Quantum Drive', description: 'Unlocks Engine Upgrade Level 10',
    category: 'engines', researchTime: 120000, researchPointCost: 100, prerequisites: ['engines-2'],
    unlocks: { upgradeType: 'engines', levelUnlocked: 10, statBonus: 3 },
    status: 'locked', researchStartTime: null },
  { id: 'avionics-3', name: 'AI Autopilot', description: 'Unlocks Avionics Upgrade Level 10',
    category: 'avionics', researchTime: 120000, researchPointCost: 100, prerequisites: ['avionics-2'],
    unlocks: { upgradeType: 'avionics', levelUnlocked: 10, statBonus: 3 },
    status: 'locked', researchStartTime: null }
]
```

### §4.2 COMBAT_CALC

```typescript
// src/utils/combatCalculations.ts

export const calculateBattleOutcome = (
  squadron: FighterJet[], pilots: Pilot[], mission: Mission,
  tactic: 'aggressive' | 'defensive'
): { events: BattleEvent[]; results: BattleResults } => {
  
  const alliedPower = calculateSquadronPower(squadron, pilots)
  const enemyPower = calculateEnemyPower(mission)
  const tacticModifier = tactic === 'aggressive' ? 1.2 : 1.0
  const adjustedAlliedPower = alliedPower * tacticModifier
  const alliedWins = adjustedAlliedPower > enemyPower
  
  const events = generateBattleEvents(squadron, mission, alliedWins)
  const results = calculateResults(squadron, mission, events, alliedWins)
  
  return { events, results }
}

const calculateSquadronPower = (squadron: FighterJet[], pilots: Pilot[]): number => {
  return squadron.reduce((total, jet) => {
    const pilot = pilots.find(p => p.id === jet.assignedPilotId)
    if (!pilot) return total
    
    const jetPower = jet.computedStats.weaponStrength + jet.computedStats.speed + jet.computedStats.agility
    const pilotPower = pilot.intelligence + pilot.endurance
    
    return total + jetPower + pilotPower
  }, 0)
}

const calculateEnemyPower = (mission: Mission): number => {
  const stats = mission.enemyStats
  const singleEnemyPower = stats.weaponStrength + stats.speed + stats.agility + 
                           stats.intelligence + stats.endurance
  return singleEnemyPower * mission.enemyCount
}

const generateBattleEvents = (
  squadron: FighterJet[], mission: Mission, alliedWins: boolean
): BattleEvent[] => {
  const events: BattleEvent[] = []
  const battleDuration = 30000
  const eventCount = Math.floor(Math.random() * 10) + 15
  
  let alliedJetsAlive = squadron.length
  let enemyJetsAlive = mission.enemyCount
  
  for (let i = 0; i < eventCount; i++) {
    const timestamp = (i / eventCount) * battleDuration
    const isHit = Math.random() > 0.3
    
    if (isHit) {
      const alliedScores = alliedWins ? Math.random() > 0.4 : Math.random() > 0.6
      
      if (alliedScores && enemyJetsAlive > 0) {
        const attackerId = `allied-${Math.floor(Math.random() * squadron.length)}`
        const targetId = `enemy-${Math.floor(Math.random() * enemyJetsAlive)}`
        const isKill = Math.random() > 0.7
        
        if (isKill && i > eventCount / 2) {
          events.push({ timestamp, type: 'destroy', attackerId, targetId, damage: 100 })
          enemyJetsAlive--
        } else {
          events.push({ timestamp, type: 'hit', attackerId, targetId, damage: 20 })
        }
      } else if (!alliedScores && alliedJetsAlive > 0) {
        const attackerId = `enemy-${Math.floor(Math.random() * mission.enemyCount)}`
        const targetId = `allied-${Math.floor(Math.random() * alliedJetsAlive)}`
        const isKill = Math.random() > 0.7
        
        if (isKill && i > eventCount / 2 && !alliedWins) {
          events.push({ timestamp, type: 'destroy', attackerId, targetId, damage: 100 })
          alliedJetsAlive--
        } else {
          events.push({ timestamp, type: 'hit', attackerId, targetId, damage: 20 })
        }
      }
    }
  }
  
  if (!alliedWins && Math.random() > 0.5) {
    const fleeTime = battleDuration * 0.8
    for (let i = 0; i < enemyJetsAlive; i++) {
      events.push({ timestamp: fleeTime + i * 1000, type: 'escape', attackerId: `enemy-${i}`, targetId: '' })
    }
  }
  
  return events.sort((a, b) => a.timestamp - b.timestamp)
}

const calculateResults = (
  squadron: FighterJet[], mission: Mission, events: BattleEvent[], alliedWins: boolean
): BattleResults => {
  const destroyedAllied = events.filter(e => e.type === 'destroy' && e.targetId.startsWith('allied-')).length
  const destroyedEnemy = events.filter(e => e.type === 'destroy' && e.targetId.startsWith('enemy-')).length
  const enemiesEscaped = events.filter(e => e.type === 'escape').length
  const rewardMultiplier = alliedWins ? 1.0 : 0.3
  
  return {
    victory: alliedWins,
    survivingAllied: squadron.length - destroyedAllied,
    destroyedAllied,
    survivingEnemy: mission.enemyCount - destroyedEnemy - enemiesEscaped,
    destroyedEnemy,
    enemiesEscaped,
    duration: 30000,
    rewards: {
      credits: Math.floor(mission.rewards.credits * rewardMultiplier),
      researchPoints: Math.floor(mission.rewards.researchPoints * rewardMultiplier),
      highScoreBonus: Math.floor(mission.rewards.highScoreBonus * rewardMultiplier)
    },
    pilotStats: squadron.map((jet, i) => ({
      pilotId: jet.assignedPilotId || '',
      kills: destroyedEnemy > i ? 1 : 0,
      damage: Math.floor(Math.random() * 100),
      survival: i >= destroyedAllied
    }))
  }
}
```

### §4.3 MISSION_GEN

```typescript
// src/utils/missionGenerator.ts

export const generateMission = (difficulty: Mission['difficulty'], completedCount: number): Mission => {
  const difficultyMap = {
    easy: { enemyCount: 2, statMultiplier: 1.0, credits: 200, rp: 10, score: 100 },
    medium: { enemyCount: 3, statMultiplier: 1.5, credits: 400, rp: 20, score: 250 },
    hard: { enemyCount: 4, statMultiplier: 2.0, credits: 800, rp: 40, score: 500 },
    extreme: { enemyCount: 5, statMultiplier: 3.0, credits: 1500, rp: 80, score: 1000 }
  }
  
  const config = difficultyMap[difficulty]
  const missionNames = [
    'Operation Steel Eagle', 'Mission Thunder Hawk', 'Strike Force Alpha',
    'Defense Protocol Omega', 'Intercept Mission Bravo', 'Airspace Denial'
  ]
  
  return {
    id: `mission-${Date.now()}-${Math.random()}`,
    name: missionNames[Math.floor(Math.random() * missionNames.length)],
    description: `Engage and neutralize ${config.enemyCount} enemy fighters`,
    difficulty,
    enemyCount: config.enemyCount,
    enemyStats: {
      weaponStrength: Math.floor(10 * config.statMultiplier),
      speed: Math.floor(5 * config.statMultiplier),
      agility: Math.floor(5 * config.statMultiplier),
      intelligence: Math.floor(50 * config.statMultiplier),
      endurance: Math.floor(50 * config.statMultiplier)
    },
    rewards: {
      credits: config.credits,
      researchPoints: config.rp,
      highScoreBonus: config.score
    },
    availableAt: Date.now(),
    cooldown: 60000
  }
}
```

### §4.4 DIALOGUE_GEN

```typescript
// src/utils/dialogueGenerator.ts

export const FALLBACK_BRIEFING = "Pilots, we've detected enemy fighters in the sector. Your mission is to engage and eliminate all hostiles. Good hunting."

export const FALLBACK_VICTORY = "Excellent work out there! Mission accomplished. Return to base for debriefing."

export const FALLBACK_DEFEAT = "We took heavy losses on that one. Regroup and prepare for the next mission."

export const generateMissionBriefingPrompt = (
  mission: Mission, warProgress: NarrativeState['warProgress']
): Array<{ role: string; content: string }> => {
  return [
    {
      role: 'system',
      content: `You are General Martin, a gruff but caring military commander briefing pilots before a combat mission. Keep responses under 150 words. Be direct and military-focused.`
    },
    {
      role: 'user',
      content: `Brief the squadron on ${mission.name}. Difficulty: ${mission.difficulty}. Enemy count: ${mission.enemyCount}. War status: ${warProgress.missionsCompleted} missions completed, ${warProgress.totalKills} enemy kills, current streak: ${warProgress.victoriesStreak}.`
    }
  ]
}

export const generateMissionResultsPrompt = (
  mission: Mission, results: BattleResults, warProgress: NarrativeState['warProgress']
): Array<{ role: string; content: string }> => {
  return [
    {
      role: 'system',
      content: `You are General Martin debriefing pilots after combat. ${results.victory ? 'Commend their success' : 'Acknowledge losses but encourage improvement'}. Under 150 words, military tone.`
    },
    {
      role: 'user',
      content: `Debrief: ${results.victory ? 'VICTORY' : 'DEFEAT'}. Destroyed ${results.destroyedEnemy} enemies, lost ${results.destroyedAllied} allied. Duration: ${results.duration / 1000}s. War stats: ${warProgress.missionsCompleted} completed, ${warProgress.totalKills} total kills.`
    }
  ]
}
```

### §4.5 SCORE_CALC

```typescript
// src/utils/scoreCalculations.ts

export const calculateCost = (
  itemType: 'jet-upgrade' | 'pilot-training' | 'research',
  currentLevel: number
): number => {
  const costMaps = {
    'jet-upgrade': (level: number) => 100 * Math.pow(1.5, level),
    'pilot-training': (level: number) => 50 * Math.pow(1.3, level),
    'research': (level: number) => 0
  }
  return Math.floor(costMaps[itemType](currentLevel))
}

export const calculateMissionScore = (results: BattleResults): number => {
  let score = 0
  score += results.destroyedEnemy * 100
  score += results.survivingAllied * 50
  score -= results.destroyedAllied * 200
  if (results.victory) score += 500
  return Math.max(0, score)
}
```

---

## §5 COMPONENT_ARCHITECTURE

### §5.1 APP_ROOT

```typescript
// src/App.tsx

import React, { useEffect, useState } from 'react'
import { useGameState } from '@/contexts/GameStateContext'
import { useNarrative } from '@/contexts/NarrativeContext'
import { useOpenRouter } from '@/hooks/useOpenRouter'
import Header from '@/components/Header'
import IdleClickerView from '@/components/IdleClickerView'
import CombatSimulator from '@/components/CombatSimulator'
import GeneralMartinModal from '@/components/GeneralMartinModal'
import TutorialModal from '@/components/TutorialModal'
import { generateMissionBriefingPrompt, generateMissionResultsPrompt,
         FALLBACK_BRIEFING, FALLBACK_VICTORY, FALLBACK_DEFEAT } from '@/utils/dialogueGenerator'

const App: React.FC = () => {
  const { gameState, setCurrentView } = useGameState()
  const { narrativeState, addDialogue, dismissDialogue } = useNarrative()
  const { sendChatCompletion, loading } = useOpenRouter()
  const [transitioning, setTransitioning] = useState(false)
  const [previousView, setPreviousView] = useState(gameState.currentView)
  const [showTutorial, setShowTutorial] = useState(false)
  const [missionResults, setMissionResults] = useState<any>(null)

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorial-completed')
    if (!tutorialCompleted) setShowTutorial(true)
  }, [])

  useEffect(() => {
    if (previousView !== gameState.currentView) {
      setTransitioning(true)
      setTimeout(() => {
        setPreviousView(gameState.currentView)
        setTransitioning(false)
      }, 300)
    }
  }, [gameState.currentView, previousView])

  useEffect(() => {
    if (gameState.currentView === 'general-briefing' && gameState.currentMission) {
      const generateBriefing = async () => {
        const apiKey = localStorage.getItem('idle-ace-api-key') || ''
        const model = localStorage.getItem('idle-ace-model') || 'x-ai/grok-4-fast'
        let briefingText = FALLBACK_BRIEFING
        
        if (apiKey) {
          const messages = generateMissionBriefingPrompt(gameState.currentMission!, narrativeState.warProgress)
          const response = await sendChatCompletion(apiKey, model, messages)
          if (response) briefingText = response
        }
        
        addDialogue({
          id: `briefing-${Date.now()}`, type: 'mission-brief', speaker: 'general-martin',
          text: briefingText, timestamp: Date.now(), dismissed: false
        })
      }
      generateBriefing()
    }
  }, [gameState.currentView, gameState.currentMission])

  useEffect(() => {
    if (gameState.currentView === 'general-results' && missionResults) {
      const generateResults = async () => {
        const apiKey = localStorage.getItem('idle-ace-api-key') || ''
        const model = localStorage.getItem('idle-ace-model') || 'x-ai/grok-4-fast'
        let resultsText = missionResults.victory ? FALLBACK_VICTORY : FALLBACK_DEFEAT
        
        if (apiKey && gameState.currentMission) {
          const messages = generateMissionResultsPrompt(gameState.currentMission, missionResults, narrativeState.warProgress)
          const response = await sendChatCompletion(apiKey, model, messages)
          if (response) resultsText = response
        }
        
        addDialogue({
          id: `results-${Date.now()}`, type: 'mission-result', speaker: 'general-martin',
          text: resultsText, timestamp: Date.now(), dismissed: false,
          metadata: { victory: missionResults.victory, casualtyCount: missionResults.destroyedAllied }
        })
      }
      generateResults()
    }
  }, [gameState.currentView, missionResults])

  const handleDialogueDismiss = () => {
    if (narrativeState.currentDialogue) {
      dismissDialogue(narrativeState.currentDialogue.id)
      
      if (narrativeState.currentDialogue.type === 'mission-brief') {
        setCurrentView('combat')
      } else if (narrativeState.currentDialogue.type === 'mission-result') {
        setCurrentView('idle')
        setMissionResults(null)
      }
    }
  }

  const handleMissionComplete = (results: any) => {
    setMissionResults(results)
    setCurrentView('general-results')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {gameState.currentView !== 'combat' && <Header onShowTutorial={() => setShowTutorial(true)} />}
      
      <main className={`${gameState.currentView === 'combat' ? '' : 'container mx-auto px-4 py-6'} 
                       transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        {gameState.currentView === 'idle' && <IdleClickerView />}
        {gameState.currentView === 'combat' && <CombatSimulator onMissionComplete={handleMissionComplete} />}
      </main>

      {narrativeState.currentDialogue && !narrativeState.currentDialogue.dismissed && (
        <GeneralMartinModal dialogue={narrativeState.currentDialogue} onDismiss={handleDialogueDismiss} />
      )}

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {loading && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border-2 border-military-green rounded-lg p-4 z-40">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Communicating with General Martin...
        </div>
      )}
    </div>
  )
}

export default App
```

### §5.2 MAIN_ENTRY

```typescript
// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { GameStateProvider } from '@/contexts/GameStateContext'
import { NarrativeProvider } from '@/contexts/NarrativeContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import Index from './pages/Index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GameStateProvider>
        <NarrativeProvider>
          <Index />
        </NarrativeProvider>
      </GameStateProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
```

### §5.3 INDEX_PAGE

```typescript
// src/pages/Index.tsx

import App from '@/App'

const Index = () => {
  return <App />
}

export default Index
```

### §5.4 COMPONENT_TREE

```
src/components/
├ ErrorBoundary.tsx          # React error boundary wrapper
├ Header.tsx                 # Top navigation bar w/ settings
├ LoadingScreen.tsx          # Initial load animation
├ SettingsModal.tsx          # API key, model, TTS config
├ TutorialModal.tsx          # First-time user guide
├ GeneralMartinModal/        # AI briefing/debrief modal
│ └ index.tsx
├ IdleClickerView/           # Main game dashboard
│ ├ index.tsx               # Layout orchestrator
│ ├ MissionPanel.tsx        # Mission deployment UI
│ ├ OutfitPanel.tsx         # Squadron & jet management
│ ├ PilotTrainingPanel.tsx  # Pilot stats & training
│ └ ResearchPanel.tsx       # Tech tree interface
├ CombatSimulator/           # 3D combat environment
│ ├ index.tsx               # Combat orchestrator
│ ├ ThreeJsScene.tsx        # Three.js canvas & entities
│ ├ ResultsScreen.tsx       # Post-combat summary
│ └ HUD/                    # Heads-up display
│   ├ index.tsx             # HUD root
│   ├ HUDOverlay.tsx        # Main HUD container
│   ├ HMSReticle.tsx        # Targeting reticle
│   ├ IFFIndicator.tsx      # Friend/foe indicators
│   ├ RangeIndicators.tsx   # Distance markers
│   ├ TacticalSphere.tsx    # 3D position sphere
│   ├ AudioCueManager.tsx   # Sound effects
│   └ utils.ts              # Coordinate transforms
└ ui/                        # Shadcn UI primitives
  └ [40+ radix components]
```

---

## §6 3D_COMBAT_SYSTEM

### §6.1 THREE_SCENE

```
CombatSimulator architecture:
  
  index.tsx → orchestrates battle logic
    ├ manages BattleEntity[] state
    ├ runs physics simulation loop
    ├ handles user input (mouse, keys)
    ├ processes BattleEvent[] timeline
    └ triggers ResultsScreen on completion
  
  ThreeJsScene.tsx → renders 3D world
    ├ Canvas (@react-three/fiber)
    ├ OrbitControls (camera)
    ├ Lighting (ambient + directional)
    ├ Fighter jets (Box meshes colored by team)
    ├ Weapon fire particles
    ├ Explosion effects
    └ Skybox/background
  
  HUD/index.tsx → 2D overlay
    ├ Health bars
    ├ Ammo counters
    ├ Target lock indicators
    ├ Tactical sphere (mini-map)
    ├ Range markers
    └ Audio cues
```

### §6.2 ENTITY_SIMULATION

```
Physics loop (60fps):
  1. Update positions: pos += velocity * deltaTime
  2. Update rotations based on target bearing
  3. Check weapon firing conditions
  4. Generate BattleEvent on hit/miss
  5. Update health, check destroyed state
  6. Remove destroyed/escaped entities
  7. Check win conditions
  
Collision detection:
  - Weapon range: 500 units
  - Hit probability: intelligence / 100
  - Damage variance: ±20%
  
AI behavior:
  - Target nearest enemy
  - Maintain pursuit distance
  - Evade when health < 30%
  - Flee at 10% health if losing
```

---

## §7 CUSTOM_HOOKS

### §7.1 BATTLE_SIMULATION

```typescript
// src/hooks/useBattleSimulation.ts

export const useBattleSimulation = (
  squadron: FighterJet[], pilots: Pilot[], mission: Mission
) => {
  const [entities, setEntities] = useState<BattleEntity[]>([])
  const [events, setEvents] = useState<BattleEvent[]>([])
  const [battleComplete, setBattleComplete] = useState(false)
  
  // Initialize entities
  // Run physics loop
  // Process events
  // Return { entities, events, battleComplete, startBattle, endBattle }
}
```

### §7.2 OPEN_ROUTER

```typescript
// src/hooks/useOpenRouter.ts

export const useOpenRouter = () => {
  const [loading, setLoading] = useState(false)
  
  const sendChatCompletion = async (
    apiKey: string, model: string, messages: Array<{ role: string; content: string }>
  ): Promise<string | null> => {
    setLoading(true)
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages })
      })
      const data = await response.json()
      return data.choices[0]?.message?.content || null
    } catch (error) {
      console.error('OpenRouter error:', error)
      return null
    } finally {
      setLoading(false)
    }
  }
  
  return { sendChatCompletion, loading }
}
```

### §7.3 TEXT_TO_SPEECH

```typescript
// src/hooks/useTextToSpeech.ts

export const useTextToSpeech = () => {
  const speak = (text: string, settings: Settings['tts']) => {
    if (!settings.enabled) return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = settings.volume
    
    if (settings.voice) {
      const voices = window.speechSynthesis.getVoices()
      const selectedVoice = voices.find(v => v.name === settings.voice)
      if (selectedVoice) utterance.voice = selectedVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }
  
  const stop = () => {
    window.speechSynthesis.cancel()
  }
  
  return { speak, stop }
}
```

### §7.4 MISSION_TIMER

```typescript
// src/hooks/useMissionTimer.ts

export const useMissionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const startTimer = (duration: number) => setTimeRemaining(duration)
  
  return { timeRemaining, startTimer }
}
```

---

## §8 STYLING_SYSTEM

### §8.1 INDEX_CSS

```css
/* src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### §8.2 UI_PATTERNS

```
Common Tailwind patterns used:

Cards:
  className="bg-gray-800 border-2 border-military-green rounded-lg p-4"

Buttons:
  className="bg-military-green hover:bg-green-600 text-white px-4 py-2 rounded"

Progress bars:
  className="w-full bg-gray-700 rounded-full h-2"
  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }} />

Modals:
  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
```

---

## §9 BUILD_DEPLOY

### §9.1 SCRIPTS

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### §9.2 HTML_TEMPLATE

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name
