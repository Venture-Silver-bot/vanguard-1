import axios from 'axios';
import { SlippageSentinel, SlippageCheckResult } from '../src/engines/slippage';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SlippageSentinel', () => {
  let sentinel: SlippageSentinel;

  beforeAll(() => {
    sentinel = new SlippageSentinel();
  });

  it('should APPROVE a trade with low price impact (Clean Trade)', async () => {
    // Mock Jupiter API response for a clean trade
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        inAmount: '1000000',
        outAmount: '2400000', // 1 SOL ~ 240 USDC
        priceImpactPct: '0.001', // 0.01%
        routePlan: []
      }
    });

    const result = await sentinel.validateTrade(
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      1000000 // 1 SOL in lamports
    );

    expect(result.approved).toBe(true);
    expect(result.impactBps).toBe(0); // 0.001% rounds to 0 bps
    expect(result.reason).toBeUndefined();
  });

  it('should REJECT a trade with high price impact (Rogue Trade)', async () => {
    // Mock Jupiter API response for a bad trade
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        inAmount: '1000000',
        outAmount: '100000', // Massive slippage
        priceImpactPct: '0.90', // 90% impact!
        routePlan: []
      }
    });

    const result = await sentinel.validateTrade(
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      1000000
    );

    expect(result.approved).toBe(false);
    expect(result.impactBps).toBe(9000); // 90% = 9000 bps
    expect(result.reason).toContain('exceeds policy limit');
  });

  it('should FAIL CLOSED on API error (Safety First)', async () => {
    // Mock API failure
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const result = await sentinel.validateTrade(
      'So11111111111111111111111111111111111111112',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      1000000
    );

    expect(result.approved).toBe(false);
    expect(result.reason).toContain('API Error');
  });
});
