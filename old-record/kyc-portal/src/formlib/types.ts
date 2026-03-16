export type FieldValidator = (value: string | undefined, field: FieldConfig) => string | null;

export interface BaseField {
  name: string;
  label: string;
  required: boolean;
  validators?: FieldValidator[];
}

export interface TextFieldConfig extends BaseField { type: "text"; maxLength?: number; pattern?: string; }
export interface DateFieldConfig extends BaseField { type: "date"; minAge?: number; }
export interface DropdownFieldConfig extends BaseField { type: "dropdown"; options: string[]; }
export interface FileFieldConfig extends BaseField { type: "file"; accept: string[]; maxSizeMB: number; }
export interface LivenessFieldConfig extends BaseField { type: "liveness"; provider: "onfido" | "jumio"; }

export type FieldConfig = TextFieldConfig | DateFieldConfig | DropdownFieldConfig | FileFieldConfig | LivenessFieldConfig;

export interface FieldComponentProps<T extends FieldConfig = FieldConfig> {
  field: T;
  value: string;
  error: string | null;
  onChange: (name: string, value: string) => void;
}
