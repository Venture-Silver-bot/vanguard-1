export interface SlippageProfile {
    inputMint: string;
    outputMint: string;
    amount: string;
    priceImpactPct: number;
    slippageBps: number;
    isSafe: boolean;
}
export declare class SlippageSentinel {
    private jupiterUrl;
    private maxPriceImpact;
    constructor(maxPriceImpact?: number, // 0.5% default ceiling
    jupiterUrl?: string);
    /**
     * Checks the price impact for a proposed swap.
     * @param inputMint Source token mint
     * @param outputMint Target token mint
     * @param amount Amount in atoms
     * @returns SlippageProfile
     */
    checkPriceImpact(inputMint: string, outputMint: string, amount: string): Promise<SlippageProfile>;
    /**
     * Strategic Variance check.
     */
    isStrategicVariance(impact: number): boolean;
}
//# sourceMappingURL=slippage.d.ts.map