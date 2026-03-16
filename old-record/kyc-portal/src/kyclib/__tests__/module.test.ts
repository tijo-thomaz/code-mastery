import { KYCModule } from "../module";
import type { FieldConfig, FieldValidator } from "../../formlib/types";
import { minLength, exactLength, email } from "../../formlib/validators";
import type { KYCProvider, KYCType } from "../types";

// Concrete test module
class TestModule extends KYCModule {
  locale = "test";
  label = "Test";
  provider: KYCProvider = "onfido";
  kycType: KYCType = "standard";
  steps = ["Step 1"];
  fields: Record<string, FieldConfig[]> = {
    "Step 1": [
      { type: "text", name: "name", label: "Name", required: true },
      { type: "text", name: "code", label: "Code", required: false, pattern: "[A-Z]{3}" },
      { type: "date", name: "dob", label: "DOB", required: true, minAge: 18 },
      { type: "liveness", name: "face", label: "Face", required: true, provider: "onfido" },
    ],
  };
}

describe("KYCModule.validate — built-in type validators", () => {
  const mod = new TestModule();
  const field = (name: string) => mod.fields["Step 1"].find((f) => f.name === name)!;

  it("fails required empty fields", () => {
    expect(mod.validate("name", "", field("name"))).toBe("This field is required");
    expect(mod.validate("name", undefined, field("name"))).toBe("This field is required");
  });

  it("passes required fields with value", () => {
    expect(mod.validate("name", "Alice", field("name"))).toBeNull();
  });

  it("validates text pattern", () => {
    expect(mod.validate("code", "abc", field("code"))).toBe("Invalid format");
    expect(mod.validate("code", "ABC", field("code"))).toBeNull();
  });

  it("validates date minAge", () => {
    const thisYear = new Date().getFullYear();
    expect(mod.validate("dob", `${thisYear - 10}-01-01`, field("dob"))).toBe("Must be at least 18");
    expect(mod.validate("dob", `${thisYear - 20}-01-01`, field("dob"))).toBeNull();
  });

  it("validates liveness", () => {
    expect(mod.validate("face", "", field("face"))).toBe("This field is required");
    expect(mod.validate("face", "pending", field("face"))).toBe("Face verification required");
    expect(mod.validate("face", "passed", field("face"))).toBeNull();
  });
});

describe("KYCModule.validate — field.validators (custom per-field)", () => {
  const mod = new TestModule();

  it("runs custom validators from field config", () => {
    const fieldWithValidator: FieldConfig = {
      type: "text", name: "email", label: "Email", required: true,
      validators: [email],
    };
    expect(mod.validate("email", "not-an-email", fieldWithValidator)).toBe("Invalid email address");
    expect(mod.validate("email", "a@b.com", fieldWithValidator)).toBeNull();
  });

  it("runs multiple custom validators in order", () => {
    const fieldWithValidators: FieldConfig = {
      type: "text", name: "token", label: "Token", required: false,
      validators: [
        minLength(3, "Too short"),
        (value) => value && value.includes(" ") ? "No spaces" : null,
      ],
    };
    expect(mod.validate("token", "ab", fieldWithValidators)).toBe("Too short");
    expect(mod.validate("token", "a b c", fieldWithValidators)).toBe("No spaces");
    expect(mod.validate("token", "abc", fieldWithValidators)).toBeNull();
  });
});

describe("KYCModule.validate — validationOverrides", () => {
  it("applies fieldNameValidators from module", () => {
    class OverrideModule extends TestModule {
      validationOverrides = {
        fieldNameValidators: {
          name: [minLength(5, "Name too short")],
        },
      };
    }
    const mod = new OverrideModule();
    const field = mod.fields["Step 1"].find((f) => f.name === "name")!;
    expect(mod.validate("name", "Al", field)).toBe("Name too short");
    expect(mod.validate("name", "Alice", field)).toBeNull();
  });

  it("applies fieldTypeValidators from module", () => {
    const customTextValidator: FieldValidator = (value) =>
      value && value === value.toLowerCase() ? "Must contain uppercase" : null;

    class TypeOverrideModule extends TestModule {
      validationOverrides = {
        fieldTypeValidators: { text: [customTextValidator] },
      };
    }
    const mod = new TypeOverrideModule();
    const field = mod.fields["Step 1"].find((f) => f.name === "name")!;
    expect(mod.validate("name", "alice", field)).toBe("Must contain uppercase");
    expect(mod.validate("name", "Alice", field)).toBeNull();
  });

  it("runs built-in type validators before overrides", () => {
    class PatternPlusOverride extends TestModule {
      validationOverrides = {
        fieldNameValidators: {
          code: [(value) => value && value === "ZZZ" ? "ZZZ not allowed" : null],
        },
      };
    }
    const mod = new PatternPlusOverride();
    const field = mod.fields["Step 1"].find((f) => f.name === "code")!;
    // Pattern fails first (built-in)
    expect(mod.validate("code", "abc", field)).toBe("Invalid format");
    // Pattern passes, override rejects
    expect(mod.validate("code", "ZZZ", field)).toBe("ZZZ not allowed");
    // Both pass
    expect(mod.validate("code", "ABC", field)).toBeNull();
  });
});

describe("KYCModule.validate — subclass validateByType override", () => {
  it("allows subclass to override built-in type validators", () => {
    class StrictModule extends TestModule {
      protected validateByType(value: string | undefined, field: FieldConfig): string | null {
        const base = super.validateByType(value, field);
        if (base) return base;
        if (field.type === "text" && value && value.length > 50) return "Max 50 chars";
        return null;
      }
    }
    const mod = new StrictModule();
    const field = mod.fields["Step 1"].find((f) => f.name === "name")!;
    expect(mod.validate("name", "x".repeat(51), field)).toBe("Max 50 chars");
    expect(mod.validate("name", "Alice", field)).toBeNull();
  });
});

describe("formlib/validators helpers", () => {
  it("minLength", () => {
    const v = minLength(3);
    expect(v("ab", {} as FieldConfig)).toBe("Must be at least 3 characters");
    expect(v("abc", {} as FieldConfig)).toBeNull();
  });

  it("exactLength strips non-digits", () => {
    const v = exactLength(11, "Must be 11 digits");
    expect(v("123.456.789-0", {} as FieldConfig)).toBe("Must be 11 digits");
    expect(v("123.456.789-01", {} as FieldConfig)).toBeNull();
  });

  it("email", () => {
    expect(email("bad", {} as FieldConfig)).toBe("Invalid email address");
    expect(email("a@b.com", {} as FieldConfig)).toBeNull();
  });
});
