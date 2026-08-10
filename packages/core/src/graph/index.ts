import { ScannerService } from "../services/scanner";
import { scoreRisk } from "./nodes/score";
import { decide } from "./nodes/decide";
import { BantayConfig } from "../services/config";

export async function buildGraph(config: BantayConfig) {
  return {
    invoke: async (input: {
      diff: string;
      approved: null;
      secrets?: Record<string, string>;
      local?: boolean;
    }) => {
      const scanner = new ScannerService(config);
      const findings = await scanner.scanDiff(input.diff);

      const riskAssessment = await scoreRisk({
        findings,
        secrets: input.secrets,
        local: input.local,
      });
      const decision = await decide({ findings, riskAssessment, approved: null });
      return { findings, riskAssessment, ...decision };
    },
  };
}
