import { KYCProvider, useKYC } from "./kycmodule/context";
import { FormEngine } from "./kycmodule/FormEngine";
import { StepIndicator } from "./kycmodule/StepIndicator";
import { LocaleSelector } from "./kycmodule/LocaleSelector";
import { SuccessScreen } from "./kycmodule/SuccessScreen";
import { cssVars, theme } from "./formlib/tokens";

const LoadingScreen = ({ message }: { message: string }) => (
  <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
    <div style={{ fontSize: "40px", marginBottom: "var(--space-lg)", animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</div>
    <p style={{ color: "var(--color-text-muted)" }}>{message}</p>
  </div>
);

const KYCPortalInner = () => {
  const { state, module, providerAdapter, steps, currentStepName, isLastStep, nextStep, prevStep } = useKYC();

  if (state.status === "loading") return <LoadingScreen message="Preparing submission..." />;
  if (state.status === "verifying") return <LoadingScreen message={`Verifying with ${providerAdapter.name}...`} />;
  if (state.status === "success") {
    const LocaleSuccess = module.uiOverrides.SuccessScreen;
    return LocaleSuccess ? <LocaleSuccess /> : <SuccessScreen />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-app)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-lg)", fontFamily: "var(--font-body)" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Header */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "var(--color-text-primary)", margin: 0 }}>
              KYC<span style={{ color: "var(--color-brand)" }}>Verify</span>
            </h1>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "11px", fontWeight: 700, background: providerAdapter.color, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {providerAdapter.name}
            </span>
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "13px", margin: "0 0 var(--space-lg)" }}>{module.kycType} · {module.label}</p>
          <LocaleSelector />
        </div>

        {/* Card */}
        <div style={{ background: "var(--color-bg-card)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", border: "1px solid var(--color-border)", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}>
          <StepIndicator />
          {module.uiOverrides.StepHeader ? (
            <module.uiOverrides.StepHeader stepName={currentStepName} stepIndex={state.currentStep} totalSteps={steps.length} />
          ) : (
            <div style={{ marginBottom: "var(--space-lg)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--color-text-primary)", margin: "0 0 var(--space-xs)" }}>{currentStepName}</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "13px", margin: 0 }}>Step {state.currentStep + 1} of {steps.length}</p>
            </div>
          )}

          <FormEngine />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-lg)", gap: "var(--space-sm)" }}>
            {state.currentStep > 0 && (
              <button onClick={prevStep} style={{ padding: "12px var(--space-lg)", background: "transparent", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "14px", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                ← Back
              </button>
            )}
            <button onClick={nextStep} style={{ padding: "12px var(--space-xl)", background: "var(--color-brand)", color: "var(--color-bg-app)", border: "none", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", marginLeft: "auto" }}>
              {isLastStep ? "Submit Verification →" : "Continue →"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)", padding: "var(--space-md)", background: "rgba(52,211,153,0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(52,211,153,0.1)" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "11px", margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: "var(--color-brand)" }}>Architecture:</strong> 3-layer (formlib → kyclib → kycmodule) ·
            Module extends per locale · Config-driven field registry · Onfido/Jumio provider adapters ·
            Liveness face check · useReducer state machine · TypeScript discriminated unions
          </p>
        </div>
      </div>

      <style>{`
        :root { ${cssVars(theme)} }
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0% } to { width: 100% } }
        select option { background: var(--color-bg-input); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <KYCProvider>
      <KYCPortalInner />
    </KYCProvider>
  );
}
