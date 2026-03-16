import { KYCModule } from "../../../kyclib/module";
import { deConfig } from "./config";

export class DEModule extends KYCModule {
  locale = deConfig.locale;
  label = deConfig.label;
  provider = deConfig.provider;
  kycType = deConfig.kycType;
  steps = deConfig.steps;
  fields = deConfig.fields;
  // No uiOverrides — uses all default UI
}
