import { UKModule } from "./uk";
import { BRModule } from "./br";
import { DEModule } from "./de";
import type { KYCModule } from "../../kyclib/module";

export const localeRegistry: Record<string, KYCModule> = {
  uk: new UKModule(),
  br: new BRModule(),
  de: new DEModule(),
};

export const getModule = (locale: string): KYCModule => {
  const mod = localeRegistry[locale];
  if (!mod) throw new Error(`Unknown locale: ${locale}`);
  return mod;
};

export const availableLocales = Object.entries(localeRegistry).map(([key, mod]) => ({
  key, label: mod.label,
}));
