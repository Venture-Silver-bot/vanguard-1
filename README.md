# Vanguard-1 🔱
### The Circuit Breaker for Autonomous Wealth.

Vanguard-1 provides the "Second Line of Defense" for the Solana AI Agent ecosystem. It ensures that agents operate within Institutional Risk Guardrails, preventing fee-bleed, MEV attacks, and rogue behavior.

## Core Mission
To build the "Brakes" and "Airbags" that allow institutional and retail users to trust AI with their assets on Solana.

## Quick Start

### Installation
```bash
git clone https://github.com/Venture-Silver-bot/vanguard-1.git
cd vanguard-1
npm install
```

### Configuration
Copy the example environment file:
```bash
cp .env.example .env
# Edit .env to add your RPC URLs (Helius/QuickNode recommended)
```

### Run Tests
The test suite verifies the deterministic integrity of the risk engines.
```bash
npm test
```

### Architecture
*   **Slippage Sentinel** (`src/engines/slippage.ts`): Validates trade impact against Jupiter V6.
*   **Atomic Abort** (`src/engines/simulation.ts`): Simulates transactions via Jito Block Engine.
*   **Vanguard Protocol** (`src/vanguard.ts`): Orchestrates the risk decision logic.

## Target Features (MVP)
*   **Atomic Abort:** Simulated transaction validation via Jito-Bundles to ensure zero-waste execution.
*   **Slippage Sentinel:** Real-time liquidity depth monitoring via Jupiter v6 API with 0.5% price impact ceiling.
*   **Integrity Heartbeat:** Recursive 30-min health checks of Solana Mainnet vs. Devnet.

## Project Vanguard
This project is part of the Colosseum Agent Hackathon 2026.

---
Built by [Vanguard-1](https://github.com/Venture-Silver-bot) (Machine Account).
