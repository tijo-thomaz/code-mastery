import { createContext, useContext, useReducer, useCallback, useMemo, useState, type ReactNode } from "react";
import { kycReducer, initialState } from "../kyclib/reducer";
import { getModule } from "./locales/registry";
import { getProvider } from "../kyclib/providers/registry";
import type { KYCState } from "../kyclib/types";
import type { KYCModule } from "../kyclib/module";
import type { KYCProviderAdapter, ProviderResult } from "../kyclib/providers/types";
import type { FieldConfig } from "../formlib/types";

interface KYCContextValue {
  state: KYCState;
  module: KYCModule;
  providerAdapter: KYCProviderAdapter;
  steps: string[];
  currentStepName: string;
  fields: FieldConfig[];
  isLastStep: boolean;
  setLocale: (locale: string) => void;
  setField: (name: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  verificationResult: ProviderResult | null;
}

const KYCContext = createContext<KYCContextValue | null>(null);

export const useKYC = (): KYCContextValue => {
  const ctx = useContext(KYCContext);
  if (!ctx) throw new Error("useKYC must be used within KYCProvider");
  return ctx;
};

export const KYCProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(kycReducer, initialState);
  const [verificationResult, setVerificationResult] = useState<ProviderResult | null>(null);

  const module = useMemo(() => getModule(state.locale), [state.locale]);
  const providerAdapter = useMemo(() => getProvider(state.provider), [state.provider]);
  const steps = module.steps;
  const currentStepName = steps[state.currentStep];
  const fields = module.fields[currentStepName] || [];
  const isLastStep = state.currentStep === steps.length - 1;

  const setLocale = useCallback((locale: string) => {
    setVerificationResult(null);
    const mod = getModule(locale);
    dispatch({ type: "SET_LOCALE", payload: { locale, provider: mod.provider } });
  }, []);

  const setField = useCallback((name: string, value: string) => {
    dispatch({ type: "SET_FIELD", payload: { name, value } });
  }, []);

  const validateStep = useCallback((): boolean => {
    let valid = true;
    fields.forEach((field) => {
      const error = module.validate(field.name, state.formData[field.name], field);
      if (error) {
        dispatch({ type: "SET_ERROR", payload: { name: field.name, error } });
        valid = false;
      }
    });
    return valid;
  }, [fields, state.formData, module]);

  const nextStep = useCallback(async () => {
    if (!validateStep()) return;
    if (isLastStep) {
      dispatch({ type: "SUBMIT_START" });
      try {
        dispatch({ type: "SUBMIT_VERIFYING" });
        const result = await providerAdapter.submitVerification(state.formData);
        setVerificationResult(result);
        dispatch({ type: "SUBMIT_SUCCESS" });
      } catch {
        dispatch({ type: "SUBMIT_ERROR", payload: "Verification failed" });
      }
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [validateStep, isLastStep, providerAdapter, state.formData]);

  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const reset = useCallback(() => { setVerificationResult(null); dispatch({ type: "RESET" }); }, []);

  return (
    <KYCContext.Provider value={{ state, module, providerAdapter, steps, currentStepName, fields, isLastStep, setLocale, setField, nextStep, prevStep, reset, verificationResult }}>
      {children}
    </KYCContext.Provider>
  );
};
