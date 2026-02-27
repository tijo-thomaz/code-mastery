# 🖱️ DOM APIs & Events — Senior Interview Cheatsheet

> Format: One-line summary → How it works → Real example → Trade-off
> Read once. Close. Explain out loud. Repeat until boring.

---

## 1. What is the DOM?

**One-line:** The DOM (Document Object Model) is a tree-shaped API that the browser creates from HTML — it lets JavaScript read, modify, and react to the page structure.

```
HTML Source:                      DOM Tree:
<html>                            Document
  <body>                            └── html
    <div id="app">                       └── body
      <h1>Hello</h1>                          └── div#app
      <p>World</p>                                 ├── h1
    </div>                                         │    └── "Hello" (text node)
  </body>                                         └── p
</html>                                                └── "World" (text node)
```

**DOM vs Virtual DOM:**
```
Real DOM  → Browser's actual tree. Changing it triggers layout/paint (expensive).
Virtual DOM → React's lightweight JS copy. React diffs the virtual tree,
              then makes the MINIMUM changes to the real DOM.
              This is why React is fast — it batches and minimizes DOM mutations.
```

**Say this in interview:**
> "The DOM is the browser's live tree representation of the HTML. Direct DOM manipulation is expensive because each change can trigger layout recalculation and repaint. React's Virtual DOM solves this by keeping a lightweight JS copy, diffing it on state changes, and batching only the minimal necessary real DOM updates."

---

## 2. DOM Selection

```javascript
// By ID — returns single element (fastest)
const el = document.getElementById('app');

// By CSS selector — returns first match
const el = document.querySelector('.card');

// By CSS selector — returns ALL matches (NodeList)
const els = document.querySelectorAll('.card');

// Older APIs (still work, rarely needed)
const els = document.getElementsByClassName('card');  // returns live HTMLCollection
const els = document.getElementsByTagName('div');     // returns live HTMLCollection
```

**querySelector vs getElementById:**
```
getElementById       → Fastest. Only works with IDs.
querySelector        → More flexible (any CSS selector). Slightly slower.
querySelectorAll     → Returns static NodeList (snapshot).
getElementsBy*       → Returns LIVE HTMLCollection (updates when DOM changes).
```

**Say this in interview:**
> "I use querySelector for flexibility — it takes any CSS selector. getElementById is faster for ID lookups. The key difference with getElementsBy methods is they return a live collection that updates automatically, while querySelectorAll returns a static snapshot."

---

## 3. DOM Manipulation

```javascript
// Create
const div = document.createElement('div');
div.textContent = 'Hello';         // Safe — escapes HTML
div.innerHTML = '<b>Hello</b>';    // ⚠️ Parses HTML — XSS risk with user input
div.classList.add('card');
div.setAttribute('data-id', '42');

// Insert
parent.appendChild(div);           // Add at end
parent.insertBefore(div, refNode); // Add before a specific child
parent.prepend(div);               // Add at beginning

// Remove
parent.removeChild(div);           // Old way
div.remove();                      // Modern way (IE11+)

// classList API (modern, clean)
el.classList.add('active');
el.classList.remove('active');
el.classList.toggle('active');      // Add if missing, remove if present
el.classList.contains('active');    // Returns boolean
```

**textContent vs innerHTML:**
```javascript
// textContent — SAFE (escapes HTML, just sets text)
el.textContent = userInput;  // <script>alert('xss')</script> → shows as text

// innerHTML — DANGEROUS with user input (parses and executes HTML)
el.innerHTML = userInput;    // <script>alert('xss')</script> → RUNS the script
```

**Say this in interview:**
> "I always use textContent for user-generated content because it escapes HTML automatically. innerHTML parses HTML and is an XSS vector if used with unescaped user input. In React, this distinction is why dangerouslySetInnerHTML exists — React forces you to be explicit about the risk."

---

## 4. Event Model — addEventListener

```javascript
// Modern way (preferred)
element.addEventListener('click', handler);
element.addEventListener('click', handler, { once: true });  // Auto-removes after first call
element.addEventListener('click', handler, { passive: true }); // Better scroll performance

// Remove listener (must pass same function reference)
element.removeEventListener('click', handler);

// The event object
element.addEventListener('click', (event) => {
  event.target;           // The element that was CLICKED (the actual target)
  event.currentTarget;    // The element the listener is ATTACHED to
  event.type;             // 'click'
  event.preventDefault(); // Stop default behavior (form submit, link navigation)
  event.stopPropagation(); // Stop event from bubbling up
});
```

---

## 5. Event Bubbling vs Capturing — The 3 Phases

**One-line:** When an event occurs, it travels DOWN from the document to the target (capturing), hits the target, then BUBBLES UP back to the document.

```
          Document
            │
       ┌────▼────┐
       │   body   │
       └────┬─────┘
       ┌────▼────┐
       │   div    │   ← has click listener
       └────┬─────┘
       ┌────▼────┐
       │  button  │   ← USER CLICKS HERE
       └─────────┘

Phase 1 — CAPTURING (top → down):
  Document → body → div → button
  (Rarely used. Listener: addEventListener('click', fn, true))

Phase 2 — TARGET:
  Event fires on button (the actual element clicked)

Phase 3 — BUBBLING (bottom → up):
  button → div → body → Document
  (Default behavior. This is how event delegation works.)
```

```javascript
// Default: listens during BUBBLING phase
parent.addEventListener('click', handler);

// Listen during CAPTURING phase (rare, use for intercepting before children)
parent.addEventListener('click', handler, true);  // or { capture: true }

// Stop bubbling — event won't reach parent listeners
button.addEventListener('click', (e) => {
  e.stopPropagation();  // Parent's click handler will NOT fire
});

// Stop default behavior — doesn't stop bubbling
link.addEventListener('click', (e) => {
  e.preventDefault();   // Link won't navigate, but event still bubbles
});
```

**Say this in interview:**
> "Events travel in three phases: capturing goes from the document down to the target, then the target phase fires on the clicked element, then bubbling goes back up to the document. By default, addEventListener listens during the bubbling phase. stopPropagation prevents the event from reaching parent handlers. preventDefault stops the browser's default action — like form submission or link navigation — but doesn't stop bubbling."

---

## 6. Event Delegation — THE Classic Question

**One-line:** Instead of attaching a listener to every child element, attach ONE listener to the parent and use `event.target` to figure out which child was clicked.

**Problem without delegation:**
```javascript
// ❌ BAD — 1000 items = 1000 listeners = slow
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});
// Also breaks when new items are added dynamically
```

**Solution with delegation:**
```javascript
// ✅ GOOD — 1 listener handles ALL items (existing + future)
document.getElementById('list').addEventListener('click', (e) => {
  const item = e.target.closest('.item'); // Find the clicked .item (handles nested elements)
  if (!item) return;                       // Clicked something else inside list

  const id = item.dataset.id;
  console.log('Clicked item:', id);
});
```

```html
<ul id="list">
  <li class="item" data-id="1"><span>Task 1</span> <button>Delete</button></li>
  <li class="item" data-id="2"><span>Task 2</span> <button>Delete</button></li>
  <!-- New items added dynamically also work — no need to re-attach listeners -->
</ul>
```

**Why it's powerful:**
```
1. Performance  → 1 listener instead of N listeners
2. Dynamic      → New elements added later automatically work
3. Memory       → Less memory usage (fewer function references)
4. Cleanup      → Remove one listener instead of N
```

**The `closest()` trick:**
```javascript
// e.target might be a <span> or <button> inside the <li>
// closest() walks UP the DOM tree to find the nearest matching ancestor
const item = e.target.closest('.item');  // Returns the <li> even if <span> was clicked
```

**Say this in interview:**
> "Event delegation uses bubbling to handle events on a parent instead of individual children. I attach one listener to the container, then use event.target.closest() to identify which child was interacted with. This is better for performance — especially with lists — and automatically handles dynamically added elements. React actually uses delegation internally — it attaches a single listener at the root."

---

## 7. React's Synthetic Events

**One-line:** React wraps native browser events in a SyntheticEvent object that works identically across all browsers.

```jsx
// React uses camelCase, not lowercase
<button onClick={handleClick}>         // not onclick
<input onChange={handleChange}>        // not onchange
<form onSubmit={handleSubmit}>         // not onsubmit

// The event object in React
function handleClick(e) {
  // e is a SyntheticEvent — same API as native event
  e.target;           // Works the same
  e.currentTarget;    // Works the same
  e.preventDefault(); // Works the same
  e.stopPropagation(); // Works the same
  e.nativeEvent;      // Access the underlying browser event if needed
}
```

**How React handles events differently:**
```
Vanilla JS:
  → Each addEventListener attaches directly to the element
  → You manage add/remove yourself

React:
  → Uses event delegation internally — one listener at the root
  → Wraps events in SyntheticEvent for cross-browser consistency
  → Pre-React 17: events delegated to document
  → React 17+: events delegated to the React root element
  → Automatic cleanup when component unmounts
```

**Event pooling (pre-React 17 — legacy but they might ask):**
```javascript
// Pre-React 17: SyntheticEvent was reused (pooled) for performance
// Accessing event properties asynchronously would fail
function handleClick(e) {
  setTimeout(() => {
    console.log(e.target); // ❌ Was null in React <17 (event recycled)
  }, 100);
}

// React 17+: Event pooling removed. Events work normally in async code.
```

**Say this in interview:**
> "React uses SyntheticEvent — a cross-browser wrapper around native events. React also uses event delegation internally, attaching a single listener at the root element instead of on each component. Since React 17, events delegate to the React root instead of the document, which improved compatibility with micro-frontends. Event pooling was removed in React 17, so you can safely access events asynchronously now."

---

## 8. requestAnimationFrame

**One-line:** rAF tells the browser to call your function before the next repaint — perfect for smooth 60fps animations.

```javascript
// Smooth animation loop
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;

  if (position < 500) {
    requestAnimationFrame(animate);  // Schedule next frame
  }
}
requestAnimationFrame(animate);

// Cancel
const id = requestAnimationFrame(animate);
cancelAnimationFrame(id);
```

**rAF vs setTimeout:**
```
setTimeout(fn, 16)           → Roughly 60fps, but NOT synced with browser paint
                               Can cause jank, runs even in background tabs

requestAnimationFrame(fn)    → Synced with browser paint cycle
                               Pauses in background tabs (saves battery)
                               Smoother animations, no wasted frames
```

---

## 9. IntersectionObserver

**One-line:** Efficiently detects when an element enters or leaves the viewport — used for lazy loading images, infinite scroll, and scroll-triggered animations.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is visible in viewport
      loadImage(entry.target);
      observer.unobserve(entry.target); // Stop watching after loading
    }
  });
}, {
  threshold: 0.1,      // Trigger when 10% visible
  rootMargin: '200px'  // Start loading 200px before visible (preload)
});

// Observe elements
document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

**Use cases:** Lazy loading images, infinite scroll trigger, analytics (was this section viewed?), animate-on-scroll.

---

## 10. event.target vs event.currentTarget

**The question they always ask:**

```javascript
document.getElementById('parent').addEventListener('click', (e) => {
  console.log(e.target);        // The element CLICKED (could be a child)
  console.log(e.currentTarget); // The element the LISTENER is on (always #parent)
});
```

```html
<div id="parent">
  <button id="child">Click me</button>
</div>

<!-- User clicks the button -->
<!-- e.target = <button> (what was actually clicked) -->
<!-- e.currentTarget = <div#parent> (where the listener is attached) -->
```

**Say this in interview:**
> "event.target is the element that actually received the interaction — the deepest element that was clicked. event.currentTarget is the element the event listener is attached to. They're the same when you click the exact element with the listener, but different when the event bubbles up from a child. This distinction is what makes event delegation work."

---

## Quick-Fire Interview Answers

| Question | Answer |
|---|---|
| "What is event delegation?" | "Attach one listener to the parent, use event.target to identify which child was interacted with. Leverages bubbling. Better performance, handles dynamic elements." |
| "Bubbling vs capturing?" | "Events travel down (capturing) then up (bubbling). Default is bubbling. Pass `true` as third arg to addEventListener for capturing. Use stopPropagation to stop either." |
| "target vs currentTarget?" | "target = what was clicked. currentTarget = what the listener is on. Different when events bubble." |
| "How does React handle events?" | "SyntheticEvent wrapper for cross-browser consistency. Delegates to root element (not individual nodes). camelCase naming. Auto-cleanup on unmount." |
| "stopPropagation vs preventDefault?" | "stopPropagation stops the event from reaching other listeners (parents). preventDefault stops the browser's default action (navigation, form submit). They're independent." |
| "DOM vs Virtual DOM?" | "Real DOM is the browser's tree — changes are expensive. Virtual DOM is React's JS copy — React diffs it and applies minimal real DOM updates." |
| "textContent vs innerHTML?" | "textContent sets plain text (safe). innerHTML parses HTML (XSS risk with user input). Always use textContent for user content." |
