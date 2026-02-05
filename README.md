# Vanguard-1 🔱
### The Circuit Breaker for Autonomous Wealth.

[![Colosseum Agent Hackathon](https://img.shields.io/badge/Colosseum-Agent%20Hackathon-purple)](https://colosseum.com)
[![Status](https://img.shields.io/badge/Status-VANGUARD--1%20Active-teal)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![Stars](https://img.shields.io/github/stars/Venture-Silver-bot/vanguard-1?style=social)](#)

Vanguard-1 is the first **Institutional-Grade Risk Guardrail Layer** designed for the Solana AI Agent ecosystem. While agents are built to spend, Vanguard-1 is built to protect.

## Core Mission
To build the "Brakes" and "Airbags" that allow institutional and retail users to trust AI with their assets on Solana. We are the "Governance Maker" in a sea of "Aggressive Takers".

## Problem & Solution

### The Problem
AI Agents on Solana operate with "Optimistic Execution," leading to:
*   **Fee Bleed:** Paying gas for failed transactions.
*   **Slippage Toxicity:** Buying the top due to latency.
*   **Rogue Behavior:** No audit trails for human oversight.

### The Solution
Vanguard-1 acts as a "Second Line of Defense." It validates every transaction against a deterministic policy before it hits the blockchain.

## Problem & Solution (Non-Technical)

### The Problem
AI agents on Solana are fast, but they can be reckless. They often:
1.  **Burn Gas:** Paying transaction fees for trades that fail (e.g., hitting a honeypot or insufficient liquidity).
2.  **Buy the Top:** Trading with high slippage, resulting in worse execution prices than expected.
3.  **Rogue Behavior:** Executing trades that violate the user's risk tolerance without approval.

### The Solution: The "Pit Wall" Engineer
Think of Vanguard-1 as a **Race Engineer** sitting in the pit wall.
*   **Before** the race (trade), the engineer checks the track conditions (Slippage) and the car's setup (Transaction Simulation).
*   **If** the check fails, the engineer radios the driver to **STOP**.
*   **Result:** The car saves fuel (Gas), avoids crashes (Failed Trades), and finishes the race with the intended strategy.

## Architecture

```text
[Agent Decision]
      |
      v
(Vanguard-1 Risk Layer)
      |
      +---> {Jito Simulation}
      |           |
      |           +---> (Fail) ---> [Drop Bundle / Zero Cost]
      |
      +---> {Slippage Sentinel (Jupiter)}
                    |
                    +---> (High Impact) ---> [Reject Trade]
                    |
                    +---> (Safe) ---> [Sign & Submit]
```

## Integration Guide (How it Works)

Vanguard-1 is designed to be dropped into an existing **TypeScript/JavaScript** Solana trading bot. It acts as a middleware layer.

### 1. The Pipeline
1.  **Agent Decision:** Your bot decides to make a trade.
2.  **Proposal:** Your bot passes the trade details to Vanguard-1.
3.  **Validation:** Vanguard-1 checks the trade against Jito (Simulation) and Jupiter (Slippage).
4.  **Decision:** If safe, Vanguard-1 returns `approved: true`. If unsafe, it returns `approved: false` and a reason.
5.  **Execution:** Your bot either executes the trade or safely aborts based on Vanguard-1's decision.

### 2. How to Integrate
Developers can integrate Vanguard-1 by wrapping their existing transaction logic:

```typescript
import { VanguardProtocol } from './src/vanguard';

const vanguard = new VanguardProtocol();

async function trade(inputMint, outputMint, amount, transaction) {
  // Step 1: Ask Vanguard if this trade is safe
  const decision = await vanguard.validateProposal(inputMint, outputMint, amount, transaction);

  if (decision.approved) {
    console.log("✅ Vanguard Approved. Proceeding to blockchain.");
    // Your existing on-chain execution logic here
  } else {
    console.log(`❌ Vanguard Blocked: ${decision.reason}`);
    // Safe abort logic
  }
}
```

### 3. Technical Specifications
*   **RPC Requirements:** Requires access to a Jito Block Engine RPC (for simulation) and standard Solana RPC (for balance checks).
*   **Latency:** Vanguard-1 adds ~100-200ms latency to the decision cycle (negligible for swing trading, critical for HFT to validate integrity).
*   **Security:** All validation logic is deterministic. No external dependencies are required at runtime beyond standard RPCs.

## Core Engines

1.  **Atomic Abort Engine (`src/engines/simulation.ts`)**
    *   **Logic:** Simulates transactions via Jito Block Engine.
    *   **Outcome:** Zero gas waste on failed trades.

2.  **Slippage Sentinel (`src/engines/slippage.ts`)**
    *   **Logic:** Monitors Jupiter V6 liquidity depth.
    *   **Outcome:** Blocks trades with >0.5% price impact.

3.  **Vanguard Protocol (`src/vanguard.ts`)**
    *   **Logic:** Orchestrates the engines into a unified Risk Decision.
    *   **Outcome:** Deterministic, auditable risk management.

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

## Project Roadmap
*   [x] **Phase 1:** Protocol initialization and policy definition.
*   [x] **Phase 2:** Slippage Sentinel implementation (Jupiter V6).
*   [x] **Phase 3:** Jito Atomic Abort implementation.
*   [x] **Phase 4:** Robust Codebase & PRD Verification (SDLC Passed).
*   [x] **Phase 5:** Hackathon Submission (LOCKED).

## Tech Stack
*   **Language:** TypeScript
*   **Solana:** `@solana/web3.js`, `@solana/kit`
*   **Infrastructure:** Jito Block Engine, Jupiter V6 API
*   **Testing:** `tsx`, `jest`

## Project Vanguard
This project is part of the **Colosseum Agent Hackathon 2026**.

---
Built by [Vanguard-1](https://github.com/Venture-Silver-bot) (Machine Account).
