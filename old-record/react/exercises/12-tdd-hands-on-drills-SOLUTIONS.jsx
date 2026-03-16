/**
 * ═══════════════════════════════════════════════════════════════════
 * 12 — TDD Hands-On Drills — SOLUTIONS
 * ═══════════════════════════════════════════════════════════════════
 * EXPERION ROUND 2 — "Write tests for this form" / "Show me TDD"
 *
 * These are COMPLETE test files you can write from memory.
 * Each drill = a real interview scenario with the test + component.
 *
 * 🧠 Pattern for EVERY test:
 *    ARRANGE → render the component
 *    ACT     → simulate user action
 *    ASSERT  → check the result
 *
 * ⏱️ Practice writing each test file from memory in under 5 min.
 * ═══════════════════════════════════════════════════════════════════
 */


// ═══════════════════════════════════════════════════════════════
// DRILL 1 ⭐⭐⭐ | TDD a Login Form
// ═══════════════════════════════════════════════════════════════
// "Build a login form with TDD" — THE most likely question
//
// THE TDD CYCLE — SAY THIS OUT LOUD:
//
// "First, I'll write the tests that define the behavior:
//  1. Renders email and password inputs
//  2. Renders a submit button
//  3. Calls onSubmit with email and password
//  4. Shows error if email is empty
//  5. Shows error if password is too short
//  6. Disables button while submitting
//
//  Then I'll build the component to pass each test."
// ═══════════════════════════════════════════════════════════════

// ---------- THE TEST FILE: LoginForm.test.tsx ----------

/*
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  // --- RENDERING ---

  it('renders email and password inputs', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // --- HAPPY PATH ---

  it('calls onSubmit with email and password when form is valid', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'tijo@test.com',
      password: 'password123',
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  // --- VALIDATION ---

  it('shows error if email is empty on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error if password is less than 6 characters', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
    await user.type(screen.getByLabelText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // --- LOADING STATE ---

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    // onSubmit returns a promise that takes time
    mockOnSubmit.mockImplementation(() => new Promise(r => setTimeout(r, 1000)));

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  // --- ERROR FROM SERVER ---

  it('shows server error message on submit failure', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
*/

// ---------- THE COMPONENT: LoginForm.tsx ----------
// This is what you BUILD after writing the tests

import React, { useState } from 'react';

export function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p role="alert">{errors.password}</p>}
      </div>

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

// 🔥 SAY THIS WHILE WRITING TESTS:
// "I start with the simplest test — does it render the right elements?
// Then the happy path — valid submit calls onSubmit with correct data.
// Then validation — empty fields show errors, onSubmit NOT called.
// Then edge cases — loading state, server errors.
// I query by ROLE and LABEL, not test IDs — that's the RTL philosophy."


// ═══════════════════════════════════════════════════════════════
// DRILL 2 ⭐⭐⭐ | TDD a Search Component with API
// ═══════════════════════════════════════════════════════════════
// "Write tests for a component that fetches and displays data"
// Tests: loading → data → error states
// ═══════════════════════════════════════════════════════════════

// ---------- THE TEST FILE: UserSearch.test.tsx ----------

/*
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSearch } from './UserSearch';

// Mock the API module
jest.mock('../api/users', () => ({
  searchUsers: jest.fn(),
}));
import { searchUsers } from '../api/users';

describe('UserSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a search input', () => {
    render(<UserSearch />);
    expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument();
  });

  it('shows loading state while searching', async () => {
    const user = userEvent.setup();
    searchUsers.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<UserSearch />);
    await user.type(screen.getByPlaceholderText(/search users/i), 'Tijo');

    await waitFor(() => {
      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValue([
      { id: 1, name: 'Tijo', email: 'tijo@test.com' },
      { id: 2, name: 'Alice', email: 'alice@test.com' },
    ]);

    render(<UserSearch />);
    await user.type(screen.getByPlaceholderText(/search users/i), 'test');

    await waitFor(() => {
      expect(screen.getByText('Tijo')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('shows "No results" when search returns empty', async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValue([]);

    render(<UserSearch />);
    await user.type(screen.getByPlaceholderText(/search users/i), 'xyz');

    await waitFor(() => {
      expect(screen.getByText(/no results/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    const user = userEvent.setup();
    searchUsers.mockRejectedValue(new Error('Network error'));

    render(<UserSearch />);
    await user.type(screen.getByPlaceholderText(/search users/i), 'test');

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('debounces API calls', async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValue([]);
    jest.useFakeTimers();

    render(<UserSearch />);
    await user.type(screen.getByPlaceholderText(/search users/i), 'test');

    // API should NOT be called immediately
    expect(searchUsers).not.toHaveBeenCalled();

    // Fast-forward debounce timer
    jest.advanceTimersByTime(300);

    expect(searchUsers).toHaveBeenCalledWith('test');
    expect(searchUsers).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
*/

// 🔥 SAY THIS: "For async components, I test the three states:
// loading, success, error. I mock the API at the module level with
// jest.mock(). For debouncing, I use jest.useFakeTimers() to control
// time. I use findBy or waitFor for elements that appear after async."


// ═══════════════════════════════════════════════════════════════
// DRILL 3 ⭐⭐⭐ | TDD a TodoList (Full CRUD)
// ═══════════════════════════════════════════════════════════════
// "Write tests for a todo app" — covers add, toggle, delete
// This is INTEGRATION testing — multiple components working together
// ═══════════════════════════════════════════════════════════════

// ---------- THE TEST FILE: TodoApp.test.tsx ----------

/*
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from './TodoApp';

describe('TodoApp', () => {
  it('renders with empty state message', () => {
    render(<TodoApp />);
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Buy groceries');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add a todo/i)).toHaveValue('');
  });

  it('does not add empty todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('adds todo on Enter key', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Walk the dog{Enter}');

    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
  });

  it('toggles a todo between done and not done', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    // Add a todo
    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Exercise{Enter}');

    // Toggle it
    await user.click(screen.getByText('Exercise'));

    // Check it's marked done (line-through or checkbox)
    expect(screen.getByText('Exercise')).toHaveStyle('text-decoration: line-through');

    // Toggle back
    await user.click(screen.getByText('Exercise'));
    expect(screen.getByText('Exercise')).not.toHaveStyle('text-decoration: line-through');
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Read a book{Enter}');
    expect(screen.getByText('Read a book')).toBeInTheDocument();

    // Delete
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.queryByText('Read a book')).not.toBeInTheDocument();
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('shows correct count of remaining todos', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Task 1{Enter}');
    await user.type(screen.getByPlaceholderText(/add a todo/i), 'Task 2{Enter}');

    expect(screen.getByText(/2 items left/i)).toBeInTheDocument();

    // Complete one
    await user.click(screen.getByText('Task 1'));

    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });
});
*/

// 🔥 SAY THIS: "This is an integration test — I test the full user flow,
// not individual components. Add a todo, see it appear. Toggle it, see it
// change. Delete it, see it disappear. I use queryByText to assert ABSENCE
// (returns null instead of throwing). This single test file covers 90% of
// the app's critical behavior."


// ═══════════════════════════════════════════════════════════════
// DRILL 4 ⭐⭐⭐ | Testing a Custom Hook
// ═══════════════════════════════════════════════════════════════
// "How do you test a custom hook?"
// Uses renderHook from @testing-library/react
// ═══════════════════════════════════════════════════════════════

// ---------- THE HOOK: useCounter.ts ----------

function useCounter(initial = 0) {
  const [count, setCount] = React.useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}

// ---------- THE TEST FILE: useCounter.test.ts ----------

/*
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('defaults to 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements the count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(13);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
*/

// 🔥 SAY THIS: "renderHook lets me test hooks outside of components.
// result.current gives me the hook's return value. act() wraps state
// updates to ensure React processes them before I assert. This is the
// same act() that RTL uses internally — I only need it explicitly
// with renderHook because there's no component to render."


// ═══════════════════════════════════════════════════════════════
// DRILL 5 ⭐⭐⭐⭐ | TDD a Registration Form with Validation
// ═══════════════════════════════════════════════════════════════
// THE FULL DEMO — if they say "show me TDD for a form"
// Write these tests ONE AT A TIME, building the component after each
// ═══════════════════════════════════════════════════════════════

// ---------- STEP-BY-STEP TDD (Say this out loud) ----------

// STEP 1 (RED): "First test — does it render the fields?"
/*
it('renders name, email, password fields and submit button', () => {
  render(<RegisterForm onSubmit={jest.fn()} />);

  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
});
*/
// NOW BUILD: A form with 3 labeled inputs and a button. That's it.

// STEP 2 (RED): "Happy path — valid submission"
/*
it('submits form data when all fields are valid', async () => {
  const onSubmit = jest.fn();
  const user = userEvent.setup();
  render(<RegisterForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/name/i), 'Tijo');
  await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
  await user.type(screen.getByLabelText(/password/i), 'SecurePass1');
  await user.click(screen.getByRole('button', { name: /register/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: 'Tijo',
    email: 'tijo@test.com',
    password: 'SecurePass1',
  });
});
*/
// NOW BUILD: handleSubmit that calls onSubmit with form values.

// STEP 3 (RED): "Validation — empty name"
/*
it('shows error when name is empty', async () => {
  const user = userEvent.setup();
  render(<RegisterForm onSubmit={jest.fn()} />);

  await user.click(screen.getByRole('button', { name: /register/i }));

  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
*/
// NOW BUILD: validate() function that checks name.

// STEP 4 (RED): "Validation — invalid email"
/*
it('shows error for invalid email', async () => {
  const user = userEvent.setup();
  render(<RegisterForm onSubmit={jest.fn()} />);

  await user.type(screen.getByLabelText(/name/i), 'Tijo');
  await user.type(screen.getByLabelText(/email/i), 'not-an-email');
  await user.type(screen.getByLabelText(/password/i), 'SecurePass1');
  await user.click(screen.getByRole('button', { name: /register/i }));

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
*/

// STEP 5 (RED): "Validation — weak password"
/*
it('shows error if password has no uppercase letter', async () => {
  const user = userEvent.setup();
  render(<RegisterForm onSubmit={jest.fn()} />);

  await user.type(screen.getByLabelText(/name/i), 'Tijo');
  await user.type(screen.getByLabelText(/email/i), 'tijo@test.com');
  await user.type(screen.getByLabelText(/password/i), 'nouppercase1');
  await user.click(screen.getByRole('button', { name: /register/i }));

  expect(screen.getByText(/must contain an uppercase/i)).toBeInTheDocument();
});
*/

// STEP 6 (RED): "Real-time validation — error clears when fixed"
/*
it('clears error when user fixes the field', async () => {
  const user = userEvent.setup();
  render(<RegisterForm onSubmit={jest.fn()} />);

  // Submit empty → error appears
  await user.click(screen.getByRole('button', { name: /register/i }));
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();

  // Type in name → error disappears
  await user.type(screen.getByLabelText(/name/i), 'Tijo');
  expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
});
*/

// 🔥 SAY THIS: "This is my TDD workflow: I write ONE test, run it
// (RED), build the minimum code to pass (GREEN), then write the next
// test. Each test adds one behavior. By the end, I have a fully
// validated form with 100% test coverage — and I never wrote code
// that doesn't have a test backing it."


// ═══════════════════════════════════════════════════════════════
// DRILL 6 ⭐⭐⭐ | Testing Components with Context/Providers
// ═══════════════════════════════════════════════════════════════
// "How do you test a component that uses Context?"
// ═══════════════════════════════════════════════════════════════

// ---------- Custom render wrapper ----------
/*
// test-utils/render.tsx
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

function AllProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

// Custom render that wraps in all providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from RTL
export * from '@testing-library/react';
export { customRender as render };
*/

// ---------- Usage in tests ----------
/*
// Instead of:
import { render } from '@testing-library/react';

// Use:
import { render } from '../test-utils/render';
// Now every render() automatically wraps in AuthProvider + ThemeProvider
*/

// ---------- Testing with specific context values ----------
/*
it('shows admin panel for admin users', () => {
  // Render with a custom provider that has specific values
  render(
    <AuthContext.Provider value={{ user: { role: 'admin' }, login: jest.fn(), logout: jest.fn() }}>
      <Dashboard />
    </AuthContext.Provider>
  );

  expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
});

it('hides admin panel for regular users', () => {
  render(
    <AuthContext.Provider value={{ user: { role: 'viewer' }, login: jest.fn(), logout: jest.fn() }}>
      <Dashboard />
    </AuthContext.Provider>
  );

  expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument();
});
*/

// 🔥 SAY THIS: "I create a custom render function that wraps components
// in all required providers. Tests import render from test-utils instead
// of @testing-library/react. For testing specific states — like admin
// vs viewer — I wrap in a provider with explicit values."


// ═══════════════════════════════════════════════════════════════
// DRILL 7 ⭐⭐⭐ | Mocking API Calls — The Pattern
// ═══════════════════════════════════════════════════════════════
// "How do you mock fetch in tests?"
// Two approaches: jest.mock + global.fetch mock
// ═══════════════════════════════════════════════════════════════

// ---------- Approach 1: Mock global fetch ----------
/*
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it('shows users after fetch', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'Tijo' },
      { id: 2, name: 'Alice' },
    ]),
  });

  render(<UserList />);

  // Loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Data loaded
  await waitFor(() => {
    expect(screen.getByText('Tijo')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  // Verify fetch was called correctly
  expect(global.fetch).toHaveBeenCalledWith('/api/users');
});

it('shows error on fetch failure', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

it('shows error on non-ok response', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
*/

// ---------- Approach 2: Mock an API module ----------
/*
// api/users.ts
export async function getUsers() {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// UserList.test.tsx
jest.mock('../api/users');
import { getUsers } from '../api/users';

it('renders users', async () => {
  getUsers.mockResolvedValue([{ id: 1, name: 'Tijo' }]);
  render(<UserList />);
  expect(await screen.findByText('Tijo')).toBeInTheDocument();
});
*/

// 🔥 SAY THIS: "I prefer mocking the API module over global.fetch —
// it's cleaner and tests the component's integration with the API layer.
// I always test three states: loading, success, error. findByText is
// shorthand for waitFor + getByText — it waits for the element to appear."


// ═══════════════════════════════════════════════════════════════
// DRILL 8 ⭐⭐⭐ | Testing Utility Functions (Pure TDD)
// ═══════════════════════════════════════════════════════════════
// Easiest TDD demo — no React, just pure functions
// If they say "show me TDD" and you're nervous, START HERE
// ═══════════════════════════════════════════════════════════════

// ---------- THE TEST (write FIRST) ----------
/*
import { formatPrice, validateEmail, truncate } from './helpers';

describe('formatPrice', () => {
  it('formats 0 cents as $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats 999 cents as $9.99', () => {
    expect(formatPrice(999)).toBe('$9.99');
  });

  it('formats 100 cents as $1.00', () => {
    expect(formatPrice(100)).toBe('$1.00');
  });

  it('handles negative amounts', () => {
    expect(formatPrice(-500)).toBe('-$5.00');
  });
});

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('tijo@test.com')).toBe(true);
  });

  it('returns false for missing @', () => {
    expect(validateEmail('tijotest.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('truncate', () => {
  it('returns original if shorter than max', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ... if longer', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});
*/

// ---------- THE CODE (write AFTER tests) ----------

function formatPrice(cents) {
  const abs = Math.abs(cents);
  const formatted = '$' + (abs / 100).toFixed(2);
  return cents < 0 ? '-' + formatted : formatted;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + '...';
}


// ═══════════════════════════════════════════════════════════════
//  THE TDD INTERVIEW PLAYBOOK
// ═══════════════════════════════════════════════════════════════
//
//  When they say "Show me TDD" or "Write tests for X":
//
//  STEP 1: Define the behaviors out loud
//    "The component needs to: render inputs, validate on submit,
//     show errors, call onSubmit with data, handle loading state."
//
//  STEP 2: Write the FIRST test (simplest behavior)
//    "I start with rendering — does it show the right elements?"
//
//  STEP 3: Run it (RED)
//    "This fails because the component doesn't exist yet."
//
//  STEP 4: Build minimum code (GREEN)
//    "I write just enough to make this test pass."
//
//  STEP 5: Write the NEXT test (add behavior)
//    "Now I test the happy path — valid submit."
//
//  REPEAT until all behaviors are covered.
//
//  KEY RTL QUERIES (priority order):
//    getByRole('button', { name: /submit/i })  ← BEST
//    getByLabelText(/email/i)                  ← for form fields
//    getByText(/welcome/i)                     ← for content
//    getByPlaceholderText(/search/i)           ← for search inputs
//    getByTestId('submit')                     ← LAST RESORT
//
//  KEY ASSERTIONS:
//    expect(el).toBeInTheDocument()            ← element exists
//    expect(el).not.toBeInTheDocument()         ← element gone (use queryBy)
//    expect(el).toHaveValue('hello')           ← input value
//    expect(el).toBeDisabled()                 ← button disabled
//    expect(el).toHaveStyle('color: red')      ← style check
//    expect(fn).toHaveBeenCalledWith(data)     ← mock called correctly
//    expect(fn).not.toHaveBeenCalled()         ← mock NOT called
//
//  USER EVENTS (always use userEvent, not fireEvent):
//    await user.type(input, 'text')            ← type into input
//    await user.click(button)                  ← click
//    await user.clear(input)                   ← clear input
//    await user.keyboard('{Enter}')            ← keyboard event
//    await user.selectOptions(select, 'opt')   ← select dropdown
//
//  ASYNC PATTERNS:
//    await screen.findByText('loaded')          ← wait for element
//    await waitFor(() => expect(...))            ← wait for assertion
//    screen.queryByText('gone')                 ← assert absence (returns null)
//
// ═══════════════════════════════════════════════════════════════
//
//  🎯 PRIORITY FOR TONIGHT:
//    1. Drill 1 (Login Form) — memorize the test structure
//    2. Drill 5 (Registration step-by-step) — practice the TDD CYCLE
//    3. Drill 8 (Utility functions) — easiest entry point if nervous
//    4. The RTL query priority table above — memorize it
//
// ═══════════════════════════════════════════════════════════════
