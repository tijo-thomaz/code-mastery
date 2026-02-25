# TypeScript Mastery

A comprehensive TypeScript learning path covering TS 5.x features, type-level programming, and real-world patterns.

## Setup

### Prerequisites

- Node.js 18+
- TypeScript 5.x (`npm install -g typescript`)

### tsconfig.json

Create a `tsconfig.json` in this directory:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["exercises/**/*.ts", "solutions/**/*.ts"]
}
```

### Running Exercises

```bash
# Type-check a specific exercise
npx tsc --noEmit exercises/01-basic-types.ts

# Type-check all exercises
npx tsc --noEmit

# Run a file with ts-node or tsx
npx tsx exercises/01-basic-types.ts
```

## Exercises

| # | File | Topics | Difficulty |
|---|------|--------|------------|
| 01 | [Basic Types](exercises/01-basic-types.ts) | Annotations, interfaces, unions, enums, tuples, unknown vs any | ⭐ Beginner |
| 02 | [Generics](exercises/02-generics.ts) | Generic functions, constraints, conditional/mapped types, infer | ⭐⭐ Intermediate |
| 03 | [Utility Types](exercises/03-utility-types.ts) | Partial, Required, Pick, Omit, Record, ReturnType — implement from scratch | ⭐⭐ Intermediate |
| 04 | [Advanced Patterns](exercises/04-advanced-patterns.ts) | Discriminated unions, type guards, overloads, satisfies, branded types | ⭐⭐⭐ Advanced |

## Solutions

Full solutions with explanations are in the [solutions/](solutions/) directory.

## Other Resources

- [Speed Typing Snippets](speed-typing/snippets.md) — 15+ TS snippets for muscle memory practice
- [Common Interview Questions](interview-questions/common-questions.md) — 12 TS interview questions with answers
- [Failed Interview Log](interview-questions/failed-interviews.md) — Track and learn from mistakes

## TS 5.x Features Covered

- `satisfies` operator (5.0)
- `const` type parameters (5.0)
- Decorators (stage 3, 5.0)
- `using` declarations / Explicit Resource Management (5.2)
- Regular expression checking (5.5)
- Template literal types
- Discriminated union narrowing improvements
