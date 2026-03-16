# M6: Machine Test Prep

> **Format:** Coding test on their platform (likely 60-90 min)
> **Expect:** React build tasks + JS algorithm tasks
> **Strategy:** Speed + clean code. They're watching structure, not just correctness.

---

## PART A: React Build Tasks (Most Likely)

> These are the "build X in Y minutes" challenges. Practice until muscle memory.

---

### Task 1: Todo App — Full CRUD + Filter (15 min target)

**Requirements:** Add, delete, toggle complete, filter (all/active/completed), item count

**Your patterns (burned in memory):**
```jsx
// Add
setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);

// Delete
setTodos(prev => prev.filter(t => t.id !== id));

// Toggle
setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

// Filter
const filtered = todos.filter(t => {
  if (filter === 'active') return !t.done;
  if (filter === 'completed') return t.done;
  return true;
});

// Count
const remaining = todos.filter(t => !t.done).length;
```

---

### Task 2: Fetch Data + Loading + Error States (10 min target)

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name} — {u.email}</li>)}
    </ul>
  );
}
```

---

### Task 3: Controlled Form with Validation (10 min target)

```jsx
function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Invalid email';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Submit:', form);
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' })); // clear error on type
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={handleChange('name')} placeholder="Name" />
      {errors.name && <span className="error">{errors.name}</span>}

      <input value={form.email} onChange={handleChange('email')} placeholder="Email" />
      {errors.email && <span className="error">{errors.email}</span>}

      <input type="password" value={form.password} onChange={handleChange('password')} placeholder="Password" />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

---

### Task 4: Debounced Search (10 min target)

```jsx
function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`)
        .then(res => res.json())
        .then(data => { setResults(data); setLoading(false); });
    }, 300);

    return () => clearTimeout(timer); // cleanup = debounce
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      {loading && <p>Searching...</p>}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

---

### Task 5: Pagination (10 min target)

```jsx
function PaginatedList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${perPage}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [page]);

  return (
    <div>
      <ul>{items.map(item => <li key={item.id}>{item.title}</li>)}</ul>
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
      <span> Page {page} </span>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}
```

---

## PART B: JavaScript Algorithm Tasks (Likely)

> Platform tests often include 2-3 JS problems. These are the most common.

---

### 1. Array Manipulation

```js
// Frequency count
function freqCount(arr) {
  return arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

// Dedup
const unique = [...new Set(arr)];

// GroupBy
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

// Flatten
function flatten(arr) {
  return arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}
```

---

### 2. String Manipulation

```js
// Reverse string
const reverse = str => str.split('').reverse().join('');

// Palindrome check
const isPalindrome = str => str === reverse(str);

// Count vowels
const countVowels = str => (str.match(/[aeiou]/gi) || []).length;

// Capitalize first letter of each word
const capitalize = str => str.replace(/\b\w/g, c => c.toUpperCase());

// Anagram check
const isAnagram = (a, b) =>
  a.toLowerCase().split('').sort().join('') === b.toLowerCase().split('').sort().join('');

// Most frequent character
function mostFreqChar(str) {
  const freq = {};
  let max = 0, char = '';
  for (const c of str) {
    freq[c] = (freq[c] || 0) + 1;
    if (freq[c] > max) { max = freq[c]; char = c; }
  }
  return char;
}
```

---

### 3. Object Manipulation

```js
// Deep clone
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

// Flatten object: { a: { b: { c: 1 } } } → { 'a.b.c': 1 }
function flattenObj(obj, prefix = '', result = {}) {
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flattenObj(val, newKey, result);
    } else {
      result[newKey] = val;
    }
  }
  return result;
}
```

---

### 4. Classic Algorithm Tasks

```js
// Two Sum — find indices where arr[i] + arr[j] = target
function twoSum(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(arr[i], i);
  }
  return [];
}

// FizzBuzz
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}

// Find duplicates in array
const findDuplicates = arr =>
  arr.filter((item, index) => arr.indexOf(item) !== index);

// Chunk array: [1,2,3,4,5], 2 → [[1,2],[3,4],[5]]
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
```

---

### 5. Async Tasks

```js
// Debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Promise.all from scratch
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}

// Retry with backoff
function retry(fn, retries = 3, delay = 1000) {
  return fn().catch(err => {
    if (retries <= 0) throw err;
    return new Promise(res => setTimeout(res, delay))
      .then(() => retry(fn, retries - 1, delay * 2));
  });
}
```

---

## PART C: Machine Test Tactics

### Before you code:
1. **Read the FULL problem** — don't start typing immediately
2. **Identify the pattern** — is it CRUD? Fetch? Algorithm? Form?
3. **Write the component skeleton first** — imports, function, return JSX, export
4. **State first** — what state does this component need?
5. **Then logic** — handlers, effects, derived values
6. **Then JSX** — render based on state

### Common mistakes under pressure:
- ❌ Forgetting `key` prop in lists → `key={item.id}`
- ❌ Forgetting `e.preventDefault()` in form submit
- ❌ Forgetting `value` prop on controlled inputs
- ❌ Using `filter` when you need `find` (or vice versa)
- ❌ Missing cleanup in useEffect → `return () => clearTimeout(timer)`
- ❌ Off-by-one in pagination
- ❌ Not handling empty state / loading state / error state

---

## ✅ Checklist

- [ ] Can build todo CRUD + filter in 10 min
- [ ] Can build fetch + loading + error in 5 min
- [ ] Can build controlled form with validation in 8 min
- [ ] Can write debounce, throttle, flatten, deepClone from memory
- [ ] Can solve twoSum, frequency count, groupBy, chunk without thinking
- [ ] Know the common mistakes list above
