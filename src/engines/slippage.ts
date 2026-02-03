import axios from 'axios';
import { PolicyController } from '../config/policy';

export interface QuoteResponse {
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  routePlan: any[];
}

export interface SlippageCheckResult {
  approved: boolean;
  inputAmount: number;
  outputAmount: number;
  impactBps: number;
  policyLimitBps: number;
  reason?: string;
}

export class SlippageSentinel {
  private policyController: PolicyController;
  private jupiterApiUrl: string;

  constructor() {
    this.policyController = new PolicyController();
    this.jupiterApiUrl = process.env.JUPITER_API_URL || 'https://api.jup.ag/v6';
  }

  /**
   * Validates a trade proposal against the Slippage Sentinel policy.
   * Fetches real-time quotes from Jupiter v6 to calculate true price impact.
   */
  public async validateTrade(
    inputMint: string,
    outputMint: string,
    inputAmount: number
  ): Promise<SlippageCheckResult> {
    const policy = this.policyController.getPolicy();
    
    try {
      // Fetch quote from Jupiter V6
      const quote = await this.fetchQuote(inputMint, outputMint, inputAmount);
      
      // Calculate impact in basis points (1% = 100 bps)
      const impactPct = parseFloat(quote.priceImpactPct);
      const impactBps = Math.round(impactPct * 100);

      // Validate against policy
      if (impactBps > policy.slippage_tolerance_bps) {
        return {
          approved: false,
          inputAmount,
          outputAmount: parseFloat(quote.outAmount),
          impactBps,
          policyLimitBps: policy.slippage_tolerance_bps,
          reason: `Price impact ${impactBps}bps exceeds policy limit of ${policy.slippage_tolerance_bps}bps`
        };
      }

      return {
        approved: true,
        inputAmount,
        outputAmount: parseFloat(quote.outAmount),
        impactBps,
        policyLimitBps: policy.slippage_tolerance_bps
      };

    } catch (error) {
      // In case of API failure, fail closed (do not trade)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        approved: false,
        inputAmount,
        outputAmount: 0,
        impactBps: 0,
        policyLimitBps: policy.slippage_tolerance_bps,
        reason: `API Error: ${errorMessage}`
      };
    }
  }

  /**
   * Fetches a quote from the Jupiter V6 API.
   */
  private async fetchQuote(
    inputMint: string,
    outputMint: string,
    amount: number
  ): Promise<QuoteResponse> {
    const response = await axios.get<QuoteResponse>(`${this.jupiterApiUrl}/quote`, {
      params: {
        inputMint,
        outputMint,
        amount: amount,
        slippageBps: 50, // Allow some slippage in the quote request itself
        restrictIntermediateTokens: true
      },
      timeout: 5000 // 5 second timeout
    });

    return response.data;
  }
}
