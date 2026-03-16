import { useState } from "react";
import type { FieldComponentProps, TextFieldConfig } from "../../../formlib/types";
import type { ModuleUIOverrides } from "../../../kyclib/module";

// UK-specific: Postcode field with address lookup button
const PostcodeLookup = ({ field, value, error, onChange }: FieldComponentProps<TextFieldConfig>) => {
  const [looking, setLooking] = useState(false);

  const lookup = () => {
    setLooking(true);
    // DEMO: simulates Royal Mail postcode API
    setTimeout(() => {
      setLooking(false);
      onChange("addressLine1", "10 Downing Street");
      onChange(field.name, value || "");
    }, 1000);
  };

  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-label)", marginBottom: "var(--space-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {field.label}
        {field.required && <span style={{ color: "var(--color-brand)", marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
        <input
          type="text" value={value || ""} placeholder="e.g. SW1A 1AA"
          onChange={(e) => onChange(field.name, e.target.value.toUpperCase())}
          aria-label={field.label}
          style={{
            flex: 1, padding: "12px var(--space-md)", background: "var(--color-bg-input)",
            border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
            borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)",
            fontSize: "14px", fontFamily: "var(--font-body)", outline: "none",
          }}
        />
        <button
          onClick={lookup} disabled={!value || looking}
          style={{
            padding: "12px var(--space-md)", background: "var(--color-brand)", color: "var(--color-bg-app)",
            border: "none", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 700,
            cursor: value && !looking ? "pointer" : "not-allowed", opacity: value && !looking ? 1 : 0.5,
            fontFamily: "var(--font-body)", whiteSpace: "nowrap",
          }}
        >
          {looking ? "Looking..." : "🔍 Find Address"}
        </button>
      </div>
      {error && <span role="alert" style={{ fontSize: "11px", color: "var(--color-error)", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
};

// UK address step shows a helper note
const AddressFooter = () => (
  <div style={{ marginTop: "var(--space-md)", padding: "var(--space-sm) var(--space-md)", background: "rgba(96,165,250,0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(96,165,250,0.15)" }}>
    <p style={{ color: "var(--color-info)", fontSize: "11px", margin: 0 }}>
      💡 Enter your postcode and click "Find Address" to auto-fill from Royal Mail.
    </p>
  </div>
);

export const ukOverrides: ModuleUIOverrides = {
  fieldNameOverrides: {
    postcode: PostcodeLookup,
  },
  StepFooter: {
    Address: AddressFooter,
  },
};
