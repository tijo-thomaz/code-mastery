import type { ComponentType } from "react";
import type { FieldConfig, FieldComponentProps } from "./types";
import { TextField } from "./components/TextField";
import { DateField } from "./components/DateField";
import { DropdownField } from "./components/DropdownField";
import { FileField } from "./components/FileField";
import { LivenessField } from "./components/LivenessField";

export const FIELD_REGISTRY: Record<FieldConfig["type"], ComponentType<FieldComponentProps<any>>> = {
  text: TextField,
  date: DateField,
  dropdown: DropdownField,
  file: FileField,
  liveness: LivenessField,
};
