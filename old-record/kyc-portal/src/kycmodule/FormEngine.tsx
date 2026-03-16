import { useKYC } from "./context";
import { FIELD_REGISTRY } from "../formlib/registry";

export const FormEngine = () => {
  const { fields, state, setField, module, currentStepName } = useKYC();
  const overrides = module.uiOverrides;

  return (
    <div>
      {fields.map((field) => {
        // Priority: 1. field name override → 2. field type override → 3. default registry
        const Component =
          overrides.fieldNameOverrides?.[field.name] ??
          overrides.fieldOverrides?.[field.type] ??
          FIELD_REGISTRY[field.type];

        if (!Component) return <div key={field.name} style={{ color: "var(--color-error)" }}>Unknown: {field.type}</div>;
        return <Component key={field.name} field={field as any} value={state.formData[field.name] || ""} error={state.errors[field.name] || null} onChange={setField} />;
      })}

      {/* Locale can inject extra UI below the form per step */}
      {overrides.StepFooter?.[currentStepName] && (() => {
        const Footer = overrides.StepFooter![currentStepName];
        return <Footer />;
      })()}
    </div>
  );
};
