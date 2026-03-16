import type { FieldConfig } from "../../../formlib/types";

export const ukConfig = {
  locale: "uk",
  label: "🇬🇧 United Kingdom",
  provider: "onfido" as const,
  kycType: "standard" as const,
  steps: ["Personal Info", "Address", "Identity", "Liveness"],
  fields: {
    "Personal Info": [
      { type: "text", name: "fullName", label: "Full Legal Name", required: true, maxLength: 100 },
      { type: "text", name: "nationalId", label: "National Insurance No.", required: true, pattern: "[A-Z]{2}[0-9]{6}[A-Z]" },
      { type: "date", name: "dob", label: "Date of Birth", required: true, minAge: 18 },
    ],
    "Address": [
      { type: "text", name: "addressLine1", label: "Address Line 1", required: true },
      { type: "text", name: "postcode", label: "Postcode", required: true, pattern: "[A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2}" },
      { type: "dropdown", name: "country", label: "Country", required: true, options: ["England", "Scotland", "Wales", "N. Ireland"] },
    ],
    "Identity": [
      { type: "file", name: "passport", label: "Passport / Driving Licence", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
      { type: "file", name: "proofAddr", label: "Proof of Address", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
    ],
    "Liveness": [
      { type: "liveness", name: "faceCheck", label: "Face Verification", required: true, provider: "onfido" },
    ],
  } satisfies Record<string, FieldConfig[]>,
};
