import { useKYC } from "./context";

export const StepIndicator = () => {
  const { steps, state } = useKYC();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, flexShrink: 0,
            background: i <= state.currentStep ? "var(--color-brand)" : "var(--color-bg-input)",
            color: i <= state.currentStep ? "var(--color-bg-app)" : "var(--color-text-muted)",
            boxShadow: i === state.currentStep ? "0 0 0 3px rgba(52,211,153,0.2)" : "none",
            transition: "all 0.3s",
          }}>
            {i < state.currentStep ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: "0 var(--space-xs)", background: i < state.currentStep ? "var(--color-brand)" : "var(--color-border)", transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
};
