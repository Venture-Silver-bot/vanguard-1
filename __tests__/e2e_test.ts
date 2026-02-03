import { VanguardProtocol } from '../src/vanguard';

async function main() {
  console.log('🔱 Vanguard-1 End-to-End Integration Test\n');
  console.log('=========================================\n');

  const vanguard = new VanguardProtocol();

  // Test Case: Rogue Agent Proposal (High Slippage)
  console.log('🧪 Test Case: Rogue Agent Proposal');
  console.log('Action: Attempting trade with extreme slippage...\n');

  const result = await vanguard.validateProposal(
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    1000000 // 1 SOL
  );

  console.log(`Timestamp: ${result.timestamp}`);
  console.log(`Checks: Slippage=${result.checks.slippage}, Simulation=${result.checks.simulation}`);
  
  if (result.approved) {
    console.log('\n✅ STATUS: APPROVED (Unexpected!)');
  } else {
    console.log('\n❌ STATUS: BLOCKED');
    console.log(`Reason: ${result.reason}`);
  }

  console.log('\n=========================================\nIntegration Test Complete.');
}

main().catch(console.error);