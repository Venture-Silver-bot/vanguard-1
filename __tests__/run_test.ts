import axios from 'axios';
import { SlippageSentinel } from '../src/engines/slippage';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock Axios
const originalGet = axios.get;
const mockResponses: any[] = [];

// Simple test runner
async function runTests() {
  console.log('🔱 Running Slippage Sentinel Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Clean Trade
  try {
    // Mock setup
    (axios.get as any) = jest.fnMock(() => Promise.resolve({
      data: {
        inAmount: '1000000',
        outAmount: '2400000',
        priceImpactPct: '0.001',
        routePlan: []
      }
    }));

    const sentinel = new SlippageSentinel();
    const result = await sentinel.validateTrade('So1', 'EPj2', 1000000);

    if (result.approved && result.impactBps === 0) {
      console.log('✅ Test 1 PASSED: Clean Trade Approved');
      passed++;
    } else {
      console.log(`❌ Test 1 FAILED: Expected approved=true, got ${result.approved}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ Test 1 ERROR: ${e}`);
    failed++;
  }

  // Test 2: High Slippage
  try {
    (axios.get as any) = jest.fnMock(() => Promise.resolve({
      data: {
        inAmount: '1000000',
        outAmount: '100000',
        priceImpactPct: '0.90',
        routePlan: []
      }
    }));

    const sentinel = new SlippageSentinel();
    const result = await sentinel.validateTrade('So1', 'EPj2', 1000000);

    if (!result.approved && result.reason?.includes('exceeds policy limit')) {
      console.log('✅ Test 2 PASSED: High Slippage Rejected');
      passed++;
    } else {
      console.log(`❌ Test 2 FAILED: Expected rejection, got ${result.approved}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ Test 2 ERROR: ${e}`);
    failed++;
  }

  console.log(`\n🔱 Test Summary: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
