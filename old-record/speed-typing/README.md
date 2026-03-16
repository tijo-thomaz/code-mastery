# ⌨️ Speed Typing for Developers

> "The fastest way to slow down your coding is to type slowly." — Every senior dev ever

## Why Speed Typing Matters

Typing speed isn't about showing off — it's about **reducing the gap between thinking and implementing**. When you type at 80+ WPM with high accuracy:

- Your flow state lasts longer (no breaking concentration to hunt keys)
- Pair programming becomes less painful for your partner
- You spend mental energy on *logic*, not on *fingers*
- Terminal commands, Git workflows, and debugging get faster
- You write more tests because it doesn't feel like a chore

The goal isn't 150 WPM — it's **accurate, comfortable typing at 70-90 WPM** with code-specific characters.

---

## How to Practice: The Daily Routine

### 15-Minute Daily Warmup

| Minutes | Activity | Focus |
|---------|----------|-------|
| 0–3 | Regular English typing | Warm up fingers, build rhythm |
| 3–7 | Code-specific drills | Symbols: `{}`, `[]`, `()`, `=>`, `&&`, `||` |
| 7–12 | Language-specific practice | Real code snippets in your primary language |
| 12–15 | Speed push | Type as fast as you can, accept more errors |

**When to practice:** First thing in the morning, before you open Slack. Make it a habit like brushing your teeth.

**Consistency beats intensity.** 15 minutes daily for 30 days beats 2 hours once a week.

---

## Tools & Platforms

### Code-Specific Typing

| Tool | Best For | Link |
|------|----------|------|
| **SpeedCoder** | Language-specific code typing | [speedcoder.net](http://www.speedcoder.net/) |
| **typing.io** | Real open-source code snippets | [typing.io](https://typing.io/) |
| **keybr.com** | Adaptive key training, finds your weak keys | [keybr.com](https://www.keybr.com/) |
| **monkeytype.com** | Customizable, tracks progress, great UI | [monkeytype.com](https://monkeytype.com/) |

### Setup Tips

- On **monkeytype**, enable punctuation and numbers mode — default word lists don't use symbols
- On **keybr**, let it run for a few sessions before it adapts to your weaknesses
- On **typing.io**, pick your primary language and grind through real codebases

---

## Keyboard Shortcuts Every Dev Should Know

### VS Code

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick file open |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+D` | Select next occurrence |
| `Ctrl+Shift+K` | Delete line |
| `Alt+Up/Down` | Move line up/down |
| `Ctrl+Shift+L` | Select all occurrences |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+` ` | Toggle terminal |
| `Ctrl+/` | Toggle comment |
| `F2` | Rename symbol |
| `Ctrl+Shift+F` | Search across files |
| `Ctrl+K Ctrl+S` | Open keyboard shortcuts |

### Terminal / Shell

| Shortcut | Action |
|----------|--------|
| `Ctrl+R` | Reverse search command history |
| `Ctrl+A` | Jump to start of line |
| `Ctrl+E` | Jump to end of line |
| `Ctrl+W` | Delete word backward |
| `Ctrl+U` | Delete entire line |
| `Ctrl+L` | Clear screen |
| `Alt+B / Alt+F` | Move back/forward one word |
| `!!` | Repeat last command |
| `Tab` | Auto-complete (use it constantly) |

### Browser DevTools

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+I` | Open DevTools |
| `Ctrl+Shift+J` | Open Console |
| `Ctrl+Shift+C` | Inspect element |
| `Ctrl+K` (in Console) | Clear console |

---

## Progress Tracking

Use this template to track your weekly progress:

```markdown
## Week of: ____

| Day | WPM | Accuracy | Tool Used | Notes |
|-----|-----|----------|-----------|-------|
| Mon |     |          |           |       |
| Tue |     |          |           |       |
| Wed |     |          |           |       |
| Thu |     |          |           |       |
| Fri |     |          |           |       |
| Sat |     |          |           |       |
| Sun |     |          |           |       |

**Weekly avg WPM:** ___
**Weekly avg accuracy:** ___
**Weakest keys this week:** ___
**Goal for next week:** ___
```

---

## Core Tips

### 1. Accuracy First, Speed Second

This is the single most important rule. If you're typing at 60 WPM with 98% accuracy, you're in a better place than 80 WPM with 90% accuracy. Errors cost time — you have to notice them, move the cursor, delete, retype. That 10% error rate destroys your effective WPM.

**Rule of thumb:** If your accuracy drops below 95%, slow down.

### 2. Don't Look at the Keyboard

If you still look down, force yourself to stop. Cover the keyboard with a towel if you have to. It's painful for a week, then it clicks.

### 3. Use All Your Fingers

If you're a 4-finger typer doing 50 WPM, you'll plateau. Learn proper touch typing form. It's a one-time investment that pays forever.

### 4. Learn to Type Symbols Without Thinking

As a developer, you type `()`, `{}`, `[]`, `=>`, `===`, `!==`, `&&`, `||` hundreds of times a day. These need to be muscle memory, not a conscious effort.

### 5. Practice in Your Editor

Don't just practice on typing websites. Spend time typing actual code in your editor. Rebuild small functions from memory. Type out algorithms.

---

## Language-Specific Tips

### JavaScript / TypeScript

JS/TS is **symbol-heavy**. You'll type these constantly:

```
{}  []  ()  =>  ===  !==  &&  ||  ?.  ??  ...  ``  ${}
```

**Drills:** Type these 10 times each, fast:
```
const fn = () => {}
const { name, age } = user
arr.map((item) => item.id)
obj?.nested?.value ?? 'default'
`Hello ${name}, you are ${age}`
```

### Go

Go has its own character patterns:

```
:=  <-  func()  error  nil  defer  go func(){}()
```

**Drills:**
```
val, err := doSomething()
if err != nil { return err }
ch := make(chan int)
go func() { ch <- 42 }()
defer file.Close()
```

### Python

Python is lighter on symbols but heavy on indentation and colons:

```
:  def  self.  __init__  -> None  f""  [x for x in]
```

### Common Across Languages

Practice these patterns until they're automatic:
```
// Comments
/* Block comments */
console.log() / fmt.Println() / print()
for loops with i, j, k
if/else blocks
function signatures with types
import statements
```

---

## 30-Day Challenge Schedule

### Week 1: Foundation (Build the Habit)
| Day | Focus | Duration | Tool |
|-----|-------|----------|------|
| 1 | Baseline test — record your starting WPM & accuracy | 15 min | monkeytype |
| 2 | Home row drills | 15 min | keybr |
| 3 | Top row focus | 15 min | keybr |
| 4 | Bottom row focus | 15 min | keybr |
| 5 | Number row | 15 min | keybr |
| 6 | Symbols: `()`, `{}`, `[]` | 15 min | SpeedCoder |
| 7 | Rest day — just do a quick 5 min warmup | 5 min | monkeytype |

### Week 2: Code-Specific (Build the Skill)
| Day | Focus | Duration | Tool |
|-----|-------|----------|------|
| 8 | JavaScript snippets | 15 min | typing.io |
| 9 | Arrow functions & destructuring drills | 15 min | SpeedCoder |
| 10 | Go snippets | 15 min | typing.io |
| 11 | Mixed symbols speed drill | 15 min | monkeytype (punctuation mode) |
| 12 | Type out a real function from memory | 15 min | Your editor |
| 13 | VS Code shortcuts practice | 15 min | Your editor |
| 14 | Progress check — test WPM & accuracy | 15 min | monkeytype |

### Week 3: Speed Push (Build the Speed)
| Day | Focus | Duration | Tool |
|-----|-------|----------|------|
| 15 | Speed test — push 5 WPM above comfort | 20 min | monkeytype |
| 16 | Weakest keys drill (check keybr stats) | 15 min | keybr |
| 17 | Full code file typing | 20 min | typing.io |
| 18 | Terminal commands speed drill | 15 min | Terminal |
| 19 | Type a small component from scratch | 20 min | Your editor |
| 20 | Speed test | 15 min | monkeytype |
| 21 | Rest day | 5 min | — |

### Week 4: Integration (Build the Workflow)
| Day | Focus | Duration | Tool |
|-----|-------|----------|------|
| 22 | Code + shortcuts combined drill | 20 min | Your editor |
| 23 | Pair-programming simulation (type while explaining) | 20 min | Your editor |
| 24 | Timed coding challenge (type a LeetCode solution) | 20 min | Your editor |
| 25 | Weakest area revisit | 15 min | keybr |
| 26 | Full speed code session | 20 min | typing.io |
| 27 | Practice under pressure (timed tests) | 15 min | monkeytype |
| 28 | Speed test — push for new personal best | 15 min | monkeytype |
| 29 | Review all progress, identify remaining gaps | 15 min | — |
| 30 | Final baseline test — compare with Day 1 | 15 min | monkeytype |

### What to Expect

| Week | Realistic Improvement |
|------|-----------------------|
| After Week 1 | +3–5 WPM, better accuracy on weak keys |
| After Week 2 | +5–8 WPM, symbols feel more natural |
| After Week 3 | +8–12 WPM, coding feels noticeably faster |
| After Week 4 | +10–15 WPM total, new baseline established |

---

## Final Thought

Typing faster won't make you a better programmer. But it will **remove friction** between your brain and the screen. And less friction means more time in flow, more experiments tried, more tests written, and more code shipped.

Start today. Set a timer for 15 minutes. Go to [monkeytype.com](https://monkeytype.com/) and get your baseline.
