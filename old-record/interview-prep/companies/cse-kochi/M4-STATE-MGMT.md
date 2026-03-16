# M4: Redux & State Management

> **JD says:** "Experience with state management libraries like Redux, MobX, or Zustand"
> **This is CRITICAL — they WILL ask Redux specifics**
> **Time:** 30 min

---

## SECTION A: Concepts to Explain

---

### 1. Redux Core Flow
```
Action → Dispatch → Reducer → New State → UI Re-render
```

> "Redux has a single store holding the entire app state. Components dispatch actions — plain objects with a `type` and optional payload. Reducers are pure functions that take current state + action and return NEW state (never mutate). The store notifies subscribed components to re-render."

### 2. Redux Toolkit (Modern Redux)
> "Nobody writes vanilla Redux anymore. Redux Toolkit is the official way. `createSlice` generates action creators + reducers together. `configureStore` sets up the store with good defaults. `createAsyncThunk` handles async — dispatches pending/fulfilled/rejected automatically."

**Key RTK APIs:**
```js
createSlice({ name, initialState, reducers })  // slice = reducer + actions
configureStore({ reducer: { users: userSlice } })  // combines slices
createAsyncThunk('users/fetch', async () => { })  // async actions
useSelector(state => state.users.list)  // read from store
useDispatch()  // get dispatch function
```

### 3. When Redux vs Context vs Zustand

| Need | Use |
|------|-----|
| Local component state | useState |
| Shared between siblings | Lift state up |
| Theme, auth, locale (low-frequency) | Context + useReducer |
| Complex cross-cutting state (high-frequency) | Redux or Zustand |
| Server state (API data) | TanStack Query |

> "Context re-renders ALL consumers when value changes — fine for theme toggles, bad for a stock ticker updating every second. Redux and Zustand have selective subscriptions — only components reading changed data re-render."

### 4. Redux Middleware
> "Middleware sits between dispatch and the reducer. Used for: logging, async operations (thunks), analytics. `redux-thunk` lets you dispatch functions instead of objects — the function receives dispatch and getState. Redux Toolkit includes thunk middleware by default."

### 5. Immutability in Redux
> "Reducers must return NEW state, never mutate. Spread operator for objects: `{ ...state, count: state.count + 1 }`. For arrays: `[...state.items, newItem]`. Redux Toolkit uses Immer under the hood — you CAN write mutating code in `createSlice` reducers and Immer handles immutability."

---

## SECTION B: 🪤 TRAP QUESTIONS

---

### TRAP 1: Why can't you mutate state directly?
```js
// ❌ Wrong
state.count = state.count + 1;
return state;

// ✅ Correct
return { ...state, count: state.count + 1 };
```
**Why?** Redux uses reference equality to detect changes. If you mutate and return the same object reference, Redux thinks nothing changed → no re-render. New object = new reference = update detected.

---

### TRAP 2: useSelector causes re-renders
```js
// ❌ Creates new object every time — re-renders on EVERY dispatch
const { name, age } = useSelector(state => ({
  name: state.user.name,
  age: state.user.age,
}));

// ✅ Select primitives separately
const name = useSelector(state => state.user.name);
const age = useSelector(state => state.user.age);

// ✅ Or use shallowEqual
import { shallowEqual } from 'react-redux';
const { name, age } = useSelector(
  state => ({ name: state.user.name, age: state.user.age }),
  shallowEqual
);
```

---

### TRAP 3: Async in reducers
```js
// ❌ NEVER — reducers must be pure
const userSlice = createSlice({
  reducers: {
    fetchUser: (state) => {
      const data = await fetch('/api/user'); // ❌ side effect in reducer
    }
  }
});

// ✅ Use createAsyncThunk
const fetchUser = createAsyncThunk('user/fetch', async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});

// Then handle in extraReducers
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => { state.loading = true; })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}
```

---

### TRAP 4: Context re-render problem
```jsx
const UserContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState({ name: 'Tijo', theme: 'dark' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Problem: ThemeDisplay re-renders when name changes too!
function ThemeDisplay() {
  const { user } = useContext(UserContext);
  return <span>{user.theme}</span>;
}
```

**Why?** Context doesn't have selective subscriptions. ANY change to the value re-renders ALL consumers. That's why Context is bad for high-frequency state.

**Fix:** Split into separate contexts, or use Zustand/Redux.

---

### TRAP 5: useReducer vs Redux
```
useReducer = local to one component (or shared via Context)
Redux = global store, middleware, devtools, selective subscriptions
```

**When to use useReducer:**
> Complex local state with multiple related values — like a form with many fields, or a multi-step wizard. When state transitions have clear action types.

**When to use Redux:**
> Multiple distant components need the same state. Need middleware for async/logging. Need Redux DevTools for debugging. Team standardization.

---

## SECTION C: Hands-On Drill (15 min)

### 1. Redux Toolkit slice from memory (5 min)
```js
// Create a todosSlice with:
// - addTodo(state, action)
// - toggleTodo(state, action)
// - removeTodo(state, action)
// - fetchTodos (async thunk)
```

### 2. useReducer todo (5 min)
```js
// Create a todo app using useReducer
// Actions: ADD, DELETE, TOGGLE
// Reducer: switch on action.type
```

### 3. Context + useReducer pattern (5 min)
```jsx
// Create: ThemeContext
// Provider wraps app
// useTheme() custom hook
// Toggle between 'light' and 'dark'
```

---

## ✅ Checklist

- [ ] Can draw Redux flow: Action → Dispatch → Reducer → State → UI
- [ ] Can write createSlice + createAsyncThunk from memory
- [ ] Can explain Context re-render problem and when NOT to use Context
- [ ] Can explain why immutability matters (reference equality detection)
- [ ] Can solve all 5 trap questions
- [ ] Know when to use useState vs useReducer vs Context vs Redux vs TanStack Query
