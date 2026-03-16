import type { FieldConfig } from "../../../formlib/types";

export const brConfig = {
  locale: "br",
  label: "🇧🇷 Brazil",
  provider: "jumio" as const,
  kycType: "EDD" as const,
  steps: ["Dados Pessoais", "Endereço", "Documentos", "Verificação Facial"],
  fields: {
    "Dados Pessoais": [
      { type: "text", name: "nomeCompleto", label: "Nome Completo", required: true, maxLength: 100 },
      { type: "text", name: "cpf", label: "CPF", required: true, pattern: "[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}" },
      { type: "date", name: "nascimento", label: "Data de Nascimento", required: true, minAge: 18 },
    ],
    "Endereço": [
      { type: "text", name: "logradouro", label: "Logradouro", required: true },
      { type: "text", name: "cep", label: "CEP", required: true, pattern: "[0-9]{5}-[0-9]{3}" },
      { type: "dropdown", name: "estado", label: "Estado", required: true, options: ["SP", "RJ", "MG", "BA", "RS", "PR", "PE", "CE"] },
    ],
    "Documentos": [
      { type: "file", name: "rg", label: "RG ou CNH", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
      { type: "file", name: "comprEnder", label: "Comprovante de Endereço", required: true, accept: ["jpg", "png", "pdf"], maxSizeMB: 5 },
    ],
    "Verificação Facial": [
      { type: "liveness", name: "faceCheck", label: "Verificação Facial", required: true, provider: "jumio" },
    ],
  } satisfies Record<string, FieldConfig[]>,
};
