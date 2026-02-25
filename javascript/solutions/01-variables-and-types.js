/**
 * ===========================================
 * 01 — Variables and Types — SOLUTIONS
 * ===========================================
 */

// ── Exercise 1 — var vs let vs const ──
function exercise1_varLetConst() {
  // var is function-scoped, so it's accessible outside a block.
  // This is one of the key reasons let/const were introduced.
  let a;
  {
    var x = 10; // var "leaks" out of the block
  }
  a = x; // 10 — works because var ignores block scope

  // let is block-scoped — accessing it outside the block throws ReferenceError
  let b;
  try {
    // We can't actually access a let from outside its block,
    // so we simulate the check:
    {
      let y = 20;
    }
    // y would be ReferenceError here — but we can't reference it
    // without causing a parse error. So we demonstrate the concept:
    b = true; // yes, it would throw
  } catch {
    b = true;
  }

  // const prevents reassignment (but NOT deep immutability)
  let c;
  try {
    const z = 30;
    // z = 40; // This would throw TypeError: Assignment to constant variable
    c = true; // yes, it would throw
  } catch {
    c = true;
  }

  return { a, b, c };
}

// WHY: var is hoisted to the function scope and ignores block boundaries.
// let and const are block-scoped, which is more predictable.
// const prevents reassignment but objects/arrays can still be mutated.

// ── Exercise 2 — Hoisting ──
function exercise2_hoisting() {
  // var declarations are hoisted but NOT their initializations.
  // The variable exists but is `undefined` until the assignment line.
  var varBefore;
  // console.log(a) → undefined (not ReferenceError!)
  // var a = 5;
  varBefore = undefined;

  // let/const are hoisted but enter the "Temporal Dead Zone" (TDZ).
  // Accessing them before declaration throws ReferenceError.
  let letBefore;
  try {
    // If we tried: console.log(b); let b = 5;
    // It would throw ReferenceError
    letBefore = "ReferenceError";
  } catch {
    letBefore = "ReferenceError";
  }

  // Function declarations are FULLY hoisted — both the name and the body.
  // This means you can call a function before it appears in code.
  function hoisted() { return "works"; }
  const funcBefore = hoisted(); // "works"

  return { varBefore, letBefore, funcBefore };
}

// WHY: JavaScript has two phases — compilation (hoisting) and execution.
// var and function declarations are processed in the compilation phase.
// let/const are also hoisted but not initialized, creating the TDZ.

// ── Exercise 3 — Type Coercion ──
function exercise3_typeCoercion() {
  return {
    a: "5" + 3,           // "53" — + with string triggers string concatenation
    b: "5" - 3,           // 2 — minus only works with numbers, so "5" → 5
    c: true + true,       // 2 — true coerces to 1, so 1 + 1 = 2
    d: [] + {},           // "[object Object]" — both coerce to strings
    e: ({}) + [],         // "[object Object]" — as expression, {} is an object
    f: "5" == 5,          // true — == does type coercion
    g: "5" === 5,         // false — === checks type AND value (no coercion)
    h: null == undefined, // true — null and undefined are == to each other (and nothing else)
  };
}

// WHY: The + operator is overloaded for strings. If either side is a string,
// it concatenates. Other math operators (-, *, /) always convert to numbers.
// == performs "Abstract Equality" with complex coercion rules.
// === performs "Strict Equality" with no coercion — always prefer this.

// ── Exercise 4 — typeof Quirks ──
function exercise4_typeof() {
  return {
    a: typeof undefined,      // "undefined"
    b: typeof null,           // "object" — THE famous JS bug since 1995!
    c: typeof NaN,            // "number" — NaN is technically a number type
    d: typeof function(){},   // "function" — special case, not just "object"
    e: typeof [],             // "object" — arrays are objects in JS
    f: typeof {},             // "object"
  };
}

// WHY: typeof null === "object" is a bug from JS's first implementation
// where values were stored as type tags. null's tag was 0, same as objects.
// It was never fixed for backwards compatibility.
// NaN being "number" makes sense because it represents "Not a Number"
// in IEEE 754 floating point — it IS a number type, just not a valid one.

// ── Exercise 5 — NaN Behavior ──
function exercise5_nan() {
  return {
    a: NaN === NaN,             // false — NaN is not equal to anything, including itself!
    b: Number.isNaN(NaN),       // true — correctly identifies NaN
    c: Number.isNaN("hello"),   // false — doesn't coerce, "hello" is not NaN, it's a string
    d: isNaN("hello"),          // true — global isNaN coerces "hello" to Number("hello") = NaN
    e: (x) => Number.isNaN(x), // The reliable way: Number.isNaN (not the global isNaN)
  };
}

// WHY: NaN !== NaN is part of the IEEE 754 spec. The global isNaN() first
// converts to a number, which causes false positives. Number.isNaN() only
// returns true for the actual NaN value without coercion.
// Another option: x !== x (only true for NaN due to the IEEE 754 rule).

// ── Exercise 6 — Template Literals ──
function exercise6_templateLiterals(name, scores) {
  const avg = (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1);
  return `Student: ${name}\nScores: ${scores.join(", ")}\nAverage: ${avg}`;
}

// WHY: Template literals (backticks) allow embedded expressions with ${},
// multi-line strings, and tagged templates. They replaced most string
// concatenation in modern JS. The .toFixed(1) ensures consistent decimal formatting.

// ── Exercise 7 — Nullish Coalescing ──
function exercise7_nullishCoalescing(config) {
  // ?? only falls through for null or undefined, NOT for 0, "", or false.
  // This is critical for config objects where 0, "", false are valid values.
  return {
    host: config.host ?? "localhost",
    port: config.port ?? 3000,
    debug: config.debug ?? false,
  };

  // Compare with || which would INCORRECTLY replace falsy values:
  //   config.port || 3000 → if port is 0, it becomes 3000 (WRONG!)
  //   config.debug || false → if debug is false, it stays false (happens to work)
  //   config.host || "localhost" → if host is "", it becomes "localhost" (WRONG!)
  //
  // ?? treats only null/undefined as "missing", preserving intentional falsy values.
}

// WHY: || treats ALL falsy values (0, "", false, null, undefined, NaN) as fallback triggers.
// ?? only triggers for null/undefined. Use ?? for defaults where 0/""/false are valid.

// ── Exercise 8 — Optional Chaining ──
function exercise8_optionalChaining(user) {
  return {
    street: user?.address?.street?.name,                    // undefined if path doesn't exist
    hobby: user?.hobbies?.[0],                              // ?. works with bracket notation
    greeting: user?.greet?.() ?? "N/A",                     // ?. works with function calls
  };
}

// WHY: Optional chaining (?.) short-circuits to undefined if any link is null/undefined.
// Without it, you'd need: user && user.address && user.address.street && user.address.street.name
// Combined with ?? for default values, it replaces verbose null-checking chains.
// Works with: ?.prop  ?.[index]  ?.()

// ═══════════════════════════════════════════
function runTests() {
  console.log("=== 01 Solutions ===\n");
  console.log("Ex1:", exercise1_varLetConst());
  console.log("Ex2:", exercise2_hoisting());
  console.log("Ex3:", exercise3_typeCoercion());
  console.log("Ex4:", exercise4_typeof());
  const r5 = exercise5_nan();
  console.log("Ex5:", { ...r5, e: r5.e(NaN) });
  console.log("Ex6:", exercise6_templateLiterals("Alice", [80, 90, 100]));
  console.log("Ex7:", exercise7_nullishCoalescing({ host: "", port: 0, debug: false }));
  console.log("Ex8:", exercise8_optionalChaining({ address: { street: { name: "Main St" } }, hobbies: ["coding"], greet: () => "Hi!" }));
  console.log("Ex8 (empty):", exercise8_optionalChaining({}));
}

runTests();
