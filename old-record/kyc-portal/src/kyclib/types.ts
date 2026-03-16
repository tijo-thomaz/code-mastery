import type { FieldConfig } from "../formlib/types";

export type KYCProvider = "onfido" | "jumio";
export type KYCType = "standard" | "EDD" | "BDD";
export type KYCStatus = "idle" | "loading" | "verifying" | "success" | "error";

export interface LocaleConfig {
  locale: string;
  label: string;
  provider: KYCProvider;
  kycType: KYCType;
  steps: string[];
  fields: Record<string, FieldConfig[]>;
}

export interface KYCState {
  locale: string;
  currentStep: number;
  formData: Record<string, string>;
  errors: Record<string, string | null>;
  status: KYCStatus;
  provider: KYCProvider;
}

export type KYCAction =
  | { type: "SET_LOCALE"; payload: { locale: string; provider: KYCProvider } }
  | { type: "SET_FIELD"; payload: { name: string; value: string } }
  | { type: "SET_ERROR"; payload: { name: string; error: string } }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_VERIFYING" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "RESET" };
