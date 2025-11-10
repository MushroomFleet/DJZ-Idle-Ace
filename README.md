# Idle Ace Commander ✈️

**An immersive idle/incremental game combining strategic squadron management with 3D aerial combat simulation.**

[![Play Now](https://img.shields.io/badge/Play%20Now-Live%20Demo-brightgreen?style=for-the-badge)](https://idle-ace.oragenai.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/MushroomFleet/DJZ-Idle-Ace)

🎮 **[Play the game now!](https://idle-ace.oragenai.com/)**

## 🎯 About

Idle Ace Commander is a unique blend of idle/clicker mechanics and 3D combat simulation. Command a squadron of fighter jets, manage your pilots, research advanced technologies, and engage in thrilling aerial combat missions. The game features AI-powered narrative content through General Martin, your commanding officer, who provides mission briefings and debriefings with dynamic, contextual dialogue.

## ✨ Features

- **🎮 Idle/Incremental Gameplay**: Earn credits and research points passively while managing your squadron
- **✈️ 3D Combat Simulation**: Engage in real-time aerial combat with immersive Three.js-powered 3D graphics
- **🤖 AI-Powered Narrative**: Dynamic mission briefings and results powered by AI through OpenRouter integration
- **👥 Squadron Management**: Build and customize your fighter squadron with multiple jets and pilots
- **🔬 Research Tree**: Unlock 9 advanced technologies across 3 tiers (weapons, engines, avionics)
- **⚡ Upgrade Systems**: Enhance your jets with 10 upgrade levels in weapons, engines, and avionics
- **🎓 Pilot Training**: Train your pilots' intelligence and endurance stats to improve combat effectiveness
- **🔊 Text-to-Speech Support**: Immersive audio narration for mission briefings and results
- **💾 Auto-Save**: Your progress is automatically saved every 30 seconds
- **📱 Responsive Design**: Play on desktop or mobile devices

## 🎮 How to Play

### Starting Out

You begin with:
- **2 Fighter Jets**: "Falcon One" and "Falcon Two"
- **2 Pilots**: "Maverick" and "Viper"
- **1,000 Credits**: Your starting budget
- **0 Research Points**: Earned through successful missions

### Game Loop

1. **Idle Phase**: Manage your squadron from the main dashboard
   - Upgrade your jets (weapons, engines, avionics)
   - Train your pilots (intelligence, endurance)
   - Research new technologies
   - Deploy on missions when available

2. **Mission Briefing**: General Martin provides your mission objectives
   - Review the mission parameters
   - Assess enemy forces
   - Receive strategic guidance

3. **Combat Phase**: Engage in 3D aerial combat
   - Control your squadron in real-time 3D space
   - Target and eliminate enemy fighters
   - Manage ammunition and positioning
   - Complete objectives under time pressure

4. **Mission Results**: Evaluate your performance
   - Review kills, losses, and mission success
   - Earn rewards (credits and research points)
   - Receive General Martin's assessment
   - Apply lessons to future missions

### Resources

- **Credits**: Used for jet upgrades and pilot training
  - Earned through mission completion
  - Amount varies based on performance

- **Research Points**: Used to unlock technologies
  - Earned through successful missions
  - Higher difficulty missions yield more points

### Progression Systems

#### Jet Upgrades
Each jet can be upgraded in three categories (up to level 10):
- **Weapons**: +2 weapon strength per level
- **Engines**: +1 speed per level
- **Avionics**: +1 agility per level

#### Pilot Training
Train pilots in two attributes:
- **Intelligence**: Improves targeting and tactical decisions
- **Endurance**: Increases survivability and stamina

Training fills a progress bar; at 100%, the pilot gains +10 to the stat and levels up.

#### Research Tree

**Tier 1** (30 seconds, 20 RP each):
- Advanced Missiles (unlocks weapon upgrades to level 3)
- Afterburner Technology (unlocks engine upgrades to level 3)
- Fly-by-Wire Systems (unlocks avionics upgrades to level 3)

**Tier 2** (60 seconds, 50 RP each):
- Plasma Cannons (unlocks weapon upgrades to level 6)
- Ion Propulsion (unlocks engine upgrades to level 6)
- Neural Interface (unlocks avionics upgrades to level 6)

**Tier 3** (120 seconds, 100 RP each):
- Antimatter Warheads (unlocks weapon upgrades to level 10)
- Quantum Drive (unlocks engine upgrades to level 10)
- AI Autopilot (unlocks avionics upgrades to level 10)

### Combat Tips

- Focus fire on individual enemies rather than spreading damage
- Use the tactical sphere to track enemy positions in 3D space
- Monitor your ammunition - running out mid-combat is deadly
- Position yourself for advantageous angles of attack
- Protect weaker wingmen during intense engagements

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **pnpm** package manager (recommended for handling native dependencies)

Install pnpm globally:
```bash
npm install -g pnpm
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/MushroomFleet/DJZ-Idle-Ace.git
cd DJZ-Idle-Ace
```

2. **Install dependencies**
```bash
pnpm install
```

> **Note**: We recommend using `pnpm` over `npm` as it handles optional native dependencies (like Rollup's Windows binaries) more reliably.

3. **Configure AI Narrative (Optional)**

For AI-powered mission briefings and results, you'll need an OpenRouter API key:

- Visit [OpenRouter](https://openrouter.ai/) and create an account
- Generate an API key
- In the game, click the settings icon (⚙️) in the top right
- Enter your API key and select a model (default: `x-ai/grok-4-fast`)
- The game will work without an API key but will use fallback dialogue

4. **Start the development server**
```bash
npm run dev
```

The game will be available at `http://localhost:8080`

5. **Build for production**
```bash
npm run build
```

The production build will be in the `dist/` directory.

### Troubleshooting Installation Issues

**Windows Users**: If you encounter an error about missing `@rollup/rollup-win32-x64-msvc` when running `npm run dev`, this is a known npm bug with optional dependencies.

**Quick Fix**: Use pnpm instead of npm:
```bash
pnpm install
npm run dev
```

For detailed troubleshooting steps and solutions, see: **[docs/npm-install-fixes.md](docs/npm-install-fixes.md)**

## 🏗️ Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.21
- **3D Graphics**: Three.js 0.164.1 + React Three Fiber 8.18.0
- **3D Helpers**: @react-three/drei 9.122.0
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.18
- **State Management**: React Context API
- **AI Integration**: OpenRouter API
- **Audio**: Web Speech API for Text-to-Speech
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📁 Project Structure

```
DJZ-Idle-Ace/
├── src/
│   ├── components/          # React components
│   │   ├── CombatSimulator/ # 3D combat simulation
│   │   ├── IdleClickerView/ # Main game dashboard
│   │   ├── ui/              # Shadcn UI components
│   │   └── ...
│   ├── contexts/            # React Context providers
│   │   ├── GameStateContext.tsx
│   │   └── NarrativeContext.tsx
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   ├── combatCalculations.ts
│   │   ├── techTree.ts
│   │   └── ...
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── ...
```

## 🎨 Key Features Deep Dive

### 3D Combat System
The combat simulator uses Three.js to render a fully 3D battlefield with:
- Dynamic camera perspectives
- Real-time physics calculations
- Particle effects for weapons fire
- HUD overlay with tactical information
- IFF (Identification Friend or Foe) indicators

### AI Narrative System
Integration with OpenRouter provides:
- Contextual mission briefings based on war progress
- Dynamic mission results reflecting performance
- Personality-driven dialogue from General Martin
- Support for multiple AI models (Grok, GPT-4, Claude, etc.)

### Progressive Unlocks
The game features a carefully balanced progression:
- Research unlocks higher upgrade tiers
- Upgrades improve combat effectiveness
- Pilot training creates strategic advantages
- Mission difficulty scales with player strength

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is open source. Please check the repository for license details.

## 📚 Citation

### Academic Citation

If you use this codebase in your research or project, please cite:

```bibtex
@software{djz_idle_ace,
  title = {DJZ Idle Ace: An AI-Powered Incremental Combat Simulation},
  author = {Drift Johnson},
  year = {2025},
  url = {https://github.com/MushroomFleet/DJZ-Idle-Ace},
  version = {1.0.0}
}
```

### Support Development

If you enjoy this project, consider supporting its development:

[![Ko-Fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/driftjohnson)

---

**Built with ❤️ using React, Three.js, and AI**

