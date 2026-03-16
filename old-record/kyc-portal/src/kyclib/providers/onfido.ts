import type { KYCProviderAdapter, ProviderResult } from "./types";

export const onfidoAdapter: KYCProviderAdapter = {
  name: "Onfido",
  color: "#4f46e5",
  async submitVerification(formData): Promise<ProviderResult> {
    await new Promise((r) => setTimeout(r, 2000));
    return {
      status: "approved",
      transactionId: `ONF-${Date.now().toString(36).toUpperCase()}`,
      provider: "onfido",
      timestamp: new Date().toISOString(),
      checks: { document: "passed", liveness: formData.faceCheck === "passed" ? "passed" : "failed", watchlist: "passed" },
    };
  },
};
