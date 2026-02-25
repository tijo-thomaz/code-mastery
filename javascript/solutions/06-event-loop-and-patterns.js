/**
 * ===========================================
 * 06 — Event Loop and Patterns — SOLUTIONS
 * ===========================================
 */

// ── Exercise 1 — Event Loop Output Prediction ──
function exercise1_eventLoopPrediction() {
  // Execution order analysis:
  //
  // 1. console.log("1")           → SYNC: executes immediately
  // 2. setTimeout(log "2", 0)     → MACRO: queued to macrotask queue
  // 3. Promise.then(log "3")      → MICRO: queued to microtask queue
  // 4. Promise.then(log "4", setTimeout "5") → MICRO: queued to microtask queue
  // 5. setTimeout(log "6", then "7", 0)      → MACRO: queued to macrotask queue
  // 6. console.log("8")           → SYNC: executes immediately
  //
  // After sync: microtask queue drains → "3", then "4" (which queues "5" as macro)
  // Then macrotask "2" runs
  // Then macrotask "6" runs → it queues "7" as micro → "7" runs before next macro
  // Then macrotask "5" runs

  return ["1", "8", "3", "4", "2", "6", "7", "5"];
}

// WHY: The event loop processes in this priority:
//   1. Call stack (synchronous code) — runs to completion
//   2. Microtask queue (Promise.then, queueMicrotask, MutationObserver) — ALL drained
//   3. ONE macrotask (setTimeout, setInterval, I/O, UI rendering)
//   4. Back to step 2 (drain microtasks again)
//
// Key insight: ALL microtasks run before the NEXT macrotask.
// A microtask can enqueue more microtasks (they run in the same cycle).
// A macrotask that creates a microtask → that micro runs before the next macro.

// ── Exercise 2 — Microtask vs Macrotask ──
function exercise2_microtaskMacrotask() {
  return new Promise(resolve => {
    const log = [];

    log.push("sync-1");

    setTimeout(() => {
      log.push("macro-1 (setTimeout)");
    }, 0);

    Promise.resolve().then(() => {
      log.push("micro-1 (Promise.then)");
    });

    queueMicrotask(() => {
      log.push("micro-2 (queueMicrotask)");
    });

    setTimeout(() => {
      log.push("macro-2 (setTimeout)");
      // Resolve after all tasks have run
      resolve(log);
    }, 0);

    log.push("sync-2");
  });
}

// WHY: This demonstrates the concrete execution order:
//   sync-1, sync-2 → synchronous, runs first
//   micro-1, micro-2 → microtasks, ALL drain before any macrotask
//   macro-1, macro-2 → macrotasks, run one at a time
//
// Microtasks: Promise.then/.catch/.finally, queueMicrotask, MutationObserver
// Macrotasks: setTimeout, setInterval, setImmediate (Node), I/O, UI rendering
// In Node.js, process.nextTick runs before Promise microtasks (even higher priority).

// ── Exercise 3 — Debounce Implementation ──
function exercise3_debounce(fn, delayMs) {
  let timerId = null;

  function debounced(...args) {
    // Clear any existing timer — this "resets the wait"
    clearTimeout(timerId);

    // Set a new timer. fn only fires after delayMs of inactivity.
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  }

  // Allow manual cancellation
  debounced.cancel = function () {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}

// WHY: Debounce ensures a function only fires AFTER a pause in events.
// Each call resets the timer. Only the last call in a burst actually executes.
// Use cases:
//   - Search input: wait for user to stop typing before searching
//   - Window resize: wait for resize to finish before recalculating layout
//   - Auto-save: wait for user to stop editing before saving
// fn.apply(this, args) preserves the correct `this` context and arguments.

// ── Exercise 4 — Throttle Implementation ──
function exercise4_throttle(fn, intervalMs) {
  let lastCallTime = 0;

  return function throttled(...args) {
    const now = Date.now();

    // Only execute if enough time has passed since the last call
    if (now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  };
}

// WHY: Throttle ensures a function fires AT MOST once per interval.
// Unlike debounce (which waits for inactivity), throttle guarantees
// regular execution during continuous events.
// Use cases:
//   - Scroll events: update position at most every 100ms
//   - Mouse move: track cursor at a reasonable rate
//   - API rate limiting: at most N calls per second
//
// Debounce vs Throttle:
//   Debounce: "Run after the storm is over"
//   Throttle: "Run regularly during the storm"

// ── Exercise 5 — Pub/Sub Pattern ──
function exercise5_pubSub() {
  function createEventEmitter() {
    // Map of event name → Set of callbacks
    const listeners = new Map();

    return {
      on(event, callback) {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event).add(callback);
      },

      off(event, callback) {
        const cbs = listeners.get(event);
        if (cbs) {
          cbs.delete(callback);
        }
      },

      emit(event, ...args) {
        const cbs = listeners.get(event);
        if (cbs) {
          // Iterate over a copy to avoid issues if a listener modifies the set
          for (const cb of [...cbs]) {
            cb(...args);
          }
        }
      },

      once(event, callback) {
        // Wrap the callback to auto-unsubscribe after first call
        const wrapper = (...args) => {
          callback(...args);
          this.off(event, wrapper);
        };
        this.on(event, wrapper);
      },
    };
  }

  return createEventEmitter;
}

// WHY: Pub/Sub (Publish/Subscribe) decouples event producers from consumers.
// Publishers don't know who's listening; subscribers don't know who's publishing.
// This is the pattern behind: Node's EventEmitter, DOM events, Redux, RxJS.
// Using Set for listeners ensures no duplicates and O(1) add/delete.
// once() is a common convenience — wraps the callback to self-remove.
// Spreading [...cbs] before iteration prevents bugs when listeners modify the set.

// ── Exercise 6 — Observer Pattern ──
function exercise6_observer() {
  function createStore(initialState) {
    let state = initialState;
    const subscribers = new Set();

    return {
      getState() {
        return state;
      },

      setState(updater) {
        // updater receives previous state and returns new state
        state = updater(state);
        // Notify all subscribers with the new state
        for (const listener of subscribers) {
          listener(state);
        }
      },

      subscribe(listener) {
        subscribers.add(listener);
        // Return an unsubscribe function (closure over this listener)
        return () => {
          subscribers.delete(listener);
        };
      },
    };
  }

  return createStore;
}

// WHY: This is a simplified version of Redux/Zustand's store pattern.
// The Observer pattern: subjects (store) notify observers (subscribers) of changes.
// Key design decisions:
//   - setState takes an updater function → ensures access to current state
//   - subscribe returns an unsubscribe function → cleanup is easy
//   - Subscribers get the new state → they don't need to call getState()
// This pattern is the foundation of all modern state management libraries.
// React's useState, Vue's reactive(), and Svelte's stores all use this concept.

// ═══════════════════════════════════════════
async function runTests() {
  console.log("=== 06 Solutions ===\n");

  console.log("Ex1 order:", exercise1_eventLoopPrediction());

  const log = await exercise2_microtaskMacrotask();
  console.log("Ex2 micro/macro:", log);

  let debounceResult = null;
  const debounced = exercise3_debounce((val) => { debounceResult = val; }, 100);
  debounced("a"); debounced("b"); debounced("c");
  await new Promise(r => setTimeout(r, 150));
  console.log("Ex3 debounce:", debounceResult);

  const calls = [];
  const throttled = exercise4_throttle((val) => calls.push(val), 100);
  throttled("a"); throttled("b"); throttled("c");
  await new Promise(r => setTimeout(r, 150));
  throttled("d");
  console.log("Ex4 throttle:", calls);

  const createEventEmitter = exercise5_pubSub();
  const ee = createEventEmitter();
  const received = [];
  ee.on("data", (v) => received.push(v));
  ee.once("data", (v) => received.push("once:" + v));
  ee.emit("data", "hello");
  ee.emit("data", "world");
  console.log("Ex5 pub/sub:", received);

  const createStore = exercise6_observer();
  const store = createStore({ count: 0 });
  const logs = [];
  const unsub = store.subscribe(s => logs.push(s.count));
  store.setState(prev => ({ count: prev.count + 1 }));
  store.setState(prev => ({ count: prev.count + 1 }));
  unsub();
  store.setState(prev => ({ count: prev.count + 1 }));
  console.log("Ex6 observer:", logs, "final:", store.getState());
}

runTests();
