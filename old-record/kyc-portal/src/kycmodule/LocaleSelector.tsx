import { useKYC } from "./context";
import { availableLocales } from "./locales/registry";

export const LocaleSelector = () => {
  const { state, setLocale } = useKYC();
  return (
    <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
      {availableLocales.map(({ key, label }) => (
        <button key={key} onClick={() => setLocale(key)}
          style={{
            padding: "8px var(--space-md)", borderRadius: "var(--radius-sm)", fontSize: "13px",
            cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, transition: "all 0.2s",
            background: state.locale === key ? "var(--color-brand)" : "var(--color-bg-input)",
            color: state.locale === key ? "var(--color-bg-app)" : "var(--color-text-muted)",
            border: `1px solid ${state.locale === key ? "var(--color-brand)" : "var(--color-border)"}`,
          }}
        >{label}</button>
      ))}
    </div>
  );
};
