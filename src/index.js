import { JitoSimulationEngine } from "./engines/simulation.js";
import { SlippageSentinel } from "./engines/slippage.js";
import { IntegrityHeartbeat } from "./heartbeat/integrity.js";
import * as dotenv from "dotenv";
dotenv.config();
async function runVanguardProtocol() {
    console.log("🔱 Vanguard-1: Senior Risk Engineer Persona Engaged");
    const simulation = new JitoSimulationEngine(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", process.env.JITO_BLOCK_ENGINE_URL || "https://mainnet.block-engine.jito.wtf");
    const slippage = new SlippageSentinel(0.5); // 0.5% limit
    const heartbeat = new IntegrityHeartbeat();
    console.log("\n[1/3] Running Integrity Heartbeat...");
    const health = await heartbeat.checkIntegrity();
    console.table(health);
    if (health.mainnet.isCongested) {
        console.warn("⚠️ WARNING: Mainnet congestion detected. Risk levels elevated.");
    }
    // Example Slippage Check
    console.log("\n[2/3] Checking Slippage for propose trade: SOL -> USDC (1 SOL)...");
    const solMint = "So11111111111111111111111111111111111111112";
    const usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const amount = "1000000000"; // 1 SOL
    try {
        const profile = await slippage.checkPriceImpact(solMint, usdcMint, amount);
        console.log(`Price Impact: ${profile.priceImpactPct}%`);
        if (!profile.isSafe) {
            console.error("🛑 ABORT: Price impact exceeds 0.5% ceiling.");
        }
        else {
            console.log("✅ Trade safety verified.");
        }
    }
    catch (e) {
        console.error(`Slippage Check Error: ${e.message}`);
    }
    console.log("\n[3/3] Atomic Abort Logic (Ready for Transaction Integration)");
    console.log("Protocol initialized. Standing by for transaction signing.");
}
runVanguardProtocol().catch(console.error);
//# sourceMappingURL=index.js.map