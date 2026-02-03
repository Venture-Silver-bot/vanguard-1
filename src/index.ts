import { VanguardAgent } from "./agent.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

async function runVanguardProtocol() {
    console.log("🔱 Vanguard-1: Senior Risk Engineer Persona Engaged");

    if (!process.env.SOLANA_PRIVATE_KEY) {
        console.error("❌ Error: SOLANA_PRIVATE_KEY not set in .env");
        process.exit(1);
    }

    const kit = new SolanaAgentKit(
        process.env.SOLANA_PRIVATE_KEY,
        process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
        process.env.OPENAI_API_KEY || "na"
    );

    const agent = new VanguardAgent(
        kit,
        process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
        process.env.JITO_BLOCK_ENGINE_URL || "https://mainnet.block-engine.jito.wtf"
    );

    console.log("\n[Vanguard-1] Simulation: Enforcing Slippage Sentinel on trade...");
    
    // SOL -> USDC (High liquidity, should pass)
    const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    try {
        console.log("Pre-flight risk assessment initiated...");
        
        // This will simulate the logic without actually sending if we want to test,
        // but since we are using the 'trade' wrapper, it would attempt execution.
        // For the demo/hackathon, we want to show it BLOCKING a bad trade.
        
        // Let's mock a high impact trade check first
        const profile = await (agent as any).slippage.checkPriceImpact(
            "So11111111111111111111111111111111111111112",
            usdcMint.toBase58(),
            "1000000000000" // 1,000 SOL (might have impact depending on pool)
        );
        
        console.log(`Simulated 1000 SOL Trade Price Impact: ${profile.priceImpactPct}%`);
        if (!profile.isSafe) {
            console.log("🛑 SENTINEL: Blocked trade due to price impact violation.");
        }

        console.log("\n[Vanguard-1] Integrity Check:");
        const health = await (agent as any).heartbeat.checkIntegrity();
        console.log(`Cluster Status: ${health.mainnet.status} (TPS: ${health.mainnet.tps})`);

        console.log("\nProtocol operational. Senior Risk Engineer standing by.");

    } catch (e: any) {
        console.error(`Vanguard Enforcer Error: ${e.message}`);
    }
}

runVanguardProtocol().catch(console.error);
