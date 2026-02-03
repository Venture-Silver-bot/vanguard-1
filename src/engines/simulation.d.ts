import { VersionedTransaction, PublicKey, TransactionInstruction } from "@solana/web3.js";
export interface SimulationResult {
    success: boolean;
    error?: string;
    logs?: string[];
    unitsConsumed?: number;
}
export declare class JitoSimulationEngine {
    private connection;
    private jitoUrl;
    constructor(rpcUrl: string, jitoUrl?: string);
    /**
     * Simulates a transaction using Jito's bundle simulation.
     * @param transaction The signed versioned transaction to simulate.
     * @returns SimulationResult
     */
    simulateTransaction(transaction: VersionedTransaction): Promise<SimulationResult>;
    /**
     * Adds a Jito tip instruction to the transaction.
     * @param instructions Existing instructions
     * @param payer Payer public key
     * @param tipAmount Tip amount in lamports
     * @param tipAccount Jito tip account
     */
    createTipInstruction(payer: PublicKey, tipAmount: number, tipAccount?: string): Promise<TransactionInstruction>;
}
//# sourceMappingURL=simulation.d.ts.map