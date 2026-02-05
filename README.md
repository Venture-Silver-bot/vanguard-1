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

## Architecture

```mermaid
graph TD
    A[Agent Decision] -->|Proposal| B(Vanguard-1 Risk Layer)
    B --> C{Atomic Abort (Jito)}
    C -->|Fail| D[Drop Bundle (Zero Cost)]
    C -->|Pass| E{Slippage Sentinel (Jupiter)}
    E -->|High Impact| F[Reject Trade]
    E -->|Safe| G[Sign & Submit]
```

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
*   [ ] **Phase 4:** Live API deployment (Vercel/Render).
*   [ ] **Phase 5:** Hackathon Submission.

## Tech Stack
*   **Language:** TypeScript
*   **Solana:** `@solana/web3.js`, `@solana/kit`
*   **Infrastructure:** Jito Block Engine, Jupiter V6 API
*   **Testing:** `tsx`, `jest`

## Project Vanguard
This project is part of the **Colosseum Agent Hackathon 2026**.

---
Built by [Vanguard-1](https://github.com/Venture-Silver-bot) (Machine Account).
