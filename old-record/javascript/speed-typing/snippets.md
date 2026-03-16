# JavaScript Speed Typing Snippets

Practice typing these real-world JavaScript patterns to build muscle memory.
Aim for accuracy first, then speed. Time yourself and track improvement.

---

## 🟢 Basics

### 1. Variable Declaration & Destructuring
```javascript
const { name, age, ...rest } = user;
const [first, second, ...others] = items;
const greeting = `Hello, ${name}! You are ${age} years old.`;
const port = config.port ?? 3000;
const street = user?.address?.street?.name;
```

### 2. Arrow Functions & Defaults
```javascript
const multiply = (a, b = 1) => a * b;
const greet = (name) => `Hello, ${name}!`;
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
const identity = (x) => x;
const noop = () => {};
```

### 3. Conditional Patterns
```javascript
const status = score >= 90 ? "A" : score >= 80 ? "B" : "C";
const value = input ?? fallback;
const name = user?.profile?.name || "Anonymous";
const items = Array.isArray(data) ? data : [data];
const cleaned = text?.trim()?.toLowerCase() ?? "";
```

---

## 🔵 Async Patterns

### 4. Promise Chain
```javascript
fetch("/api/users")
  .then((res) => res.json())
  .then((users) => users.filter((u) => u.active))
  .then((active) => console.log(active))
  .catch((err) => console.error("Failed:", err));
```

### 5. Async/Await with Error Handling
```javascript
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch user ${id}:`, err);
    return null;
  }
}
```

### 6. Promise.all Parallel Fetch
```javascript
async function loadDashboard(userId) {
  const [profile, posts, notifications] = await Promise.all([
    fetch(`/api/users/${userId}`).then((r) => r.json()),
    fetch(`/api/posts?user=${userId}`).then((r) => r.json()),
    fetch(`/api/notifications/${userId}`).then((r) => r.json()),
  ]);
  return { profile, posts, notifications };
}
```

### 7. Fetch with Timeout
```javascript
function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .finally(() => clearTimeout(timeout));
}
```

---

## 🟡 Array Methods

### 8. Map / Filter / Reduce Pipeline
```javascript
const result = orders
  .filter((order) => order.status === "completed")
  .map((order) => ({ id: order.id, total: order.items.length }))
  .reduce((sum, order) => sum + order.total, 0);
```

### 9. Array Transformations
```javascript
const unique = [...new Set(items)];
const grouped = Object.groupBy(users, (u) => u.role);
const flat = nested.flatMap((arr) => arr.filter(Boolean));
const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
const chunks = Array.from({ length: Math.ceil(arr.length / size) },
  (_, i) => arr.slice(i * size, (i + 1) * size));
```

### 10. Object Transformations
```javascript
const doubled = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
const picked = Object.fromEntries(
  Object.entries(obj).filter(([k]) => keys.includes(k))
);
const inverted = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [v, k])
);
```

---

## 🟠 DOM Manipulation

### 11. Event Delegation
```javascript
document.querySelector(".list").addEventListener("click", (e) => {
  const item = e.target.closest("[data-id]");
  if (!item) return;
  const id = item.dataset.id;
  console.log("Clicked item:", id);
  item.classList.toggle("selected");
});
```

### 12. DOM Creation & Insertion
```javascript
function createCard(title, body) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2 class="card-title">${title}</h2>
    <p class="card-body">${body}</p>
  `;
  document.querySelector(".container").appendChild(card);
  return card;
}
```

---

## 🔴 Common Interview Patterns

### 13. Debounce
```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 14. Throttle
```javascript
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

### 15. Memoize
```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### 16. Deep Clone
```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

### 17. Curry
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

---

## 📊 Progress Tracker

| Snippet | Date | WPM | Accuracy | Notes |
|---------|------|-----|----------|-------|
| #1 | | | | |
| #2 | | | | |
| #3 | | | | |
| #4 | | | | |
| #5 | | | | |
| #6 | | | | |
| #7 | | | | |
| #8 | | | | |
| #9 | | | | |
| #10 | | | | |
| #11 | | | | |
| #12 | | | | |
| #13 | | | | |
| #14 | | | | |
| #15 | | | | |
| #16 | | | | |
| #17 | | | | |
