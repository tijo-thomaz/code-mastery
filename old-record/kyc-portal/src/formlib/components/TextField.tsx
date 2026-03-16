import type { FieldComponentProps, TextFieldConfig } from "../types";

export const TextField = ({ field, value, error, onChange }: FieldComponentProps<TextFieldConfig>) => (
  <div style={{ marginBottom: "var(--space-md)" }}>
    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-label)", marginBottom: "var(--space-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {field.label}{field.required && <span style={{ color: "var(--color-brand)", marginLeft: 2 }}>*</span>}
    </label>
    <input type="text" value={value || ""} maxLength={field.maxLength}
      placeholder={field.pattern ? `Format: ${field.pattern}` : ""}
      onChange={(e) => onChange(field.name, e.target.value)} aria-label={field.label}
      style={{ width: "100%", boxSizing: "border-box", padding: "12px var(--space-md)", background: "var(--color-bg-input)", border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`, borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)", fontSize: "14px", fontFamily: "var(--font-body)", outline: "none" }}
    />
    {error && <span role="alert" style={{ fontSize: "11px", color: "var(--color-error)", marginTop: 4, display: "block" }}>{error}</span>}
  </div>
);
