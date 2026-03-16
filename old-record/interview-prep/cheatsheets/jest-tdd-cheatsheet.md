# Jest + React Testing Library + TDD — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Also includes: Capstone project scaffold + TDD workflow you can demo tomorrow

---

## 1. What is TDD? (Interview Answer)

**One-line:** Write the test FIRST (it fails), write the minimum code to pass it, then refactor. Red → Green → Refactor.

```
RED    → Write a test that describes the behavior you want. Run it. It fails.
GREEN  → Write the MINIMUM code to make the test pass. Nothing more.
REFACTOR → Clean up the code. Tests still pass? Good. Move on.

Repeat for the next behavior.
```

**Say this in interview:**
> "TDD flips the workflow — instead of writing code and then testing it, I define the expected behavior first as a test, then write the code to satisfy it. This guarantees every feature has coverage, prevents over-engineering (you only write what the test demands), and gives me confidence to refactor because the tests catch regressions instantly."

**Trade-off:** TDD is slower upfront but saves time in maintenance. Not every line needs TDD — I use it for business logic, utils, and critical user flows. For throwaway prototypes, I skip it.

---

## 2. Jest Fundamentals

**Q: What is Jest? How do you use it?**

**One-line:** Jest is a zero-config JS test runner with built-in assertions, mocking, and coverage.

```
Core API:
├── describe("group name", () => {})     → group related tests
├── it("should do X", () => {})          → single test (alias: test())
├── expect(value).toBe(expected)         → assertion
├── beforeEach(() => {})                 → runs before EACH test
├── afterEach(() => {})                  → cleanup after EACH test
├── beforeAll / afterAll                 → once per describe block
└── jest.fn() / jest.mock()              → mocking
```

**Common Matchers:**
```js
expect(value).toBe(5)                    // strict equality (===)
expect(value).toEqual({ a: 1 })          // deep equality (objects/arrays)
expect(value).toBeTruthy()               // truthy check
expect(value).toBeFalsy()                // falsy check
expect(value).toBeNull()                 // === null
expect(value).toBeUndefined()            // === undefined
expect(value).toContain("item")          // array contains / string includes
expect(value).toHaveLength(3)            // .length === 3
expect(fn).toThrow()                     // function throws error
expect(fn).toThrow("specific message")   // throws with message
expect(fn).toHaveBeenCalled()            // mock was called
expect(fn).toHaveBeenCalledWith(arg)     // mock called with specific args
expect(fn).toHaveBeenCalledTimes(2)      // mock called exactly N times
```

**Async Testing:**
```js
// async/await
it("fetches users", async () => {
  const users = await fetchUsers();
  expect(users).toHaveLength(3);
});

// resolves/rejects
it("resolves with data", () => {
  return expect(fetchUsers()).resolves.toEqual([...]);
});

it("rejects on error", () => {
  return expect(fetchBadUrl()).rejects.toThrow("404");
});
```

---

## 3. Mocking in Jest

**Q: How do you mock in Jest? When and why?**

**One-line:** Mocking isolates the unit under test by replacing dependencies with controlled fakes.

```js
// 1. jest.fn() — mock a single function
const mockFn = jest.fn();
mockFn("hello");
expect(mockFn).toHaveBeenCalledWith("hello");

// Return values
const mockFn = jest.fn().mockReturnValue(42);
const mockAsync = jest.fn().mockResolvedValue({ id: 1, name: "Tijo" });

// 2. jest.mock("module") — mock an entire module
jest.mock("../api/users", () => ({
  fetchUsers: jest.fn().mockResolvedValue([{ id: 1, name: "Tijo" }]),
}));

// 3. jest.spyOn() — spy on existing method (can restore original)
const spy = jest.spyOn(Storage.prototype, "getItem");
spy.mockReturnValue("cached-value");
// ... test ...
spy.mockRestore();  // restore original
```

**When to mock:**
- ✅ API calls (don't hit real servers in tests)
- ✅ Timers (setTimeout, setInterval)
- ✅ Browser APIs (localStorage, navigator)
- ✅ Third-party libraries you don't own
- ❌ Don't mock the thing you're testing
- ❌ Don't mock everything — test real integration where practical

---

## 4. React Testing Library (RTL) Fundamentals

**Q: What is React Testing Library? How is it different from Enzyme?**

**One-line:** RTL tests components the way users interact with them — by visible text, roles, and labels — not by internal implementation.

```
Philosophy: "The more your tests resemble the way your software is used,
             the more confidence they can give you."

Enzyme (old):  test internals — state values, lifecycle methods, shallow render
RTL (modern):  test behavior — what the user sees and does
```

**Core API:**
```js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// render — mounts component into test DOM
render(<Button label="Submit" onClick={handleClick} />);

// screen — query the rendered output
screen.getByText("Submit")              // exact text match (throws if not found)
screen.getByRole("button", { name: "Submit" })  // by ARIA role
screen.getByLabelText("Email")          // by <label> text (forms)
screen.getByPlaceholderText("Search")   // by placeholder
screen.getByTestId("submit-btn")        // by data-testid (last resort)

// Query priority (use in this order):
// 1. getByRole      ← best (accessible, how users/screen readers see it)
// 2. getByLabelText ← forms
// 3. getByText      ← non-interactive elements
// 4. getByTestId    ← last resort when nothing else works
```

**Query Variants:**
```
getBy...    → throws if not found (use when element MUST exist)
queryBy...  → returns null if not found (use to assert absence)
findBy...   → async, waits for element to appear (use after async operations)

getAllBy... / queryAllBy... / findAllBy... → return arrays
```

**User Interactions:**
```js
// fireEvent — low-level (synchronous)
fireEvent.click(screen.getByRole("button"));
fireEvent.change(input, { target: { value: "hello" } });

// userEvent — realistic (recommended, simulates real user behavior)
const user = userEvent.setup();
await user.click(screen.getByRole("button"));
await user.type(screen.getByRole("textbox"), "hello");
await user.clear(input);
await user.selectOptions(select, "option1");
await user.keyboard("{Enter}");
```

**Async Testing in RTL:**
```js
// waitFor — wait for async state updates
await waitFor(() => {
  expect(screen.getByText("Loaded!")).toBeInTheDocument();
});

// findBy — shorthand for waitFor + getBy
const element = await screen.findByText("Loaded!");

// wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});
```

---

## 5. What to Test (Senior Mindset)

**Q: What do you test? What do you NOT test?**

```
TEST (behavior):
✅ Does the component render correctly with given props?
✅ Does clicking a button trigger the expected action?
✅ Does form submission send the right data?
✅ Does error state show when API fails?
✅ Does conditional rendering work (show/hide)?
✅ Does the list update when items are added/removed?
✅ Edge cases: empty state, loading state, error state

DON'T TEST (implementation):
❌ Internal state values (don't check useState values directly)
❌ Component instance methods
❌ CSS class names or inline styles
❌ Implementation details (HOW it works internally)
❌ Third-party library internals (trust them)
❌ Snapshot tests for everything (brittle, low value)
```

**Say this in interview:**
> "I test behavior, not implementation. I ask: 'If I refactor the internals but the user experience stays the same, should my tests break?' If the answer is no, the test is good. If yes, it's testing implementation details and will be fragile."

---

## 6. Testing Patterns — Senior Level

### Pattern 1: Testing a Form
```
ARRANGE → Render the form
ACT     → Type into inputs, click submit
ASSERT  → onSubmit called with correct data, form resets/shows success
```

### Pattern 2: Testing API Integration
```
ARRANGE → Mock the API, render component
ACT     → Wait for data to load
ASSERT  → Loading state shown, then data rendered, error state on failure
```

### Pattern 3: Testing Conditional Rendering
```
ARRANGE → Render with prop X
ASSERT  → Element A visible, Element B not visible
RE-ARRANGE → Render with prop Y
ASSERT  → Element A not visible, Element B visible
```

### Pattern 4: Testing Custom Hooks
```js
import { renderHook, act } from "@testing-library/react";

it("increments counter", () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

### Pattern 5: Testing with Context/Providers
```js
function renderWithProviders(ui, { theme = "light" } = {}) {
  return render(
    <ThemeProvider value={theme}>
      {ui}
    </ThemeProvider>
  );
}

it("renders dark mode", () => {
  renderWithProviders(<Header />, { theme: "dark" });
  expect(screen.getByRole("banner")).toHaveClass("dark");
});
```

---

## 7. Test File Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx        ← co-located test
│   │   └── Button.module.css
│   ├── TodoList/
│   │   ├── TodoList.tsx
│   │   ├── TodoList.test.tsx
│   │   └── TodoList.module.css
├── hooks/
│   ├── useDebounce.ts
│   └── useDebounce.test.ts
├── utils/
│   ├── formatDate.ts
│   └── formatDate.test.ts
├── __mocks__/                     ← manual mocks for modules
│   └── api.ts
└── test-utils/
    └── render.tsx                 ← custom render with providers
```

**Naming:** `ComponentName.test.tsx` co-located next to the file it tests.

---

## 8. Coverage & CI

```json
// package.json or jest.config.js
{
  "jest": {
    "collectCoverageFrom": ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

```bash
# Run tests
npx jest                    # all tests
npx jest --watch            # watch mode (re-runs on file change)
npx jest --coverage         # with coverage report
npx jest Button.test.tsx    # single file
```

**Say this in interview:**
> "I set coverage thresholds in CI — 80% is my baseline. But coverage percentage alone isn't the goal. 100% coverage with bad tests is worse than 80% coverage with meaningful behavior tests. I focus on critical paths first."

---

## 9. Quick-Fire Interview Answers

| Question | Senior Answer |
|----------|--------------|
| Jest vs Mocha vs Vitest? | Jest: zero-config, built-in mocking, most popular for React. Vitest: faster (Vite-native), Jest-compatible API, growing. Mocha: flexible but needs plugins for everything. I'd pick Jest for existing projects, Vitest for new Vite projects. |
| Unit vs Integration vs E2E? | Unit: test one function/component in isolation. Integration: test components working together. E2E: test full user flow in a real browser (Cypress/Playwright). Testing trophy: more integration, fewer unit, fewest E2E. |
| RTL vs Enzyme? | RTL tests user behavior (what they see/click). Enzyme tests internals (state, lifecycle). RTL is the React team's recommendation. Enzyme is legacy — not maintained for React 18+. |
| What is a snapshot test? | Serializes component output, saves to file, compares on next run. Good for catching accidental changes. Bad when overused — devs just update snapshots without reviewing. I use them sparingly for stable UI like icons or static content. |
| How do you test async code? | `async/await` in test, `waitFor()` for state updates, `findBy` queries for elements that appear after async. Mock API calls with `jest.mock()` or MSW. |
| What is MSW? | Mock Service Worker — intercepts network requests at the service worker level. More realistic than jest.mock because it tests your actual fetch/axios code. Great for integration tests. |
| How do you test a custom hook? | `renderHook()` from RTL. Wrap state updates in `act()`. Assert on `result.current`. |
| Test a component with Redux? | Wrap in a real store with test data: `render(<Provider store={testStore}><Component /></Provider>)`. Test behavior, not Redux internals. |

---

## 10. TDD Red-Green-Refactor — Live Demo Script

> If they ask you to demonstrate TDD or if you want to practice tomorrow:

**Example: Build a `formatPrice(cents)` utility with TDD**

```
STEP 1 (RED): Write the first test
  → it("formats 0 cents as $0.00")
  → expect(formatPrice(0)).toBe("$0.00")
  → Run test → FAILS (function doesn't exist)

STEP 2 (GREEN): Write minimum code
  → function formatPrice(cents) { return "$0.00"; }
  → Run test → PASSES

STEP 3 (RED): Write next test
  → it("formats 999 cents as $9.99")
  → Run test → FAILS (returns "$0.00")

STEP 4 (GREEN): Make it work
  → return "$" + (cents / 100).toFixed(2);
  → Run both tests → PASS

STEP 5 (RED): Edge case
  → it("formats negative cents as -$5.00")
  → Run test → FAILS

STEP 6 (GREEN): Handle negatives
  → Add the negative handling
  → All tests PASS

STEP 7 (REFACTOR): Clean up if needed
  → Tests still pass? Done.
```

---

# 🚀 CAPSTONE PROJECT: Task Manager with TDD

> **Purpose:** A project you can reference in interview: "I built a Task Manager using TDD with Jest and RTL — every feature was test-first."
>
> **Tomorrow's goal:** Scaffold the project + write first 3-4 test-first features.

---

## Scaffold Steps (Do Tomorrow)

### Step 1: Create the Project
```bash
npx create-react-app task-manager --template typescript
cd task-manager
# RTL is already included with CRA
# Jest is already included with CRA
```

### Step 2: Clean Up CRA Boilerplate
```
DELETE: App.test.tsx, logo.svg, App.css (unnecessary defaults)
KEEP:   setupTests.ts (imports @testing-library/jest-dom)
KEEP:   reportWebVitals.ts
```

### Step 3: Create Folder Structure
```
src/
├── components/
│   ├── TaskForm/
│   │   ├── TaskForm.tsx
│   │   └── TaskForm.test.tsx
│   ├── TaskList/
│   │   ├── TaskList.tsx
│   │   └── TaskList.test.tsx
│   ├── TaskItem/
│   │   ├── TaskItem.tsx
│   │   └── TaskItem.test.tsx
│   └── TaskFilter/
│       ├── TaskFilter.tsx
│       └── TaskFilter.test.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useTasks.test.ts
├── utils/
│   ├── taskHelpers.ts
│   └── taskHelpers.test.ts
├── types/
│   └── task.ts
├── test-utils/
│   └── render.tsx           ← custom render if you add context later
├── App.tsx
└── App.test.tsx
```

### Step 4: Define Types First
```
// types/task.ts
Task = { id: string, title: string, status: "todo" | "in-progress" | "done", priority: "low" | "medium" | "high", createdAt: Date }
```

### Step 5: TDD Feature List (Build in This Order)

```
FEATURE 1: TaskForm — Add a new task
  TEST FIRST:
  ✓ renders an input and submit button
  ✓ typing updates the input value
  ✓ submitting calls onAdd with the task title
  ✓ input clears after submit
  ✓ does NOT submit if input is empty
  THEN CODE: Build TaskForm.tsx to pass all 5 tests

FEATURE 2: TaskList — Display tasks
  TEST FIRST:
  ✓ renders "No tasks yet" when list is empty
  ✓ renders all tasks in the list
  ✓ each task shows its title and status
  THEN CODE: Build TaskList.tsx to pass all 3 tests

FEATURE 3: TaskItem — Toggle & Delete
  TEST FIRST:
  ✓ renders task title
  ✓ clicking "Done" calls onToggle with task id
  ✓ clicking "Delete" calls onDelete with task id
  ✓ completed task has line-through style or "done" label
  THEN CODE: Build TaskItem.tsx to pass all 4 tests

FEATURE 4: TaskFilter — Filter by status
  TEST FIRST:
  ✓ renders All, Todo, Done filter buttons
  ✓ clicking "Done" calls onFilter with "done"
  ✓ active filter button is highlighted
  THEN CODE: Build TaskFilter.tsx to pass all 3 tests

FEATURE 5: useTasks Hook — State logic
  TEST FIRST:
  ✓ starts with empty task list
  ✓ addTask adds a task with correct shape
  ✓ toggleTask changes status
  ✓ deleteTask removes the task
  ✓ filterTasks returns only matching status
  THEN CODE: Build useTasks.ts to pass all 5 tests

FEATURE 6: App Integration
  TEST FIRST:
  ✓ user can type a task, submit, see it in the list
  ✓ user can mark task done, see it update
  ✓ user can delete a task, see it disappear
  ✓ user can filter to see only done tasks
  THEN CODE: Wire everything in App.tsx
```

### Step 6: Run & Verify
```bash
npm test -- --coverage
# Target: all tests pass, 90%+ coverage
```

### Step 7: (Bonus) Add to Your GitHub
```bash
git init
git add .
git commit -m "Task Manager built with TDD — Jest + RTL"
# Push to GitHub — link in resume if asked "show me a project"
```

---

## Interview Story Script

> When they ask "Have you done TDD?" or "How do you test React components?":

> "Yes — I recently built a Task Manager using strict TDD with Jest and React Testing Library. Every feature started as a failing test. For example, for the TaskForm, I first wrote tests: renders an input and button, submit calls onAdd with the title, input clears after submit, empty input doesn't submit. Then I wrote the minimum component to pass those tests.
>
> I test behavior, not implementation — I use RTL's getByRole and getByText to query the DOM the way a user would. I mock API calls with jest.fn() and test loading/error/success states. I set coverage thresholds at 80% in CI so no PR merges without adequate coverage.
>
> The key lesson from TDD: it forces you to think about the API of your component before you build it. The tests ARE the spec."

---

*Last updated: Feb 26, 2026 — Experion Senior ReactJS Interview Prep*
