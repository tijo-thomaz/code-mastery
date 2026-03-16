import type { FieldConfig } from "../../../formlib/types";

export const deConfig = {
  locale: "de",
  label: "🇩🇪 Germany",
  provider: "onfido" as const,
  kycType: "BDD" as const,
  steps: ["Persönliche Daten", "Adresse", "Ausweis", "Gesichtserkennung"],
  fields: {
    "Persönliche Daten": [
      { type: "text", name: "vollName", label: "Vollständiger Name", required: true, maxLength: 100 },
      { type: "text", name: "steuerID", label: "Steuer-ID", required: true },
      { type: "date", name: "geburtsdatum", label: "Geburtsdatum", required: true, minAge: 18 },
    ],
    "Adresse": [
      { type: "text", name: "strasse", label: "Straße & Hausnummer", required: true },
      { type: "text", name: "plz", label: "Postleitzahl", required: true, pattern: "[0-9]{5}" },
      { type: "dropdown", name: "bundesland", label: "Bundesland", required: true, options: ["Bayern", "Berlin", "Hamburg", "NRW", "Hessen", "Sachsen"] },
    ],
    "Ausweis": [
      { type: "file", name: "personalausweis", label: "Personalausweis / Reisepass", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
      { type: "file", name: "adressnachweis", label: "Adressnachweis", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
    ],
    "Gesichtserkennung": [
      { type: "liveness", name: "faceCheck", label: "Gesichtserkennung", required: true, provider: "onfido" },
    ],
  } satisfies Record<string, FieldConfig[]>,
};
