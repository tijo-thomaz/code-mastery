// ========================================
// DAY 1 — REACT DRILL: Counter with Step
// ========================================
// Timer: START NOW. Target: 10 minutes.
//
// TASK: Build a counter component with:
// - Display current count
// - + button (increment by step)
// - - button (decrement by step)
// - Input field to change the step value (default: 1)
// - Reset button (back to 0)
//
// NO GOOGLING. Type from memory.
// ========================================

function Counter() {
  // YOUR SOLUTION HERE:

  const [step, setStep] = useState(1);
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter((prev) => prev + step);
  };

  const decrement = () => {
    setCounter((prev) => Math.max(0, prev - step));
  };

  const reset = () => {
    setCounter(0);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="number"
          value={step}
          onChange={(e) => {
            const val = Number(e.target.value);
            setStep(val >= 1 ? val : 1);
          }}
        />
        <button onClick={increment}>+</button>

        {counter}

        <button onClick={decrement}>-</button>
        <button onClick={reset}>reset</button>
      </div>
    </>
  );
}

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
