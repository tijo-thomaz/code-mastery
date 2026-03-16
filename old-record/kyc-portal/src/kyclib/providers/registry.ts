import { onfidoAdapter } from "./onfido";
import { jumioAdapter } from "./jumio";
import type { KYCProviderAdapter } from "./types";
import type { KYCProvider } from "../types";

export const providerRegistry: Record<KYCProvider, KYCProviderAdapter> = {
  onfido: onfidoAdapter,
  jumio: jumioAdapter,
};

export const getProvider = (name: KYCProvider): KYCProviderAdapter => providerRegistry[name];
