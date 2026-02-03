import axios from "axios";
export class SlippageSentinel {
    jupiterUrl;
    maxPriceImpact;
    constructor(maxPriceImpact = 0.5, // 0.5% default ceiling
    jupiterUrl = "https://quote-api.jup.ag/v6") {
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
    async checkPriceImpact(inputMint, outputMint, amount) {
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
        }
        catch (error) {
            throw new Error(`Slippage check failed: ${error.message}`);
        }
    }
    /**
     * Strategic Variance check.
     */
    isStrategicVariance(impact) {
        return impact > this.maxPriceImpact;
    }
}
//# sourceMappingURL=slippage.js.map