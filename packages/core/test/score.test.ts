import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scoreRisk, scoreLocal } from "../src/graph/nodes/score";
import axios from "axios";

vi.mock("axios");
vi.mock("../src/services/secrets", () => ({
  loadSecrets: vi.fn().mockResolvedValue({ BANTAY_LLM_API_KEY: "fake-key" }),
}));

describe("scoreLocal", () => {
  it("returns low when empty", () => {
    expect(scoreLocal([]).tier).toBe("low");
  });

  it("returns high when any finding is high", () => {
    const result = scoreLocal([
      { riskTier: "medium", type: "x" },
      { riskTier: "high", type: "AWS Access Key" },
    ]);
    expect(result.tier).toBe("high");
  });

  it("returns medium when highest is medium", () => {
    expect(scoreLocal([{ riskTier: "medium", type: "Sensitive Filename" }]).tier).toBe("medium");
  });
});

describe("scoreRisk node", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BANTAY_LLM_BASE_URL = "https://api.openai.com/v1";
    process.env.BANTAY_LLM_MODEL = "gpt-4-turbo";
    delete process.env.BANTAY_LOCAL;
  });

  afterEach(() => {
    delete process.env.BANTAY_LOCAL;
  });

  it("should return low risk if no findings", async () => {
    const state = { findings: [] };
    const result = await scoreRisk(state);
    expect(result.tier).toBe("low");
  });

  it("should use local scoring when local flag is set", async () => {
    const state = {
      local: true,
      findings: [
        {
          type: "AWS Access Key",
          file: "leak.env",
          line_number: 1,
          value: "AKIA***",
          riskTier: "high",
        },
      ],
    };
    const result = await scoreRisk(state);
    expect(result.tier).toBe("high");
    expect(result.reason).toContain("Local gate");
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("should call LLM and return parsed risk assessment", async () => {
    const state = {
      findings: [{ type: "API Key", file: "index.js", line_number: 1, value: "sk-***" }],
    };

    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                tier: "high",
                reason: "Found Anthropic API Key",
                suggestion: "Revoke and rotate",
              }),
            },
          },
        ],
      },
    };

    (axios.post as any).mockResolvedValue(mockResponse);

    const result = await scoreRisk(state);
    expect(result.tier).toBe("high");
    expect(result.reason).toContain("Found Anthropic API Key");
  });

  it("should fail-closed to high risk if LLM call fails", async () => {
    const state = { findings: [{ type: "Secret" }] };
    (axios.post as any).mockRejectedValue(new Error("Network Error"));

    const result = await scoreRisk(state);
    expect(result.tier).toBe("high");
    expect(result.reason).toContain("Risk assessment failed");
  });
});
