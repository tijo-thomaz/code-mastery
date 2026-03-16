// ========================================
// DAY 2 — REACT DRILL: Todo List (Add + Delete)
// ========================================
// Timer: START NOW. Target: 10 minutes.
//
// TASK: Build a todo component with:
// - Input field to type a todo
// - Add button (or Enter key) to add it to the list
// - Each todo shows text + delete button
// - Cannot add empty todos
// - Clear input after adding
// - Display count: "3 items"
//
// NO GOOGLING. Type from memory.
// ========================================

const DATA = [
  { id: 1, content: "test1todo" },
  { id: 2, content: "test2todo" },
];

function TodoList() {
  // YOUR SOLUTION HERE:
  const [input, setInput] = useState("");
  const [data, setData] = useState(DATA);

  const addTodo = () => {
    if (!input.trim()) return;
    setData((prev) => [...prev, { id: Date.now(), content: input }]);
    setInput("");
  };

  const deleteTodo = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <button onClick={addTodo}>Add</button>

      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.content}
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
    </>
  );
}

// ========================================
// DONE? Write below:
// Time taken: ___
// Peeked? Yes / No
// What tripped me: ___
// ========================================
