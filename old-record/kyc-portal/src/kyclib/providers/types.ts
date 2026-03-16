export interface ProviderResult {
  status: "approved" | "rejected" | "pending";
  transactionId: string;
  provider: string;
  timestamp: string;
  checks: { document: "passed" | "failed"; liveness: "passed" | "failed"; watchlist: "passed" | "failed"; };
}

export interface KYCProviderAdapter {
  name: string;
  color: string;
  submitVerification(formData: Record<string, string>): Promise<ProviderResult>;
}
