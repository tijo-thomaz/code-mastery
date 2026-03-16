import type { ComponentType } from "react";
import type { LocaleConfig, KYCProvider, KYCType } from "./types";
import type { FieldConfig, FieldComponentProps, FieldValidator } from "../formlib/types";

// UI overrides a locale can provide
export interface ModuleUIOverrides {
  // Override specific field components (e.g. BR wants a custom CPF input with mask)
  fieldOverrides?: Partial<Record<FieldConfig["type"], ComponentType<FieldComponentProps<any>>>>;
  // Override individual field by name (e.g. UK wants a postcode lookup for "postcode" field)
  fieldNameOverrides?: Record<string, ComponentType<FieldComponentProps<any>>>;
  // Override the step header per step name
  StepHeader?: ComponentType<{ stepName: string; stepIndex: number; totalSteps: number }>;
  // Override the success screen
  SuccessScreen?: ComponentType;
  // Extra UI rendered below the form on a specific step
  StepFooter?: Record<string, ComponentType>;
}

// Validation overrides a locale can provide
export interface ModuleValidationOverrides {
  // Extra validators applied to all fields of a given type
  fieldTypeValidators?: Partial<Record<FieldConfig["type"], FieldValidator[]>>;
  // Extra validators applied to a specific field by name
  fieldNameValidators?: Record<string, FieldValidator[]>;
}

export abstract class KYCModule {
  abstract locale: string;
  abstract label: string;
  abstract provider: KYCProvider;
  abstract kycType: KYCType;
  abstract steps: string[];
  abstract fields: Record<string, FieldConfig[]>;

  // Locale can override UI — defaults to empty (use base UI)
  uiOverrides: ModuleUIOverrides = {};
  // Locale can override validation — defaults to empty (use built-in validators)
  validationOverrides: ModuleValidationOverrides = {};

  getConfig(): LocaleConfig {
    return {
      locale: this.locale, label: this.label, provider: this.provider,
      kycType: this.kycType, steps: this.steps, fields: this.fields,
    };
  }

  // Built-in validators per field type — subclass can override to replace defaults
  protected validateByType(value: string | undefined, field: FieldConfig): string | null {
    if (field.type === "text" && field.pattern && value) {
      if (!new RegExp(`^${field.pattern}$`).test(value)) return "Invalid format";
    }
    if (field.type === "date" && field.minAge && value) {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < field.minAge) return `Must be at least ${field.minAge}`;
    }
    if (field.type === "liveness" && value !== "passed") return "Face verification required";
    return null;
  }

  // Validation pipeline: required → built-in type → field.validators → type overrides → name overrides
  validate(name: string, value: string | undefined, field: FieldConfig): string | null {
    // 1. Required check
    if (field.required && (!value || value === "")) return "This field is required";

    // 2. Built-in type validators
    const typeError = this.validateByType(value, field);
    if (typeError) return typeError;

    // 3. Per-field custom validators from config
    if (field.validators) {
      for (const validator of field.validators) {
        const error = validator(value, field);
        if (error) return error;
      }
    }

    // 4. Module-level type override validators
    const typeOverrides = this.validationOverrides.fieldTypeValidators?.[field.type];
    if (typeOverrides) {
      for (const validator of typeOverrides) {
        const error = validator(value, field);
        if (error) return error;
      }
    }

    // 5. Module-level field name override validators
    const nameOverrides = this.validationOverrides.fieldNameValidators?.[name];
    if (nameOverrides) {
      for (const validator of nameOverrides) {
        const error = validator(value, field);
        if (error) return error;
      }
    }

    return null;
  }
}
