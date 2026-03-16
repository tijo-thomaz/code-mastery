import type { KYCProviderAdapter, ProviderResult } from "./types";

export const jumioAdapter: KYCProviderAdapter = {
  name: "Jumio",
  color: "#0891b2",
  async submitVerification(formData): Promise<ProviderResult> {
    await new Promise((r) => setTimeout(r, 2500));
    return {
      status: "approved",
      transactionId: `JUM-${Date.now().toString(36).toUpperCase()}`,
      provider: "jumio",
      timestamp: new Date().toISOString(),
      checks: { document: "passed", liveness: formData.faceCheck === "passed" ? "passed" : "failed", watchlist: "passed" },
    };
  },
};
