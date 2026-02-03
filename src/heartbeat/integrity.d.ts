export interface NetworkHealth {
    cluster: string;
    slot: number;
    tps: number;
    performance: string;
    isCongested: boolean;
}
export declare class IntegrityHeartbeat {
    private mainnet;
    private devnet;
    private tpsThreshold;
    constructor(mainnetRpc?: string, devnetRpc?: string, tpsThreshold?: number);
    /**
     * Checks health for a specific connection.
     */
    private checkCluster;
    checkIntegrity(): Promise<{
        mainnet: NetworkHealth;
        devnet: NetworkHealth;
    }>;
}
//# sourceMappingURL=integrity.d.ts.map