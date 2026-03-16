// ========================================
// DAY 3 — REACT DRILL: Todo (Add + Delete + Toggle + Filter)
// ========================================
// Timer: START NOW. Target: 12 minutes.
//
// TASK: Build a full todo with:
// - Add todo (input + button + Enter key)
// - Delete todo
// - Toggle done/undone (click on text = strikethrough)
// - Filter buttons: All | Active | Completed
// - Count: "2 active items left"
// - Cannot add empty
//
// This is the EXACT component that keeps showing up.
// NO GOOGLING. Type from memory.
// ========================================

const DATA = [
  {
    id: 1,
    content: "task1",
    status: "active",
  },
  {
    id: 2,
    content: "task3",
    status: "complete",
  },
];

function TodoApp() {
  // YOUR SOLUTION HERE:
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [sortKey, setSortKey] = useState("All");

  const addTodo = () => {
    if (!input.trim()) return;
    setData((prev) => [
      ...prev,
      { id: Date.now(), content: input, status: "active" },
    ]);
    setInput("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const deleteTodo = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const toggle = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "complete" : "active",
            }
          : item,
      ),
    );
  };

  const filtered = data.filter((item) => {
    if (sortKey === "All") return true;
    return item.status === sortKey;
  });

  return (
    <div>
      <input
        value={input}
        onKeyDown={handleEnter}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <button onClick={addTodo}>Add</button>

      {["All", "active", "complete"].map((f) => (
        <button
          key={f}
          onClick={() => {
            setSortKey(f);
          }}
        >
          {f}
        </button>
      ))}

      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            <span
              onClick={() => {
                toggle(item.id);
              }}
              style={{
                textDecoration:
                  item.status === "complete" ? "line-through" : "none",
              }}
            >
              {item.content}
            </span>
            <button
              onClick={() => {
                deleteTodo(item.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p>
        {data.filter((i) => i.status === "active").length} active items left
      </p>
    </div>
  );
}

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
