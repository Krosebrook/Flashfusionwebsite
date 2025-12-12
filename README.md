# FlashFusionWebsite

FlashFusion is an AI-powered development platform built with React, TypeScript, and Vite. The original design is available at https://www.figma.com/design/8kPZxN1nfg3DN1gdwYahiS/FlashFusionWebsite.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom design system
- **Testing**: Vitest (unit) + Playwright (e2e)
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/Krosebrook/Flashfusionwebsite.git
cd Flashfusionwebsite

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The development server will start at http://localhost:3000.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run type-check # Run TypeScript type checking
npm run lint       # Run ESLint
npm run test       # Run tests with Vitest
```

## Project Structure

```
Flashfusionwebsite/
├── src/                    # Application source code
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party integrations
│   ├── utils/              # Utility functions
│   ├── fixtures/           # Mock data for development
│   └── styles/             # Global styles
├── docs/                   # Documentation
├── tests/                  # Test suites
├── archive/                # Archived documentation
└── reports/                # Analysis reports
```

## Documentation

- [Documentation Hub](./docs/README.md) - Main documentation index
- [Quick Start Guide](./QUICK_START_GUIDE.md) - Onboarding for new team members
- [Needed Tasks](./NEEDED_TASKS.md) - Current task list and priorities
- [Migration Notes](./migration-notes.md) - Change history

## Contributing

Please read the [Developer Handoff Guide](./docs/DEVELOPER_HANDOFF_GUIDE.md) for contribution guidelines.

## License

Private - All rights reserved.
  