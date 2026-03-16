import { KYCModule } from "../../../kyclib/module";
import { ukConfig } from "./config";
import { ukOverrides } from "./overrides";

export class UKModule extends KYCModule {
  locale = ukConfig.locale;
  label = ukConfig.label;
  provider = ukConfig.provider;
  kycType = ukConfig.kycType;
  steps = ukConfig.steps;
  fields = ukConfig.fields;
  uiOverrides = ukOverrides;
}
