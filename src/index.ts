import { JitoSimulationEngine } from "./engines/simulation.js";
import { SlippageSentinel } from "./engines/slippage.js";
import { IntegrityHeartbeat } from "./heartbeat/integrity.js";
import { EvidenceBundler, type EvidenceInput } from "./engines/evidence.js";
import * as dotenv from "dotenv";

dotenv.config();

async function runVanguardProtocol() {
    console.log("🔱 Vanguard-1: Senior Risk Engineer Persona Engaged");
    
    const simulation = new JitoSimulationEngine(
        process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
        process.env.JITO_BLOCK_ENGINE_URL || "https://mainnet.block-engine.jito.wtf"
    );

    const slippage = new SlippageSentinel(0.5); // 0.5% limit
    const heartbeat = new IntegrityHeartbeat();
    const bundler = new EvidenceBundler();

    console.log("\n[1/4] Running Integrity Heartbeat...");
    const health = await heartbeat.checkIntegrity();
    console.table(health);

    if (health.mainnet.isCongested) {
        console.warn("⚠️ WARNING: Mainnet congestion detected. Risk levels elevated.");
    }

    // Example Slippage Check
    console.log("\n[2/4] Checking Slippage for proposed trade: SOL -> USDC (1 SOL)...");
    const solMint = "So11111111111111111111111111111111111111112";
    const usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const amount = "1000000000"; // 1 SOL

    let profile;
    try {
        profile = await slippage.checkPriceImpact(solMint, usdcMint, amount);
        console.log(`Price Impact: ${profile.priceImpactPct}%`);
        if (!profile.isSafe) {
            console.error("🛑 ABORT: Price impact exceeds 0.5% ceiling.");
        } else {
            console.log("✅ Trade safety verified.");
        }
    } catch (e: any) {
        console.error(`Slippage Check Error: ${e.message}`);
    }

    console.log("\n[3/4] Evidence Bundling Example...");
    const mockLogicBlock = {
        id: "LB-SOL-SWAP-001",
        version: "1.0.0",
        hash: "sha256:e3fa56...",
        metadata: { owner: "Luke_Risk_01" }
    };
    
    const mockInputs: EvidenceInput[] = [
        {
            name: "amount",
            value: 1.0,
            citation: {
                source: "user_request",
                location: "chat_msg_123",
                rawString: "swap 1 sol to usdc"
            }
        }
    ];

    const bundle = bundler.createBundle(
        mockLogicBlock,
        mockInputs,
        { decision: "APPROVED", rate: 0.055 },
        "sig_bae22c5468",
        "Trade pre-validated against Slippage Sentinel (0.42% impact)."
    );

    console.log("Generated Evidence Bundle:");
    console.log(JSON.stringify(bundle, null, 2));

    console.log("\n[4/4] Atomic Abort Logic (Ready for Transaction Integration)");
    console.log("Protocol operational. Senior Risk Engineer standing by.");
}

runVanguardProtocol().catch(console.error);
