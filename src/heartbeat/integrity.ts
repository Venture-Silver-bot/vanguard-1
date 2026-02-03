import { Connection } from "@solana/web3.js";

export interface NetworkHealth {
    cluster: string;
    slot: number;
    tps: number;
    performance: string;
    isCongested: boolean;
}

export class IntegrityHeartbeat {
    private mainnet: Connection;
    private devnet: Connection;
    private tpsThreshold: number;

    constructor(
        mainnetRpc: string = "https://api.mainnet-beta.solana.com",
        devnetRpc: string = "https://api.devnet.solana.com",
        tpsThreshold: number = 1000
    ) {
        this.mainnet = new Connection(mainnetRpc);
        this.devnet = new Connection(devnetRpc);
        this.tpsThreshold = tpsThreshold;
    }

    /**
     * Checks health for a specific connection.
     */
    private async checkCluster(conn: Connection, label: string): Promise<NetworkHealth> {
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
        } catch (error: any) {
            return {
                cluster: label,
                slot: 0,
                tps: 0,
                performance: "UNREACHABLE",
                isCongested: true
            };
        }
    }

    async checkIntegrity(): Promise<{ mainnet: NetworkHealth, devnet: NetworkHealth }> {
        const [mainnetHealth, devnetHealth] = await Promise.all([
            this.checkCluster(this.mainnet, "Solana Mainnet"),
            this.checkCluster(this.devnet, "Solana Devnet")
        ]);

        return { mainnet: mainnetHealth, devnet: devnetHealth };
    }
}
