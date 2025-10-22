# 🎮 NextEra - Battle-First Roguelike

**A deterministic tactical roguelike with Golden Sun-inspired aesthetics**

[![Live Demo](https://img.shields.io/badge/Play-Live%20Demo-blue?style=for-the-badge)](https://dist-next-era.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-191%20Passing-success?style=flat-square)](./tests)
[![Bundle Size](https://img.shields.io/badge/Bundle-85KB%20gzipped-success?style=flat-square)](https://bundlephobia.com)

---

## 🚀 Play Now

**Live Demo:** https://dist-next-era.vercel.app

Works on desktop and mobile. No installation required!

---

## ✨ Features

### 🎯 Core Gameplay
- **Turn-based tactical combat** with speed-based initiative
- **Deterministic gameplay** - same seed = same outcome (perfect for speedruns!)
- **Complete game loop** - Battle → Rewards → Recruit → Repeat
- **Team building** - Choose 4 from 12 starter units
- **Recruitment system** - Capture defeated enemies

### 🎨 Polish & UX
- **Golden Sun aesthetic** - Beautiful retro-inspired visuals
- **19 animated psynergy effects** - Dragon Fire, Blue Bolt, Inferno, etc.
- **Full keyboard navigation** - Arrow keys + Enter on every screen
- **Accessibility** - WCAG 2.1 AA compliant, screen reader support
- **Settings** - Audio, accessibility, and gameplay options
- **Save/Load system** - LocalStorage persistence

### 📊 Content
- **12 Starter Units** - 3 of each role (Tank, DPS, Support, Specialist)
- **19 Opponents** - Balanced across difficulties and tags
- **30 Items** - Weapons, armor, accessories, consumables
- **2,500+ Sprites** - Golden Sun sprite library

---

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Bundler:** Vite 5 (fast HMR)
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + Testing Library (191 tests, 100% passing)
- **RNG:** pure-rand (deterministic, forkable)
- **Validation:** Valibot
- **Deployment:** Vercel (auto-deploy on push)
- **Analytics:** Vercel Analytics

---

## 🏃 Quick Start

### Prerequisites
- Node.js 20+ ([Download](https://nodejs.org))
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/badnewsgoonies-dot/NextEraGame.git
cd NextEraGame

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000** to play!

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run type-check   # TypeScript validation
```

---

## 🎮 How to Play

1. **Choose Your Team** - Select 4 starter units (Tank, DPS, Support, Specialist)
2. **Select Opponent** - Pick from 3 randomly generated opponents
3. **Watch Battle** - Turn-based auto-battle with animations
4. **Collect Rewards** - Earn items and experience
5. **Recruit** - Add defeated enemies to your team
6. **Repeat** - Battle indefinitely, build your perfect team!

**Controls:**
- **Arrow Keys** - Navigate menus and options
- **Enter/Space** - Confirm selections
- **Escape** - Cancel/Go back

---

## 🏗️ Architecture

### Core Systems
- **GameController** - Orchestrates all systems and state
- **BattleSystem** - Deterministic turn-based combat engine
- **ChoiceSystem** - Diverse opponent generation with fallback rules
- **RewardSystem** - Difficulty-based loot generation
- **TeamManager** - Roster management and unit conversion
- **SaveSystem** - State persistence with versioning
- **SettingsManager** - User preferences

### Design Patterns
- **Result types** - Type-safe error handling
- **Forked RNG streams** - Deterministic randomness per system
- **State machine** - Enforced game state transitions
- **Property-based testing** - 500+ random test runs for determinism

### Code Quality
- **TypeScript strict mode** - Zero type errors
- **191 comprehensive tests** - Unit, integration, accessibility, performance
- **Clean architecture** - Separation of concerns
- **Zero dependencies on game logic** - Pure functions, testable

---

## 📁 Project Structure

```
NextEraGame/
├── src/
│   ├── screens/          # 7 game screens
│   ├── components/       # Reusable UI components
│   ├── systems/          # Core game systems
│   ├── hooks/            # React hooks (battle animation, keyboard nav)
│   ├── data/             # Content (units, opponents, items)
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utilities (RNG, Result, validation)
├── tests/                # 191 tests (100% passing)
├── public/               # Static assets (2,500+ sprites)
├── docs/                 # Comprehensive documentation
└── scripts/              # Build and deployment tools
```

---

## 🧪 Testing

**Test Coverage:**
- **Unit Tests:** 139 (systems, utils, components)
- **Integration Tests:** 23 (full game flows)
- **Accessibility Tests:** 15 (WCAG 2.1 AA)
- **Performance Tests:** 14 (render benchmarks)
- **Property Tests:** 500+ runs (determinism proof)

```bash
npm test                 # Run all tests
npm run test:coverage    # Generate coverage report
```

**Quality Metrics:**
- ✅ 191/191 tests passing
- ✅ 0 TypeScript errors
- ✅ 0 accessibility violations
- ✅ <100ms render time (all screens)

---

## 🚀 Deployment

### Vercel (Recommended)

**Automatic Deployment:**
This repo is connected to Vercel and auto-deploys on every push to `main`.

**Production URL:** https://dist-next-era.vercel.app

**Manual Deployment:**
```bash
npm run build
npx vercel --prod
```

### Other Platforms

Works on any static hosting:
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

---

## 🎯 Roadmap

### ✅ Complete (MVP)
- Core game loop
- 7 screens
- Battle system
- Recruitment
- Save/load
- Settings

### 🚧 Planned Features
- [ ] Replace placeholder sprites with pixel art
- [ ] Sound effects and background music
- [ ] Boss encounters
- [ ] Meta-progression (unlocks, achievements)
- [ ] Passive abilities
- [ ] Tag synergy bonuses
- [ ] More content (50+ opponents, 100+ items)

---

## 📚 Documentation

- **[Quickstart Guide](./QUICKSTART.md)** - Get started in 5 minutes
- **[Architecture Decisions](./ARCHITECTURE_DECISIONS.md)** - Design rationale
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - How to deploy
- **[Stabilization Checklist](./STABILIZATION_CHECKLIST.md)** - Production readiness
- **[Development History](./docs/history/)** - Complete phase-by-phase progress

---

## 🤝 Contributing

Contributions welcome! This is a solo project but open to improvements.

**Areas for contribution:**
- Pixel art sprites (characters, enemies)
- Sound effects / music
- Balance tweaking
- New units / opponents / items
- Bug fixes

---

## 📄 License

MIT License - feel free to use, modify, and distribute!

---

## 🙏 Credits

- **Game Design:** Inspired by Golden Sun (Camelot Software)
- **Sprites:** Golden Sun sprite library
- **Development:** Built with Claude (Anthropic) as pair programming partner
- **Testing:** Comprehensive test suite with Vitest

---

## 📊 Stats

- **Development Time:** ~12 hours (across multiple sessions)
- **Lines of Code:** 21,500+ (source + tests + docs)
- **Files:** 95+
- **Tests:** 191 (100% passing)
- **Bundle Size:** 85KB gzipped
- **Load Time:** <1 second on 3G

---

## 🎮 Play the Game!

**Ready to play?**

👉 **[Launch NextEra](https://dist-next-era.vercel.app)** 👈

---

**Built with ❤️ and deterministic RNG**
