import { useState, useContext, createContext, useReducer, useCallback, useMemo } from "react";

// ============================================================
// 1. DESIGN TOKENS — Single source of truth
// ============================================================
const tokens = {
  primitive: {
    emerald400: "#34d399", emerald600: "#059669", emerald900: "#064e3b",
    slate900: "#0f172a", slate800: "#1e293b", slate700: "#334155",
    slate600: "#475569", slate400: "#94a3b8", slate200: "#e2e8f0", slate100: "#f1f5f9",
    white: "#ffffff", red400: "#f87171", amber400: "#fbbf24",
  },
};

const theme = {
  "color-bg-app":        tokens.primitive.slate900,
  "color-bg-card":       tokens.primitive.slate800,
  "color-bg-input":      tokens.primitive.slate700,
  "color-border":        tokens.primitive.slate600,
  "color-brand":         tokens.primitive.emerald400,
  "color-brand-dark":    tokens.primitive.emerald600,
  "color-text-primary":  tokens.primitive.white,
  "color-text-muted":    tokens.primitive.slate400,
  "color-text-label":    tokens.primitive.slate200,
  "color-error":         tokens.primitive.red400,
  "color-warning":       tokens.primitive.amber400,
  "space-xs": "4px", "space-sm": "8px", "space-md": "16px",
  "space-lg": "24px", "space-xl": "32px", "space-2xl": "48px",
  "radius-sm": "6px", "radius-md": "10px", "radius-lg": "16px",
  "font-display": "'Syne', sans-serif",
  "font-body":    "'DM Sans', sans-serif",
};

const css = (vars) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc + `--${k}:${v};`, "");

// ============================================================
// 2. LOCALE CONFIGS — KYC config per country (your Bet365 pattern)
// ============================================================

// Discriminated union type (in TS this would be typed)
// type FieldConfig = TextFieldConfig | DropdownFieldConfig | FileFieldConfig | DateFieldConfig

const LOCALE_CONFIGS = {
  uk: {
    locale: "uk",
    label: "🇬🇧 United Kingdom",
    provider: "onfido",
    kycType: "standard",
    steps: ["Personal Info", "Address", "Identity"],
    fields: {
      "Personal Info": [
        { type: "text",     name: "fullName",   label: "Full Legal Name",    required: true,  maxLength: 100 },
        { type: "text",     name: "nationalId",  label: "National Insurance No.", required: true, pattern: "[A-Z]{2}[0-9]{6}[A-Z]" },
        { type: "date",     name: "dob",         label: "Date of Birth",      required: true,  minAge: 18 },
      ],
      "Address": [
        { type: "text",     name: "addressLine1", label: "Address Line 1",   required: true },
        { type: "text",     name: "postcode",     label: "Postcode",         required: true,  pattern: "[A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2}" },
        { type: "dropdown", name: "country",      label: "Country",          required: true,  options: ["England", "Scotland", "Wales", "N. Ireland"] },
      ],
      "Identity": [
        { type: "file",     name: "passport",    label: "Passport / Driving Licence", required: true, accept: ["jpg","png","pdf"], maxSizeMB: 5 },
        { type: "file",     name: "proofAddr",   label: "Proof of Address",  required: true,  accept: ["jpg","png","pdf"], maxSizeMB: 5 },
      ],
    }
  },
  br: {
    locale: "br",
    label: "🇧🇷 Brazil",
    provider: "jumio",
    kycType: "EDD",
    steps: ["Dados Pessoais", "Endereço", "Documentos"],
    fields: {
      "Dados Pessoais": [
        { type: "text",     name: "nomeCompleto", label: "Nome Completo",    required: true,  maxLength: 100 },
        { type: "text",     name: "cpf",          label: "CPF",              required: true,  pattern: "[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}" },
        { type: "date",     name: "nascimento",   label: "Data de Nascimento", required: true, minAge: 18 },
      ],
      "Endereço": [
        { type: "text",     name: "logradouro",   label: "Logradouro",       required: true },
        { type: "text",     name: "cep",          label: "CEP",              required: true,  pattern: "[0-9]{5}-[0-9]{3}" },
        { type: "dropdown", name: "estado",       label: "Estado",           required: true,  options: ["SP","RJ","MG","BA","RS","PR","PE","CE"] },
      ],
      "Documentos": [
        { type: "file",     name: "rg",          label: "RG ou CNH",        required: true,  accept: ["jpg","png","pdf"], maxSizeMB: 5 },
        { type: "file",     name: "comprEnder",  label: "Comprovante de Endereço", required: true, accept: ["jpg","png","pdf"], maxSizeMB: 5 },
      ],
    }
  },
  de: {
    locale: "de",
    label: "🇩🇪 Germany",
    provider: "onfido",
    kycType: "BDD",
    steps: ["Persönliche Daten", "Adresse", "Ausweis"],
    fields: {
      "Persönliche Daten": [
        { type: "text",     name: "vollName",     label: "Vollständiger Name", required: true, maxLength: 100 },
        { type: "text",     name: "steuerID",     label: "Steueridentifikationsnummer", required: true },
        { type: "date",     name: "geburtsdatum", label: "Geburtsdatum",      required: true, minAge: 18 },
      ],
      "Adresse": [
        { type: "text",     name: "strasse",      label: "Straße & Hausnummer", required: true },
        { type: "text",     name: "plz",          label: "Postleitzahl",      required: true, pattern: "[0-9]{5}" },
        { type: "dropdown", name: "bundesland",   label: "Bundesland",        required: true, options: ["Bayern","Berlin","Hamburg","NRW","Hessen","Sachsen","Baden-Württemberg"] },
      ],
      "Ausweis": [
        { type: "file",     name: "personalausweis", label: "Personalausweis / Reisepass", required: true, accept: ["jpg","png","pdf"], maxSizeMB: 5 },
        { type: "file",     name: "adressnachweis",  label: "Adressnachweis",  required: true, accept: ["jpg","png","pdf"], maxSizeMB: 5 },
      ],
    }
  }
};

// ============================================================
// 3. REDUX-STYLE REDUCER (simulating RTK without the library)
// ============================================================
const initialState = {
  locale: "uk",
  currentStep: 0,
  formData: {},
  errors: {},
  status: "idle", // idle | loading | success | error
  provider: "onfido",
};

function kycReducer(state, action) {
  switch (action.type) {
    case "SET_LOCALE":
      return { ...initialState, locale: action.payload, provider: LOCALE_CONFIGS[action.payload].provider };
    case "SET_FIELD":
      return { ...state, formData: { ...state.formData, [action.payload.name]: action.payload.value },
               errors: { ...state.errors, [action.payload.name]: null } };
    case "SET_ERROR":
      return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.error } };
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "SUBMIT_START":
      return { ...state, status: "loading" };
    case "SUBMIT_SUCCESS":
      return { ...state, status: "success" };
    case "RESET":
      return { ...initialState, locale: state.locale, provider: state.provider };
    default:
      return state;
  }
}

// ============================================================
// 4. CONTEXT — replaces Singleton (the anti-pattern fix)
// ============================================================
const KYCContext = createContext(null);

const useKYC = () => {
  const ctx = useContext(KYCContext);
  if (!ctx) throw new Error("useKYC must be used within KYCProvider");
  return ctx;
};

const KYCProvider = ({ children }) => {
  const [state, dispatch] = useReducer(kycReducer, initialState);

  const config = useMemo(() => LOCALE_CONFIGS[state.locale], [state.locale]);
  const steps = config.steps;
  const currentStepName = steps[state.currentStep];
  const fields = config.fields[currentStepName] || [];
  const isLastStep = state.currentStep === steps.length - 1;

  const setLocale = useCallback((locale) => dispatch({ type: "SET_LOCALE", payload: locale }), []);
  const setField = useCallback((name, value) => dispatch({ type: "SET_FIELD", payload: { name, value } }), []);
  const setError = useCallback((name, error) => dispatch({ type: "SET_ERROR", payload: { name, error } }), []);

  const validateStep = useCallback(() => {
    let valid = true;
    fields.forEach(field => {
      const val = state.formData[field.name];
      if (field.required && (!val || val === "")) {
        dispatch({ type: "SET_ERROR", payload: { name: field.name, error: "This field is required" } });
        valid = false;
      }
    });
    return valid;
  }, [fields, state.formData]);

  const nextStep = useCallback(() => {
    if (validateStep()) {
      if (isLastStep) {
        dispatch({ type: "SUBMIT_START" });
        setTimeout(() => dispatch({ type: "SUBMIT_SUCCESS" }), 2000);
      } else {
        dispatch({ type: "NEXT_STEP" });
      }
    }
  }, [validateStep, isLastStep]);

  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <KYCContext.Provider value={{ state, config, steps, currentStepName, fields, isLastStep, setLocale, setField, setError, nextStep, prevStep, reset }}>
      {children}
    </KYCContext.Provider>
  );
};

// ============================================================
// 5. FORMLIB — Primitive UI components (your formlib layer)
// ============================================================

const TextField = ({ field, value, error, onChange }) => (
  <div style={{ marginBottom: "var(--space-md)" }}>
    <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"var(--color-text-label)", marginBottom:"var(--space-xs)", letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {field.label}{field.required && <span style={{ color:"var(--color-brand)", marginLeft:2 }}>*</span>}
    </label>
    <input
      type="text"
      value={value || ""}
      placeholder={field.pattern ? `e.g. ${field.pattern.replace(/[\[\]\\^$.|?*+()]/g,"")}` : ""}
      onChange={e => onChange(field.name, e.target.value)}
      style={{
        width:"100%", boxSizing:"border-box", padding:"12px var(--space-md)",
        background:"var(--color-bg-input)", border:`1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
        borderRadius:"var(--radius-sm)", color:"var(--color-text-primary)", fontSize:"14px",
        fontFamily:"var(--font-body)", outline:"none", transition:"border 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = "var(--color-brand)"}
      onBlur={e => e.target.style.borderColor = error ? "var(--color-error)" : "var(--color-border)"}
    />
    {error && <span style={{ fontSize:"11px", color:"var(--color-error)", marginTop:4, display:"block" }}>{error}</span>}
  </div>
);

const DateField = ({ field, value, error, onChange }) => (
  <div style={{ marginBottom:"var(--space-md)" }}>
    <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"var(--color-text-label)", marginBottom:"var(--space-xs)", letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {field.label}{field.required && <span style={{ color:"var(--color-brand)", marginLeft:2 }}>*</span>}
    </label>
    <input
      type="date"
      value={value || ""}
      onChange={e => onChange(field.name, e.target.value)}
      style={{
        width:"100%", boxSizing:"border-box", padding:"12px var(--space-md)",
        background:"var(--color-bg-input)", border:`1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
        borderRadius:"var(--radius-sm)", color:"var(--color-text-primary)", fontSize:"14px",
        fontFamily:"var(--font-body)", outline:"none", colorScheme:"dark",
      }}
    />
    {error && <span style={{ fontSize:"11px", color:"var(--color-error)", marginTop:4, display:"block" }}>{error}</span>}
  </div>
);

const DropdownField = ({ field, value, error, onChange }) => (
  <div style={{ marginBottom:"var(--space-md)" }}>
    <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"var(--color-text-label)", marginBottom:"var(--space-xs)", letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {field.label}{field.required && <span style={{ color:"var(--color-brand)", marginLeft:2 }}>*</span>}
    </label>
    <select
      value={value || ""}
      onChange={e => onChange(field.name, e.target.value)}
      style={{
        width:"100%", boxSizing:"border-box", padding:"12px var(--space-md)",
        background:"var(--color-bg-input)", border:`1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
        borderRadius:"var(--radius-sm)", color: value ? "var(--color-text-primary)" : "var(--color-text-muted)",
        fontSize:"14px", fontFamily:"var(--font-body)", outline:"none", cursor:"pointer",
      }}
    >
      <option value="">Select {field.label}</option>
      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {error && <span style={{ fontSize:"11px", color:"var(--color-error)", marginTop:4, display:"block" }}>{error}</span>}
  </div>
);

const FileField = ({ field, value, error, onChange }) => (
  <div style={{ marginBottom:"var(--space-md)" }}>
    <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"var(--color-text-label)", marginBottom:"var(--space-xs)", letterSpacing:"0.05em", textTransform:"uppercase" }}>
      {field.label}{field.required && <span style={{ color:"var(--color-brand)", marginLeft:2 }}>*</span>}
    </label>
    <div
      onClick={() => document.getElementById(`file-${field.name}`).click()}
      style={{
        padding:"var(--space-lg)", border:`2px dashed ${error ? "var(--color-error)" : value ? "var(--color-brand)" : "var(--color-border)"}`,
        borderRadius:"var(--radius-md)", textAlign:"center", cursor:"pointer",
        background: value ? "rgba(52,211,153,0.05)" : "transparent", transition:"all 0.2s",
      }}
    >
      <div style={{ fontSize:"24px", marginBottom:"var(--space-xs)" }}>{value ? "✅" : "📄"}</div>
      <div style={{ fontSize:"13px", color: value ? "var(--color-brand)" : "var(--color-text-muted)" }}>
        {value ? value : `Drop file or click to upload · ${field.accept.join(", ")} · max ${field.maxSizeMB}MB`}
      </div>
      <input
        id={`file-${field.name}`} type="file"
        accept={field.accept.map(a => `.${a}`).join(",")}
        style={{ display:"none" }}
        onChange={e => onChange(field.name, e.target.files[0]?.name || "")}
      />
    </div>
    {error && <span style={{ fontSize:"11px", color:"var(--color-error)", marginTop:4, display:"block" }}>{error}</span>}
  </div>
);

// ============================================================
// 6. FORM ENGINE — maps field type → component (config-driven)
// ============================================================
const FIELD_REGISTRY = {
  text:     TextField,
  date:     DateField,
  dropdown: DropdownField,
  file:     FileField,
};

const FieldRenderer = ({ field }) => {
  const { state, setField } = useKYC();
  const Component = FIELD_REGISTRY[field.type];
  if (!Component) return <div style={{color:"var(--color-error)"}}>Unknown field type: {field.type}</div>;
  return <Component field={field} value={state.formData[field.name]} error={state.errors[field.name]} onChange={setField} />;
};

const FormEngine = () => {
  const { fields } = useKYC();
  return <div>{fields.map(field => <FieldRenderer key={field.name} field={field} />)}</div>;
};

// ============================================================
// 7. UI SHELL — Header, Steps, Provider Badge
// ============================================================

const ProviderBadge = ({ provider }) => {
  const colors = { onfido: "#4f46e5", jumio: "#0891b2" };
  return (
    <span style={{
      padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:700,
      background: colors[provider] || "#475569", color:"#fff", letterSpacing:"0.05em",
      textTransform:"uppercase",
    }}>
      {provider}
    </span>
  );
};

const StepIndicator = () => {
  const { steps, state } = useKYC();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"var(--space-sm)", marginBottom:"var(--space-xl)" }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display:"flex", alignItems:"center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{
            width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"12px", fontWeight:700, flexShrink:0,
            background: i < state.currentStep ? "var(--color-brand)" : i === state.currentStep ? "var(--color-brand)" : "var(--color-bg-input)",
            color: i <= state.currentStep ? "var(--color-bg-app)" : "var(--color-text-muted)",
            border: i === state.currentStep ? "2px solid var(--color-brand)" : "2px solid transparent",
            boxShadow: i === state.currentStep ? "0 0 0 3px rgba(52,211,153,0.2)" : "none",
            transition:"all 0.3s",
          }}>
            {i < state.currentStep ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex:1, height:2, margin:"0 var(--space-xs)",
              background: i < state.currentStep ? "var(--color-brand)" : "var(--color-border)",
              transition:"background 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

const LocaleSelector = () => {
  const { state, setLocale } = useKYC();
  return (
    <div style={{ display:"flex", gap:"var(--space-sm)", flexWrap:"wrap" }}>
      {Object.entries(LOCALE_CONFIGS).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => setLocale(key)}
          style={{
            padding:"8px var(--space-md)", borderRadius:"var(--radius-sm)", fontSize:"13px",
            cursor:"pointer", fontFamily:"var(--font-body)", fontWeight:600, transition:"all 0.2s",
            background: state.locale === key ? "var(--color-brand)" : "var(--color-bg-input)",
            color: state.locale === key ? "var(--color-bg-app)" : "var(--color-text-muted)",
            border: `1px solid ${state.locale === key ? "var(--color-brand)" : "var(--color-border)"}`,
          }}
        >
          {cfg.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================
// 8. SUCCESS SCREEN
// ============================================================
const SuccessScreen = () => {
  const { state, config, reset } = useKYC();
  return (
    <div style={{ textAlign:"center", padding:"var(--space-2xl) var(--space-xl)" }}>
      <div style={{ fontSize:"64px", marginBottom:"var(--space-lg)", animation:"pulse 1s ease" }}>✅</div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"28px", color:"var(--color-brand)", marginBottom:"var(--space-sm)" }}>
        Verification Submitted
      </h2>
      <p style={{ color:"var(--color-text-muted)", marginBottom:"var(--space-lg)", lineHeight:1.6 }}>
        Your KYC has been submitted via <strong style={{color:"var(--color-text-primary)"}}>{config.provider.toUpperCase()}</strong> for {config.label}.<br/>
        KYC Type: <strong style={{color:"var(--color-text-primary)"}}>{config.kycType}</strong>
      </p>
      <div style={{
        background:"var(--color-bg-input)", borderRadius:"var(--radius-md)", padding:"var(--space-md)",
        marginBottom:"var(--space-lg)", textAlign:"left", fontSize:"12px", fontFamily:"monospace",
        color:"var(--color-brand)", maxHeight:120, overflow:"auto",
      }}>
        {JSON.stringify(state.formData, null, 2)}
      </div>
      <button onClick={reset} style={{
        padding:"12px var(--space-xl)", background:"var(--color-brand)", color:"var(--color-bg-app)",
        border:"none", borderRadius:"var(--radius-sm)", fontSize:"14px", fontWeight:700,
        cursor:"pointer", fontFamily:"var(--font-body)",
      }}>
        Start New Application
      </button>
    </div>
  );
};

// ============================================================
// 9. LOADING SCREEN
// ============================================================
const LoadingScreen = () => (
  <div style={{ textAlign:"center", padding:"var(--space-2xl)" }}>
    <div style={{ fontSize:"40px", marginBottom:"var(--space-lg)", animation:"spin 1s linear infinite", display:"inline-block" }}>⚙️</div>
    <p style={{ color:"var(--color-text-muted)" }}>Submitting to verification provider...</p>
  </div>
);

// ============================================================
// 10. MAIN APP
// ============================================================
const KYCPortalInner = () => {
  const { state, config, steps, currentStepName, isLastStep, nextStep, prevStep } = useKYC();

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "success") return <SuccessScreen />;

  return (
    <div style={{ minHeight:"100vh", background:"var(--color-bg-app)", display:"flex", alignItems:"center", justifyContent:"center", padding:"var(--space-lg)", fontFamily:"var(--font-body)" }}>
      <div style={{ width:"100%", maxWidth:600 }}>

        {/* Header */}
        <div style={{ marginBottom:"var(--space-xl)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"var(--space-sm)" }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"32px", color:"var(--color-text-primary)", margin:0, letterSpacing:"-0.02em" }}>
              KYC<span style={{ color:"var(--color-brand)" }}>Verify</span>
            </h1>
            <ProviderBadge provider={config.provider} />
          </div>
          <p style={{ color:"var(--color-text-muted)", fontSize:"13px", margin:"0 0 var(--space-lg)" }}>
            {config.kycType} · {config.label}
          </p>
          <LocaleSelector />
        </div>

        {/* Card */}
        <div style={{
          background:"var(--color-bg-card)", borderRadius:"var(--radius-lg)", padding:"var(--space-xl)",
          border:"1px solid var(--color-border)", boxShadow:"0 24px 48px rgba(0,0,0,0.4)",
        }}>
          <StepIndicator />

          <div style={{ marginBottom:"var(--space-lg)" }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"20px", color:"var(--color-text-primary)", margin:"0 0 var(--space-xs)", letterSpacing:"-0.01em" }}>
              {currentStepName}
            </h2>
            <p style={{ color:"var(--color-text-muted)", fontSize:"13px", margin:0 }}>
              Step {state.currentStep + 1} of {steps.length}
            </p>
          </div>

          <FormEngine />

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"var(--space-lg)", gap:"var(--space-sm)" }}>
            {state.currentStep > 0 && (
              <button onClick={prevStep} style={{
                padding:"12px var(--space-lg)", background:"transparent", color:"var(--color-text-muted)",
                border:"1px solid var(--color-border)", borderRadius:"var(--radius-sm)", fontSize:"14px",
                cursor:"pointer", fontFamily:"var(--font-body)", fontWeight:600,
              }}>
                ← Back
              </button>
            )}
            <button onClick={nextStep} style={{
              padding:"12px var(--space-xl)", background:"var(--color-brand)", color:"var(--color-bg-app)",
              border:"none", borderRadius:"var(--radius-sm)", fontSize:"14px", fontWeight:700,
              cursor:"pointer", fontFamily:"var(--font-body)", marginLeft:"auto", transition:"opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              {isLastStep ? "Submit Verification →" : "Continue →"}
            </button>
          </div>
        </div>

        {/* Architecture note */}
        <div style={{ marginTop:"var(--space-lg)", padding:"var(--space-md)", background:"rgba(52,211,153,0.05)", borderRadius:"var(--radius-md)", border:"1px solid rgba(52,211,153,0.1)" }}>
          <p style={{ color:"var(--color-text-muted)", fontSize:"11px", margin:0, lineHeight:1.7 }}>
            <strong style={{ color:"var(--color-brand)" }}>Architecture:</strong> 3-layer (formlib → kyclib → kycmodule) ·
            Config-driven field registry · Discriminated union types · useReducer (RTK pattern) ·
            Context replaces Singleton · Design tokens · Locale-driven config switching
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        :root { ${css(theme)} }
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        select option { background: var(--color-bg-input); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <KYCProvider>
      <KYCPortalInner />
    </KYCProvider>
  );
}
