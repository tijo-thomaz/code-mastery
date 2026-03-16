import type { KYCState, KYCAction } from "./types";

export const initialState: KYCState = {
  locale: "uk",
  currentStep: 0,
  formData: {},
  errors: {},
  status: "idle",
  provider: "onfido",
};

// Reducer stays pure — no dependency on kycmodule. Provider is passed in the action.
export function kycReducer(state: KYCState, action: KYCAction): KYCState {
  switch (action.type) {
    case "SET_LOCALE":
      return { ...initialState, locale: action.payload.locale, provider: action.payload.provider };
    case "SET_FIELD":
      return { ...state, formData: { ...state.formData, [action.payload.name]: action.payload.value }, errors: { ...state.errors, [action.payload.name]: null } };
    case "SET_ERROR":
      return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.error } };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "SUBMIT_START":
      return { ...state, status: "loading" };
    case "SUBMIT_VERIFYING":
      return { ...state, status: "verifying" };
    case "SUBMIT_SUCCESS":
      return { ...state, status: "success" };
    case "SUBMIT_ERROR":
      return { ...state, status: "error" };
    case "RESET":
      return { ...initialState, locale: state.locale, provider: state.provider };
    default:
      return state;
  }
}
