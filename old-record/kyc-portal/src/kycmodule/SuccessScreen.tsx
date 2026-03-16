import { useKYC } from "./context";

export const SuccessScreen = () => {
  const { module, verificationResult, reset } = useKYC();
  return (
    <div style={{ textAlign: "center", padding: "var(--space-2xl) var(--space-xl)" }}>
      <div style={{ fontSize: "64px", marginBottom: "var(--space-lg)" }}>✅</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--color-brand)", marginBottom: "var(--space-sm)" }}>Verification Submitted</h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-lg)", lineHeight: 1.6 }}>
        Submitted via <strong style={{ color: "var(--color-text-primary)" }}>{module.provider.toUpperCase()}</strong> for {module.label}<br />
        KYC Type: <strong style={{ color: "var(--color-text-primary)" }}>{module.kycType}</strong>
      </p>
      {verificationResult && (
        <div style={{ background: "var(--color-bg-input)", borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBottom: "var(--space-lg)", textAlign: "left" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "var(--space-sm)", fontWeight: 700 }}>Provider Response</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", fontSize: "13px" }}>
            <div style={{ color: "var(--color-text-muted)" }}>Transaction ID</div>
            <div style={{ color: "var(--color-brand)", fontFamily: "monospace" }}>{verificationResult.transactionId}</div>
            <div style={{ color: "var(--color-text-muted)" }}>Status</div>
            <div style={{ color: "var(--color-brand)", fontWeight: 700 }}>{verificationResult.status.toUpperCase()}</div>
            <div style={{ color: "var(--color-text-muted)" }}>Document</div>
            <div style={{ color: verificationResult.checks.document === "passed" ? "var(--color-brand)" : "var(--color-error)" }}>{verificationResult.checks.document}</div>
            <div style={{ color: "var(--color-text-muted)" }}>Liveness</div>
            <div style={{ color: verificationResult.checks.liveness === "passed" ? "var(--color-brand)" : "var(--color-error)" }}>{verificationResult.checks.liveness}</div>
            <div style={{ color: "var(--color-text-muted)" }}>Watchlist</div>
            <div style={{ color: verificationResult.checks.watchlist === "passed" ? "var(--color-brand)" : "var(--color-error)" }}>{verificationResult.checks.watchlist}</div>
          </div>
        </div>
      )}
      <button onClick={reset} style={{ padding: "12px var(--space-xl)", background: "var(--color-brand)", color: "var(--color-bg-app)", border: "none", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
        Start New Application
      </button>
    </div>
  );
};
