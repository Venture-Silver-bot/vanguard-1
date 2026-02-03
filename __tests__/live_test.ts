import { SlippageSentinel } from '../src/engines/slippage';

async function main() {
  console.log('🔱 Vanguard-1 Live Integration Test\n');
  console.log('=================================\n');

  const sentinel = new SlippageSentinel();
  
  // Test Case: SOL to USDC (Real Market)
  console.log('🧪 Test Case: Buying 1 SOL -> USDC');
  const result = await sentinel.validateTrade(
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    1000000000 // 1 SOL (1 billion lamports)
  );

  console.log(`Input Amount: ${result.inputAmount} lamports`);
  console.log(`Output Amount: ${result.outputAmount} USDC`);
  console.log(`Price Impact: ${result.impactBps} bps`);
  console.log(`Policy Limit: ${result.policyLimitBps} bps`);
  
  if (result.approved) {
    console.log('\n✅ STATUS: TRADE APPROVED');
  } else {
    console.log(`\n❌ STATUS: TRADE BLOCKED`);
    console.log(`Reason: ${result.reason}`);
  }

  console.log('\n=================================\nTest Complete.');
}

main().catch(console.error);
