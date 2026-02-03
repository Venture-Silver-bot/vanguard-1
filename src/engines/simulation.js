import { Connection, VersionedTransaction, PublicKey, TransactionInstruction, SystemProgram, Keypair, TransactionMessage, } from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
export class JitoSimulationEngine {
    connection;
    jitoUrl;
    constructor(rpcUrl, jitoUrl = "https://mainnet.block-engine.jito.wtf") {
        this.connection = new Connection(rpcUrl);
        this.jitoUrl = jitoUrl;
    }
    /**
     * Simulates a transaction using Jito's bundle simulation.
     * @param transaction The signed versioned transaction to simulate.
     * @returns SimulationResult
     */
    async simulateTransaction(transaction) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    /**
     * Adds a Jito tip instruction to the transaction.
     * @param instructions Existing instructions
     * @param payer Payer public key
     * @param tipAmount Tip amount in lamports
     * @param tipAccount Jito tip account
     */
    async createTipInstruction(payer, tipAmount, tipAccount = "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nm98rqnUs" // One of Jito's tip accounts
    ) {
        return SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: new PublicKey(tipAccount),
            lamports: tipAmount,
        });
    }
}
//# sourceMappingURL=simulation.js.map