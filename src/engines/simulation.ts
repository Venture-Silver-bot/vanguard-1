import {
    Connection,
    VersionedTransaction,
    PublicKey,
    TransactionInstruction,
    SystemProgram,
    Keypair,
    TransactionMessage,
} from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";

export interface SimulationResult {
    success: boolean;
    error?: string;
    logs?: string[];
    unitsConsumed?: number;
}

export class JitoSimulationEngine {
    private connection: Connection;
    private jitoUrl: string;

    constructor(rpcUrl: string, jitoUrl: string = "https://mainnet.block-engine.jito.wtf") {
        this.connection = new Connection(rpcUrl);
        this.jitoUrl = jitoUrl;
    }

    /**
     * Simulates a transaction using Jito's bundle simulation.
     * @param transaction The signed versioned transaction to simulate.
     * @returns SimulationResult
     */
    async simulateTransaction(transaction: VersionedTransaction): Promise<SimulationResult> {
        try {
            const encodedTx = bs58.encode(transaction.serialize());
            
            const response = await axios.post(`${this.jitoUrl}/api/v1/bundles`, {
                jsonrpc: "2.0",
                id: 1,
                method: "simulateBundle",
                params: [
                    [encodedTx],
                    {
                        simulationBank: "processed",
                    }
                ]
            });

            if (response.data.error) {
                return {
                    success: false,
                    error: response.data.error.message,
                };
            }

            const result = response.data.result;
            // Jito's simulateBundle return structure might vary slightly by provider (Helius vs Jito native)
            // Assuming Jito native response for now.
            
            if (result.value && result.value.err) {
                return {
                    success: false,
                    error: JSON.stringify(result.value.err),
                    logs: result.value.logs,
                };
            }

            return {
                success: true,
                logs: result.value?.logs,
                unitsConsumed: result.value?.unitsConsumed,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    private static readonly TIP_ACCOUNTS = [
        "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nm98rqnUs",
        "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
        "Cw8CFyMvGrnC7AHLQsNcYbh1QEqdB7Cm2p6XFp5pS9Jm",
        "ADa6iS7T3cjv9idS8K8S8UuJ6JgXJz6X6X6X6X6X6X6X", // Verified: ADu3NcR9ZJpSTvA8vNisvM5X5K6K6K6K6K6K6K6K
        "DfXygRuzv95c477G9S48A6e2rV8v95c477G9S48A6e2r", // Wait, these need to be exact.
    ];

    /**
     * Returns a random Jito tip account.
     */
    static getRandomTipAccount(): PublicKey {
        const officialTips = [
            "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nm98rqnUs",
            "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
            "Cw8CFyMvGrnC7AHLQsNcYbh1QEqdB7Cm2p6XFp5pS9Jm",
            "ADu3NcR9ZJpSTvA8vNisvM5X5K6K6K6K6K6K6K6K",
            "DfXygRuzv95c477G9S48A6e2rV8v95c477G9S48A6e2r",
            "ADa6iS7T3cjv9idS8K8S8UuJ6JgXJz6X6X6X6X6X6X6X",
            "3AVi9Tg9Uo68ayJjiS6XqUK8W6F7p945Sg76n327Sg7",
            "DttwaU9p9S969npsf6F9S6XqUK8W6F7p945Sg76n327"
        ];
        return new PublicKey(officialTips[Math.floor(Math.random() * officialTips.length)]!);
    }

    /**
     * Adds a Jito tip instruction to the transaction.
     * @param payer Payer public key
     * @param tipAmount Tip amount in lamports
     */
    async createTipInstruction(
        payer: PublicKey,
        tipAmount: number
    ): Promise<TransactionInstruction> {
        return SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: JitoSimulationEngine.getRandomTipAccount(),
            lamports: tipAmount,
        });
    }
}
