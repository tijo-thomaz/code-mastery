import type { FieldComponentProps, FileFieldConfig } from "../types";

export const FileField = ({ field, value, error, onChange }: FieldComponentProps<FileFieldConfig>) => (
  <div style={{ marginBottom: "var(--space-md)" }}>
    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-label)", marginBottom: "var(--space-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {field.label}{field.required && <span style={{ color: "var(--color-brand)", marginLeft: 2 }}>*</span>}
    </label>
    <label htmlFor={`file-${field.name}`}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-lg)", borderRadius: "var(--radius-md)", cursor: "pointer", border: `2px dashed ${error ? "var(--color-error)" : value ? "var(--color-brand)" : "var(--color-border)"}`, background: value ? "rgba(52,211,153,0.05)" : "transparent" }}
    >
      <div style={{ fontSize: "24px", marginBottom: "var(--space-xs)" }}>{value ? "✅" : "📄"}</div>
      <div style={{ fontSize: "13px", color: value ? "var(--color-brand)" : "var(--color-text-muted)" }}>
        {value || `Drop file or click · ${field.accept.join(", ")} · max ${field.maxSizeMB}MB`}
      </div>
      <input id={`file-${field.name}`} type="file" accept={field.accept.map((a) => `.${a}`).join(",")}
        style={{ display: "none" }} onChange={(e) => onChange(field.name, e.target.files?.[0]?.name || "")} aria-label={field.label}
      />
    </label>
    {error && <span role="alert" style={{ fontSize: "11px", color: "var(--color-error)", marginTop: 4, display: "block" }}>{error}</span>}
  </div>
);
