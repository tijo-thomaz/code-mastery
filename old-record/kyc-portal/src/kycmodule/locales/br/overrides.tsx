import type { FieldComponentProps, TextFieldConfig } from "../../../formlib/types";
import type { ModuleUIOverrides } from "../../../kyclib/module";

// Brazil-specific: CPF field with auto-formatting mask
const CPFField = ({ field, value, error, onChange }: FieldComponentProps<TextFieldConfig>) => {
  const formatCPF = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-label)", marginBottom: "var(--space-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {field.label}
        {field.required && <span style={{ color: "var(--color-brand)", marginLeft: 2 }}>*</span>}
      </label>
      <input
        type="text" value={value || ""} placeholder="000.000.000-00"
        onChange={(e) => onChange(field.name, formatCPF(e.target.value))}
        maxLength={14}
        aria-label={field.label}
        style={{
          width: "100%", boxSizing: "border-box", padding: "12px var(--space-md)",
          background: "var(--color-bg-input)",
          border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)",
          fontSize: "14px", fontFamily: "var(--font-body)", outline: "none",
          letterSpacing: "0.1em",
        }}
      />
      {error && <span role="alert" style={{ fontSize: "11px", color: "var(--color-error)", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
};

// Brazil shows EDD warning
const DocumentosFooter = () => (
  <div style={{ marginTop: "var(--space-md)", padding: "var(--space-sm) var(--space-md)", background: "rgba(251,191,36,0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(251,191,36,0.15)" }}>
    <p style={{ color: "var(--color-warning)", fontSize: "11px", margin: 0 }}>
      ⚠️ Enhanced Due Diligence (EDD) — documentos devem estar válidos e legíveis.
    </p>
  </div>
);

export const brOverrides: ModuleUIOverrides = {
  fieldNameOverrides: {
    cpf: CPFField,
  },
  StepFooter: {
    Documentos: DocumentosFooter,
  },
};
