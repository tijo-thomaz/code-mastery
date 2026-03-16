import { KYCModule } from "../../../kyclib/module";
import { exactLength } from "../../../formlib/validators";
import { brConfig } from "./config";
import { brOverrides } from "./overrides";

export class BRModule extends KYCModule {
  locale = brConfig.locale;
  label = brConfig.label;
  provider = brConfig.provider;
  kycType = brConfig.kycType;
  steps = brConfig.steps;
  fields = brConfig.fields;
  uiOverrides = brOverrides;
  validationOverrides = {
    fieldNameValidators: {
      cpf: [exactLength(11, "CPF must have 11 digits")],
    },
  };
}
