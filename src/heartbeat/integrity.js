import { Connection } from "@solana/web3.js";
export class IntegrityHeartbeat {
    mainnet;
    devnet;
    tpsThreshold;
    constructor(mainnetRpc = "https://api.mainnet-beta.solana.com", devnetRpc = "https://api.devnet.solana.com", tpsThreshold = 1000) {
        this.mainnet = new Connection(mainnetRpc);
        this.devnet = new Connection(devnetRpc);
        this.tpsThreshold = tpsThreshold;
    }
    /**
     * Checks health for a specific connection.
     */
    async checkCluster(conn, label) {
        try {
            const slot = await conn.getSlot();
            const perfSamples = await conn.getRecentPerformanceSamples(1);
            let tps = 0;
            if (perfSamples.length > 0 && perfSamples[0]) {
                const sample = perfSamples[0];
                tps = sample.numTransactions / sample.samplePeriodSecs;
            }
            const isCongested = tps < this.tpsThreshold;
            return {
                cluster: label,
                slot,
                tps: Math.round(tps),
                performance: isCongested ? "DEGRADED" : "OPTIMAL",
                isCongested
            };
        }
        catch (error) {
            return {
                cluster: label,
                slot: 0,
                tps: 0,
                performance: "UNREACHABLE",
                isCongested: true
            };
        }
    }
    async checkIntegrity() {
        const [mainnetHealth, devnetHealth] = await Promise.all([
            this.checkCluster(this.mainnet, "Solana Mainnet"),
            this.checkCluster(this.devnet, "Solana Devnet")
        ]);
        return { mainnet: mainnetHealth, devnet: devnetHealth };
    }
}
//# sourceMappingURL=integrity.js.map