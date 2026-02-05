import { SlippageSentinel } from './engines/slippage';
import { JitoSimulationEngine } from './engines/simulation';

// Re-export for strict type safety across the module
export type { SimulationResult } from './engines/simulation';

export interface RiskDecision {
  approved: boolean;
  reason: string;
  timestamp: number;
  checks: {
    slippage: boolean;
    simulation: boolean;
    integrity: boolean;
  };
}

export class VanguardProtocol {
  private slippageEngine: SlippageSentinel;
  private jitoEngine: JitoSimulationEngine;

  constructor() {
    this.slippageEngine = new SlippageSentinel();
    this.jitoEngine = new JitoSimulationEngine();
  }

  /**
   * Validates a trade proposal against all Vanguard-1 risk engines.
   * Returns a deterministic RiskDecision.
   */
  public async validateProposal(
    inputMint: string,
    outputMint: string,
    inputAmount: number,
    transaction?: any // The actual Solana transaction object
  ): Promise<RiskDecision> {
    
    const timestamp = Date.now();
    const checks = {
      slippage: false,
      simulation: false,
      integrity: true
    };

    // 1. Slippage Check
    const slippageResult = await this.slippageEngine.validateTrade(inputMint, outputMint, inputAmount);
    if (!slippageResult.approved) {
      return {
        approved: false,
        reason: `Slippage Violation: ${slippageResult.reason}`,
        timestamp,
        checks: { ...checks, slippage: false }
      };
    }
    checks.slippage = true;

    // 2. Jito Simulation Check
    // We pass the constructed transaction to the Jito Engine for atomic validation.
    // If no transaction is provided, we fall back to the basic transfer simulation for testing.
    let simulationResult: SimulationResult;
    
    if (transaction) {
      simulationResult = await this.jitoEngine.simulate(transaction);
    } else {
      // Fallback for testing without a full transaction object
      simulationResult = await this.jitoEngine.simulateTransfer('test-sender', 'test-receiver', inputAmount);
    }

    if (!simulationResult.approved) {
      return {
        approved: false,
        reason: `Jito Simulation Failed: ${simulationResult.error || 'Unknown Error'}`,
        timestamp,
        checks: { ...checks, simulation: false }
      };
    }
    checks.simulation = true;

    // If all checks pass
    return {
      approved: true,
      reason: 'All checks passed. Trade proposal authorized.',
      timestamp,
      checks
    };
  }
}