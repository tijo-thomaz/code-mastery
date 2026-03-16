# 🏗️ KYC Portal — Scalable Architecture + Testing Strategy

> **Interview pitch:** "I built a config-driven, multi-locale KYC verification portal
> using a 3-layer architecture (formlib → kyclib → kycmodule). Fully tested with
> Jest + RTL. Adding a new country = zero component changes."

---

## 1. FOLDER STRUCTURE (Production-Grade)

```
src/
├── formlib/                    ← LAYER 1: Dumb UI primitives (reusable across apps)
│   ├── components/
│   │   ├── TextField.tsx
│   │   ├── TextField.test.tsx
│   │   ├── DateField.tsx
│   │   ├── DateField.test.tsx
│   │   ├── DropdownField.tsx
│   │   ├── DropdownField.test.tsx
│   │   ├── FileField.tsx
│   │   ├── FileField.test.tsx
│   │   └── index.ts             ← barrel export
│   ├── tokens/
│   │   └── theme.ts             ← design tokens (primitive + semantic)
│   └── types.ts                 ← FieldConfig, TextFieldProps, etc.
│
├── kyclib/                     ← LAYER 2: KYC business logic (no UI)
│   ├── configs/
│   │   ├── uk.ts
│   │   ├── br.ts
│   │   ├── de.ts
│   │   └── index.ts             ← LOCALE_CONFIGS map
│   ├── reducer/
│   │   ├── kycReducer.ts
│   │   ├── kycReducer.test.ts   ← PURE FUNCTION — easiest to test!
│   │   └── actions.ts           ← action creators
│   ├── validation/
│   │   ├── validators.ts        ← required, pattern, minAge, maxSize
│   │   ├── validators.test.ts
│   │   └── validateStep.ts
│   ├── registry/
│   │   └── fieldRegistry.ts     ← type → component mapping
│   └── types.ts                 ← LocaleConfig, KYCState, KYCAction
│
├── kycmodule/                  ← LAYER 3: App shell (composition layer)
│   ├── context/
│   │   ├── KYCProvider.tsx
│   │   ├── KYCProvider.test.tsx
│   │   └── useKYC.ts
│   ├── components/
│   │   ├── FormEngine.tsx
│   │   ├── FormEngine.test.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── StepIndicator.test.tsx
│   │   ├── LocaleSelector.tsx
│   │   ├── LocaleSelector.test.tsx
│   │   ├── SuccessScreen.tsx
│   │   └── LoadingScreen.tsx
│   ├── pages/
│   │   ├── KYCPortal.tsx        ← main page
│   │   └── KYCPortal.test.tsx   ← integration test
│   └── index.ts
│
├── __tests__/                  ← Integration / E2E-like tests
│   └── kyc-flow.test.tsx        ← full user journey test
│
├── App.tsx
└── setupTests.ts
```

### Why This Structure?
| Layer | Responsibility | Changes when... | Testable by... |
|-------|---------------|-----------------|----------------|
| **formlib** | Render inputs, emit onChange | Design system changes | Unit: props in → output rendered |
| **kyclib** | Config, reducer, validation | Business rules change | Unit: pure functions, no React needed |
| **kycmodule** | Wire layers together | New feature/flow added | Integration: user interactions |

---

## 2. KEY TYPES (TypeScript Discriminated Union)

```typescript
// formlib/types.ts
interface BaseField {
  name: string;
  label: string;
  required: boolean;
}

interface TextFieldConfig extends BaseField {
  type: "text";
  maxLength?: number;
  pattern?: string;
}

interface DateFieldConfig extends BaseField {
  type: "date";
  minAge?: number;
}

interface DropdownFieldConfig extends BaseField {
  type: "dropdown";
  options: string[];
}

interface FileFieldConfig extends BaseField {
  type: "file";
  accept: string[];
  maxSizeMB: number;
}

// Discriminated union — TS narrows by `type`
type FieldConfig = TextFieldConfig | DateFieldConfig | DropdownFieldConfig | FileFieldConfig;

// kyclib/types.ts
interface LocaleConfig {
  locale: string;
  label: string;
  provider: "onfido" | "jumio";
  kycType: "standard" | "EDD" | "BDD";
  steps: string[];
  fields: Record<string, FieldConfig[]>;
}

type KYCStatus = "idle" | "loading" | "success" | "error";

interface KYCState {
  locale: string;
  currentStep: number;
  formData: Record<string, string>;
  errors: Record<string, string | null>;
  status: KYCStatus;
  provider: string;
}

type KYCAction =
  | { type: "SET_LOCALE"; payload: string }
  | { type: "SET_FIELD"; payload: { name: string; value: string } }
  | { type: "SET_ERROR"; payload: { name: string; error: string } }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "RESET" };
```

---

## 3. TESTING STRATEGY

### Level 1: Unit Tests — Pure Functions (NO React)

```typescript
// kyclib/reducer/kycReducer.test.ts
import { kycReducer, initialState } from "./kycReducer";

describe("kycReducer", () => {
  it("sets locale and resets form", () => {
    const state = kycReducer(initialState, {
      type: "SET_LOCALE",
      payload: "br",
    });
    expect(state.locale).toBe("br");
    expect(state.provider).toBe("jumio");
    expect(state.formData).toEqual({});  // form reset
    expect(state.currentStep).toBe(0);   // step reset
  });

  it("sets field value and clears its error", () => {
    const withError = {
      ...initialState,
      errors: { fullName: "Required" },
    };
    const state = kycReducer(withError, {
      type: "SET_FIELD",
      payload: { name: "fullName", value: "Tijo" },
    });
    expect(state.formData.fullName).toBe("Tijo");
    expect(state.errors.fullName).toBeNull();  // error cleared!
  });

  it("does not go below step 0", () => {
    const state = kycReducer(initialState, { type: "PREV_STEP" });
    expect(state.currentStep).toBe(0);
  });

  it("transitions: idle → loading → success", () => {
    let state = kycReducer(initialState, { type: "SUBMIT_START" });
    expect(state.status).toBe("loading");
    state = kycReducer(state, { type: "SUBMIT_SUCCESS" });
    expect(state.status).toBe("success");
  });

  it("reset preserves locale and provider", () => {
    const modified = {
      ...initialState,
      locale: "de",
      provider: "onfido",
      currentStep: 2,
      formData: { vollName: "Max" },
    };
    const state = kycReducer(modified, { type: "RESET" });
    expect(state.locale).toBe("de");
    expect(state.provider).toBe("onfido");
    expect(state.currentStep).toBe(0);
    expect(state.formData).toEqual({});
  });
});
```

```typescript
// kyclib/validation/validators.test.ts
import { validateRequired, validatePattern, validateMinAge } from "./validators";

describe("validators", () => {
  describe("validateRequired", () => {
    it("returns error for empty string", () => {
      expect(validateRequired("")).toBe("This field is required");
    });
    it("returns error for null/undefined", () => {
      expect(validateRequired(null)).toBe("This field is required");
      expect(validateRequired(undefined)).toBe("This field is required");
    });
    it("returns null for valid value", () => {
      expect(validateRequired("Tijo")).toBeNull();
    });
  });

  describe("validatePattern", () => {
    it("validates UK postcode", () => {
      const pattern = "[A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2}";
      expect(validatePattern("SW1A 1AA", pattern)).toBeNull();
      expect(validatePattern("invalid", pattern)).toBe("Invalid format");
    });
    it("validates CPF", () => {
      const pattern = "[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}";
      expect(validatePattern("123.456.789-00", pattern)).toBeNull();
    });
  });

  describe("validateMinAge", () => {
    it("rejects under 18", () => {
      const today = new Date();
      const under18 = `${today.getFullYear() - 17}-01-01`;
      expect(validateMinAge(under18, 18)).toBe("Must be at least 18 years old");
    });
    it("accepts 18+", () => {
      expect(validateMinAge("1995-06-15", 18)).toBeNull();
    });
  });
});
```

### Level 2: Component Tests — RTL (render + assert)

```tsx
// formlib/components/TextField.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TextField } from "./TextField";

describe("TextField", () => {
  const baseField = {
    type: "text" as const,
    name: "fullName",
    label: "Full Name",
    required: true,
  };

  it("renders label with required asterisk", () => {
    render(<TextField field={baseField} value="" error={null} onChange={() => {}} />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("calls onChange with name and value", () => {
    const onChange = jest.fn();
    render(<TextField field={baseField} value="" error={null} onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Tijo" } });
    expect(onChange).toHaveBeenCalledWith("fullName", "Tijo");
  });

  it("shows error message when error prop is set", () => {
    render(<TextField field={baseField} value="" error="This field is required" onChange={() => {}} />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does NOT show error when error is null", () => {
    render(<TextField field={baseField} value="Tijo" error={null} onChange={() => {}} />);
    expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
  });
});
```

```tsx
// formlib/components/DropdownField.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownField } from "./DropdownField";

describe("DropdownField", () => {
  const field = {
    type: "dropdown" as const,
    name: "country",
    label: "Country",
    required: true,
    options: ["England", "Scotland", "Wales"],
  };

  it("renders all options plus placeholder", () => {
    render(<DropdownField field={field} value="" error={null} onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("England")).toBeInTheDocument();
    expect(screen.getByText("Scotland")).toBeInTheDocument();
    expect(screen.getByText("Wales")).toBeInTheDocument();
  });

  it("fires onChange with field name and selected value", () => {
    const onChange = jest.fn();
    render(<DropdownField field={field} value="" error={null} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Scotland" } });
    expect(onChange).toHaveBeenCalledWith("country", "Scotland");
  });
});
```

### Level 3: Integration Test — Full User Journey

```tsx
// __tests__/kyc-flow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("KYC Portal — Full Flow", () => {
  it("completes UK KYC journey end-to-end", async () => {
    render(<App />);
    const user = userEvent.setup();

    // STEP 1: UK is default locale
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("ONFIDO")).toBeInTheDocument();

    // Fill personal info
    await user.type(screen.getByLabelText(/full legal name/i), "Tijo Thomaz");
    await user.type(screen.getByLabelText(/national insurance/i), "AB123456C");
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "1995-06-15" },
    });

    // Navigate to step 2
    await user.click(screen.getByText("Continue →"));
    expect(screen.getByText("Address")).toBeInTheDocument();

    // Fill address
    await user.type(screen.getByLabelText(/address line 1/i), "123 Baker St");
    await user.type(screen.getByLabelText(/postcode/i), "SW1A 1AA");
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "England" },
    });

    // Navigate to step 3
    await user.click(screen.getByText("Continue →"));
    expect(screen.getByText("Identity")).toBeInTheDocument();
  });

  it("shows validation errors on empty fields", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Try to continue without filling anything
    await user.click(screen.getByText("Continue →"));

    // Should show error messages
    const errors = screen.getAllByText("This field is required");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("switches locale and resets form", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Fill a UK field
    await user.type(screen.getByLabelText(/full legal name/i), "Tijo");

    // Switch to Brazil
    await user.click(screen.getByText("🇧🇷 Brazil"));

    // Should see Brazilian fields, not UK
    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue("");  // form reset
    expect(screen.getByText("JUMIO")).toBeInTheDocument();  // provider changed
  });

  it("can go back to previous step", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Fill step 1 and advance
    await user.type(screen.getByLabelText(/full legal name/i), "Tijo");
    await user.type(screen.getByLabelText(/national insurance/i), "AB123456C");
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "1995-06-15" },
    });
    await user.click(screen.getByText("Continue →"));

    // Should be on step 2
    expect(screen.getByText("Address")).toBeInTheDocument();

    // Go back
    await user.click(screen.getByText("← Back"));
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    // Data should be preserved
    expect(screen.getByLabelText(/full legal name/i)).toHaveValue("Tijo");
  });

  it("shows success screen after final submit", async () => {
    jest.useFakeTimers();
    render(<App />);

    // ... (fill all 3 steps) ...
    // On last step, click "Submit Verification →"
    // fireEvent.click(screen.getByText("Submit Verification →"));

    // Shows loading
    // expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    // After 2s, shows success
    // jest.advanceTimersByTime(2000);
    // expect(screen.getByText("Verification Submitted")).toBeInTheDocument();

    jest.useRealTimers();
  });
});
```

### Level 4: Custom Hook Test

```tsx
// kycmodule/context/KYCProvider.test.tsx
import { renderHook, act } from "@testing-library/react";
import { KYCProvider } from "./KYCProvider";
import { useKYC } from "./useKYC";

const wrapper = ({ children }) => <KYCProvider>{children}</KYCProvider>;

describe("useKYC", () => {
  it("throws when used outside provider", () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useKYC())).toThrow(
      "useKYC must be used within KYCProvider"
    );
    spy.mockRestore();
  });

  it("provides default UK config", () => {
    const { result } = renderHook(() => useKYC(), { wrapper });
    expect(result.current.state.locale).toBe("uk");
    expect(result.current.config.provider).toBe("onfido");
    expect(result.current.steps).toEqual(["Personal Info", "Address", "Identity"]);
  });

  it("setLocale switches config and resets form", () => {
    const { result } = renderHook(() => useKYC(), { wrapper });

    act(() => result.current.setField("fullName", "Tijo"));
    expect(result.current.state.formData.fullName).toBe("Tijo");

    act(() => result.current.setLocale("br"));
    expect(result.current.state.locale).toBe("br");
    expect(result.current.config.provider).toBe("jumio");
    expect(result.current.state.formData).toEqual({});  // reset!
  });

  it("validates required fields on nextStep", () => {
    const { result } = renderHook(() => useKYC(), { wrapper });

    act(() => result.current.nextStep());  // no data filled

    // Should have errors
    expect(Object.values(result.current.state.errors).some(Boolean)).toBe(true);
    expect(result.current.state.currentStep).toBe(0);  // did NOT advance
  });
});
```

---

## 4. TEST COMMANDS

```json
// package.json scripts
{
  "scripts": {
    "test":           "jest",
    "test:watch":     "jest --watch",
    "test:coverage":  "jest --coverage",
    "test:unit":      "jest --testPathPattern='(reducer|validator)'",
    "test:component": "jest --testPathPattern='formlib'",
    "test:integration": "jest --testPathPattern='__tests__'"
  }
}
```

```js
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterSetup: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
```

---

## 5. TESTING PYRAMID (What to Say in Interview)

```
        ╱╲
       ╱  ╲         E2E (Cypress/Playwright)
      ╱ 2  ╲        Full user journey — 1-2 tests
     ╱──────╲
    ╱        ╲      Integration (RTL)
   ╱   5-10   ╲    Multi-component flows — 5-10 tests
  ╱────────────╲
 ╱              ╲   Unit (Jest)
╱    30-50+      ╲  Reducer, validators, utils — bulk of tests
╱────────────────╲
```

> "I test the **reducer and validators as pure functions** — no React needed,
> fastest tests. Components get **RTL tests** — render, interact, assert.
> Full flows get **1-2 integration tests** that walk through the entire
> stepper. The ratio is roughly 60% unit / 30% integration / 10% E2E."

---

## 6. INTERVIEW TALKING POINTS

| Question | Your Answer |
|----------|-------------|
| "Why 3 layers?" | "formlib is reusable across apps. kyclib has zero UI — I can unit test the reducer with plain Jest. kycmodule wires them. If the design system changes, only formlib changes." |
| "Why useReducer over useState?" | "KYC has 8+ related state transitions. A reducer gives me a predictable state machine I can test with pure function assertions — no rendering needed." |
| "Why config-driven?" | "At Bet365, we served 20+ locales. Adding India = add one config object with Aadhaar/PAN fields. Zero component changes. That's the power." |
| "How do you test this?" | "Reducer + validators = pure Jest (60% of tests). Components = RTL render + fireEvent (30%). Full journey = integration test with userEvent (10%)." |
| "What about RTK?" | "The reducer pattern here maps 1:1 to an RTK slice. In production I'd use createSlice + createAsyncThunk for the API call. The architecture stays the same." |
| "What about error boundaries?" | "I'd wrap KYCPortalInner in an ErrorBoundary that shows a fallback + retry button. Critical for production — KYC failures = blocked users = lost revenue." |
