import axios from "axios";

export interface SlippageProfile {
    inputMint: string;
    outputMint: string;
    amount: string;
    priceImpactPct: number;
    slippageBps: number;
    isSafe: boolean;
}

export class SlippageSentinel {
    private jupiterUrl: string;
    private maxPriceImpact: number;

    constructor(
        maxPriceImpact: number = 0.5, // 0.5% default ceiling
        jupiterUrl: string = "https://quote-api.jup.ag/v6"
    ) {
        this.maxPriceImpact = maxPriceImpact;
        this.jupiterUrl = jupiterUrl;
    }

    /**
     * Checks the price impact for a proposed swap.
     * @param inputMint Source token mint
     * @param outputMint Target token mint
     * @param amount Amount in atoms
     * @returns SlippageProfile
     */
    async checkPriceImpact(
        inputMint: string,
        outputMint: string,
        amount: string
    ): Promise<SlippageProfile> {
        try {
            const response = await axios.get(`${this.jupiterUrl}/quote`, {
                params: {
                    inputMint,
                    outputMint,
                    amount,
                    slippageBps: 50, // 0.5%
                }
            });

            const data = response.data;
            const priceImpactPct = parseFloat(data.priceImpactPct) || 0;

            return {
                inputMint,
                outputMint,
                amount,
                priceImpactPct,
                slippageBps: data.slippageBps,
                isSafe: priceImpactPct <= this.maxPriceImpact,
            };
        } catch (error: any) {
            throw new Error(`Slippage check failed: ${error.message}`);
        }
    }

    /**
     * Strategic Variance check.
     */
    isStrategicVariance(impact: number): boolean {
        return impact > this.maxPriceImpact;
    }
}
