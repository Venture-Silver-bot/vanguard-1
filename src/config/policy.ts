import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RiskPolicy {
  slippage_tolerance_bps: number;
  jito_tip_mode: 'Dynamic' | 'Static';
  jito_tip_cap_lamports: number;
  evidence_logging_level: 'Strict' | 'Minimal';
}

const POLICY_PATH = path.resolve(__dirname, '../../config/policy.json');

export class PolicyController {
  private currentPolicy: RiskPolicy;

  constructor() {
    this.currentPolicy = this.loadPolicy();
  }

  private loadPolicy(): RiskPolicy {
    try {
      const data = fs.readFileSync(POLICY_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load risk policy, falling back to safe defaults:', error);
      return {
        slippage_tolerance_bps: 50,
        jito_tip_mode: 'Static',
        jito_tip_cap_lamports: 10000,
        evidence_logging_level: 'Strict',
      };
    }
  }

  public getPolicy(): RiskPolicy {
    this.currentPolicy = this.loadPolicy();
    return this.currentPolicy;
  }
}
