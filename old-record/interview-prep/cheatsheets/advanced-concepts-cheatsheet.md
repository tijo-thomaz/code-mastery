# ⚡ Advanced Concepts — Webhooks, Web Workers, WebSockets, Portals, Higher-Order Functions

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. Webhooks

**One-line:** A webhook is a server-to-server HTTP callback — when an event happens in System A, it sends a POST request to System B's URL with the event data. It's the reverse of polling.

**How it works:**
```
Traditional (Polling):
  Your Server ──► Stripe API: "Any new payments?" (every 30 seconds)
  Your Server ──► Stripe API: "Any new payments?"
  Your Server ──► Stripe API: "Any new payments?"
  Your Server ──► Stripe API: "Yes! Here's one"
  → Wasteful. 99% of requests return nothing.

Webhook (Event-driven):
  You register: "Hey Stripe, POST to https://myapp.com/webhooks/stripe when payment happens"
  ...
  (Payment happens)
  Stripe ──POST──► https://myapp.com/webhooks/stripe
  { "event": "payment.succeeded", "data": { "amount": 5000, "currency": "usd" } }
  → Efficient. You only get notified when something happens.
```

**Real example — Stripe payment webhook:**
```javascript
// Express endpoint that receives Stripe webhooks
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  // Verify the webhook is actually from Stripe (not an attacker)
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Invalid signature');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      fulfillOrder(event.data.object);
      break;
    case 'payment_intent.failed':
      notifyCustomer(event.data.object);
      break;
  }

  res.status(200).json({ received: true }); // Always respond 200 quickly
});
```

**Key security points:**
```
1. Verify signatures  → Confirm the webhook is from the real sender (not spoofed)
2. Respond fast (200)  → Return 200 quickly, process async. If you timeout, sender retries
3. Handle idempotency → Webhooks can be sent multiple times. Use event IDs to dedup
4. Use HTTPS          → Webhook payloads may contain sensitive data
```

**Webhook vs WebSocket vs Polling:**
```
Webhook    → Server-to-server. Event-driven push. One-way notification.
             Use for: Payment events, CI/CD triggers, third-party integrations
WebSocket  → Client-to-server. Persistent bidirectional connection.
             Use for: Chat, live updates, real-time collaboration
Polling    → Client-to-server. Repeated requests on interval.
             Use for: Simple cases where real-time isn't critical
```

**Say this in interview:**
> "A webhook is a server-to-server callback — instead of polling an API repeatedly, you register a URL and the service pushes events to you when they happen. I'd use webhooks for third-party integrations like Stripe payments or GitHub CI triggers. The key is verifying the signature to ensure the request is authentic, responding with 200 quickly, and handling duplicates since webhooks can retry."

---

## 2. Web Workers

**One-line:** Web Workers run JavaScript in a background thread, keeping the main thread free for UI rendering — no more frozen UIs during heavy computation.

**The problem they solve:**
```
JavaScript is single-threaded.
Heavy computation on the main thread → UI freezes → user thinks app crashed.

Examples of heavy work:
  → Parsing a 50MB CSV file
  → Image processing / filters
  → Complex calculations (sorting 100k items, crypto, ML inference)
  → Searching through large datasets
```

**How it works:**
```
┌──────────────────────┐     postMessage()     ┌──────────────────────┐
│     Main Thread      │ ───────────────────► │     Worker Thread     │
│                      │                       │                      │
│  - DOM access ✅     │                       │  - DOM access ❌     │
│  - UI rendering      │                       │  - No window/document│
│  - Event handling    │ ◄─────────────────── │  - Heavy computation │
│                      │     postMessage()     │  - Has its own scope │
└──────────────────────┘                       └──────────────────────┘
```

**Basic example:**
```javascript
// main.js — Main thread
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ data: hugeArray, operation: 'sort' });

// Receive result from worker
worker.onmessage = (e) => {
  console.log('Sorted:', e.data.result);
  setResults(e.data.result); // Update React state with result
};

// Handle errors
worker.onerror = (e) => {
  console.error('Worker error:', e.message);
};

// Terminate when done
worker.terminate();
```

```javascript
// worker.js — Worker thread (separate file)
self.onmessage = (e) => {
  const { data, operation } = e.data;

  if (operation === 'sort') {
    const sorted = data.sort((a, b) => a - b); // Heavy work happens here
    self.postMessage({ result: sorted });        // Send result back
  }
};
```

**Using Web Workers in React (inline worker with Blob):**
```javascript
function useWorker(workerFunction) {
  const workerRef = useRef(null);

  useEffect(() => {
    const blob = new Blob(
      [`self.onmessage = ${workerFunction.toString()}`],
      { type: 'application/javascript' }
    );
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => workerRef.current?.terminate(); // Cleanup
  }, []);

  return workerRef;
}
```

**Key constraints:**
```
✅ Can do: fetch(), setTimeout, WebSocket, IndexedDB, computation
❌ Cannot do: Access DOM, window, document, React state, localStorage
📬 Communication: Only via postMessage() — data is COPIED (structured clone), not shared
```

**Types of workers:**
```
Dedicated Worker → One-to-one with the page that created it (most common)
Shared Worker    → Can be accessed by multiple pages/tabs from same origin
Service Worker   → Proxy between app and network. Used for PWA offline caching
```

**Say this in interview:**
> "Web Workers run JavaScript in a background thread so heavy computation doesn't block the UI. They can't access the DOM — communication is through postMessage with structured cloning. I'd use them for parsing large files, complex sorting, or any CPU-intensive task that would freeze the interface. In React, I'd wrap the worker in a custom hook with proper cleanup on unmount."

---

## 3. WebSockets

**One-line:** WebSocket is a persistent, bidirectional connection between client and server — both sides can send data at any time without repeated HTTP requests.

**HTTP vs WebSocket:**
```
HTTP (Request-Response):
  Client ──GET──► Server    "Give me data"
  Client ◄──200── Server    "Here's data"
  (Connection closed)
  Client ──GET──► Server    "Any updates?"
  Client ◄──200── Server    "Nope"
  → New connection every time. Overhead. Latency.

WebSocket (Persistent Bidirectional):
  Client ──HTTP Upgrade──► Server    "Let's switch to WebSocket"
  Client ◄──101 Switching── Server   "OK, upgraded"
  ═══════════════════════════════════ (connection stays open)
  Client ◄──── Server    "New message from Alice"
  Client ────► Server    "Typing indicator: true"
  Client ◄──── Server    "Bob joined the room"
  → One connection. Both sides push anytime. Low latency.
```

**The handshake (HTTP → WebSocket upgrade):**
```
Client sends:
  GET /chat HTTP/1.1
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

Server responds:
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade

→ Now it's a WebSocket connection (ws:// or wss:// for secure)
```

**Basic usage:**
```javascript
// Client-side
const ws = new WebSocket('wss://api.myapp.com/ws');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chat_message') {
    addMessage(data.message); // Update UI
  }
};

ws.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);
  // Implement reconnection logic
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Send message
ws.send(JSON.stringify({ type: 'chat_message', text: 'Hello!' }));

// Close connection
ws.close();
```

**Using WebSocket in React:**
```javascript
function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.onclose = () => {
      // Reconnect after 3 seconds
      setTimeout(() => { wsRef.current = new WebSocket(url); }, 3000);
    };

    return () => ws.close(); // Cleanup on unmount
  }, [url]);

  const send = (data) => wsRef.current?.send(JSON.stringify(data));

  return { messages, send };
}
```

**WebSocket vs SSE (Server-Sent Events) vs Polling:**
```
                  WebSocket          SSE                  Polling
Direction         Bidirectional      Server → Client only  Client → Server only
Connection        Persistent         Persistent            New request each time
Protocol          ws:// / wss://     Regular HTTP           Regular HTTP
Reconnection      Manual             Auto (built-in)        N/A
Binary data       ✅ Yes             ❌ No (text only)      ✅ Yes
Use case          Chat, gaming,      Live feeds, stock      Simple dashboards,
                  collaboration      tickers, notifications  legacy systems
```

**Say this in interview:**
> "WebSocket provides a persistent bidirectional connection — both client and server can push data at any time. It starts as an HTTP request that upgrades to the WebSocket protocol. I'd use it for real-time features like chat, live collaboration, or gaming. For one-way server updates like notifications or live feeds, Server-Sent Events are simpler. For simple cases where near-real-time is enough, polling works fine. The trade-off with WebSocket is managing connection lifecycle — reconnection, heartbeats, and scaling with a message broker."

---

## 4. React Portals

**One-line:** Portals let you render a React component's children into a DOM node that exists OUTSIDE the parent component's DOM hierarchy — while keeping it inside React's component tree for events and context.

**The problem they solve:**
```
Without Portal:
  <div style="overflow: hidden">      ← Parent clips content
    <Modal />                          ← Modal gets clipped! Can't escape parent's CSS
  </div>

With Portal:
  <div style="overflow: hidden">      ← Parent clips content
    {/* Modal renders into document.body instead */}
  </div>
  ...
  <body>
    <div id="modal-root">
      <Modal />                        ← Free from parent's overflow/z-index!
    </div>
  </body>
```

**How to use:**
```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById('modal-root') // Render HERE in the DOM
  );
}
```

```html
<!-- index.html — add the portal target -->
<body>
  <div id="root"></div>          <!-- React app renders here -->
  <div id="modal-root"></div>    <!-- Portals render here -->
</body>
```

**The key insight — events still bubble through React's tree:**
```jsx
function App() {
  // This onClick CATCHES clicks from the Portal!
  // Because in React's tree, Modal is still a child of App
  return (
    <div onClick={() => console.log('App clicked!')}>
      <Modal isOpen={true}>
        <button>Click me</button>
        {/* Clicking this button → event bubbles through React tree → App's onClick fires */}
      </Modal>
    </div>
  );
}
```

```
DOM tree:                    React tree:
  body                         App
  ├── #root                    └── Modal (still App's child in React!)
  │   └── App div                  └── button
  └── #modal-root
      └── Modal overlay        Events bubble through REACT tree,
          └── button           NOT the DOM tree
```

**Common use cases:**
```
1. Modals / Dialogs    → Escape parent overflow/z-index
2. Tooltips / Popovers → Position relative to viewport, not parent
3. Toasts / Notifications → Render at document level
4. Dropdown menus       → Escape overflow:hidden containers
```

**Say this in interview:**
> "React Portals render children into a different DOM node while keeping them in React's component tree. The main use case is modals and tooltips that need to escape parent CSS constraints like overflow:hidden or z-index stacking contexts. The powerful thing is that events still bubble through React's tree — not the DOM tree — so context providers and event handlers on parent components still work, even though the portal renders elsewhere in the DOM."

---

## 5. First-Class & Higher-Order Functions

### First-Class Functions

**One-line:** In JavaScript, functions are first-class citizens — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. They're treated like any other value.

```javascript
// 1. Assigned to a variable
const greet = function(name) { return `Hello, ${name}`; };

// 2. Passed as an argument (callback)
[1, 2, 3].map(function(n) { return n * 2; });
setTimeout(function() { console.log('done'); }, 1000);

// 3. Returned from another function
function multiplier(factor) {
  return function(n) { return n * factor; }; // Returns a function
}
const double = multiplier(2);
double(5); // 10

// 4. Stored in a data structure
const actions = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};
actions.add(3, 4); // 7
```

**Say this in interview:**
> "JavaScript has first-class functions — functions are values. You can assign them to variables, pass them as arguments, return them from other functions, and store them in objects or arrays. This is what enables patterns like callbacks, higher-order functions, closures, and functional programming in JavaScript."

### Higher-Order Functions (HOF)

**One-line:** A higher-order function is a function that takes a function as an argument OR returns a function — or both.

**Built-in HOFs you already use:**
```javascript
// Takes a function as argument
[1, 2, 3].map(n => n * 2);           // map is a HOF
[1, 2, 3].filter(n => n > 1);        // filter is a HOF
[1, 2, 3].reduce((acc, n) => acc + n, 0); // reduce is a HOF
document.addEventListener('click', handler); // addEventListener is a HOF
setTimeout(callback, 1000);           // setTimeout is a HOF
```

**Custom HOFs — practical patterns:**
```javascript
// 1. Function that RETURNS a function (closure + HOF)
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(3, 4); // Logs: "Calling add with [3, 4]" → "Result: 7"

// 2. Debounce — THE classic HOF interview question
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 3. Once — function that runs only the first time
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

// 4. Memoize — cache results of expensive function calls
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 5. Pipe / Compose — chain functions together
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);

const transform = pipe(
  str => str.trim(),
  str => str.toLowerCase(),
  str => str.replace(/\s+/g, '-'),
);
transform('  Hello World  '); // "hello-world"
```

**HOFs in React — Higher-Order Components (HOC):**
```jsx
// A HOC takes a component and returns an enhanced component
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

// Modern alternative: custom hooks are usually preferred over HOCs now
function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // ...
}
```

**Say this in interview:**
> "A higher-order function takes a function as an argument or returns a function. map, filter, and reduce are built-in HOFs. Practical patterns include debounce, throttle, memoize, and once — all HOFs that wrap a function with additional behavior. In React, Higher-Order Components follow the same pattern — a function that takes a component and returns an enhanced component — though custom hooks are now the preferred pattern for reusing logic."

**First-class vs Higher-order — the distinction:**
```
First-class functions = Language feature. "Functions ARE values."
                        This is WHAT JavaScript supports.

Higher-order functions = Programming pattern. "Functions that operate on functions."
                         This is possible BECAUSE of first-class functions.

First-class is the capability. Higher-order is the technique built on it.
```

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "What is a webhook?" | "A server-to-server callback. Instead of polling, you register a URL and the service POSTs event data to you when something happens. Key: verify signatures, respond 200 fast, handle idempotency." |
| "What are Web Workers?" | "Background threads for heavy computation. Can't access DOM. Communicate via postMessage. Prevents UI freezing during CPU-intensive tasks." |
| "WebSocket vs HTTP?" | "HTTP is request-response (client initiates). WebSocket is persistent bidirectional — both sides push anytime. Use WebSocket for chat, live updates, real-time collaboration." |
| "WebSocket vs SSE?" | "WebSocket is bidirectional. SSE is server-to-client only but simpler — auto-reconnects, works over regular HTTP. I'd use SSE for live feeds and notifications, WebSocket when the client also needs to send." |
| "What are React Portals?" | "Render children into a different DOM node while staying in React's tree. Used for modals, tooltips, toasts that need to escape parent CSS constraints. Events still bubble through React's tree." |
| "What is a first-class function?" | "Functions are values — can be assigned, passed, returned, stored. This enables callbacks, closures, and higher-order functions." |
| "What is a higher-order function?" | "A function that takes a function as argument or returns one. map, filter, reduce, debounce, memoize are all HOFs." |
| "HOC vs custom hook?" | "Both share logic across components. HOCs wrap components (function → component → enhanced component). Custom hooks are simpler, composable, and the modern React pattern. I prefer hooks." |
| "Webhook vs WebSocket?" | "Webhook is server-to-server, event-driven, one-way push. WebSocket is client-to-server, persistent bidirectional connection. Webhooks for integrations (Stripe, GitHub). WebSockets for real-time UI (chat)." |
