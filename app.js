const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store
let todos = [
  { id: 1, task: "Learn Express", completed: false },
  { id: 2, task: "Build a Todo API", completed: true },
  { id: 3, task: "Submit GitHub link", completed: false },
];
let nextId = 4;

// READ ALL
app.get("/todos", (req, res) => {
  res.json(todos);
});

// ARRAY BONUS: active todos (must come BEFORE /todos/:id)
app.get("/todos/active", (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active);
});

// SINGLE READ
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
});

// CREATE (with validation)
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== "string" || task.trim() === "") {
    return res.status(400).json({ error: 'The "task" field is required' });
  }
  const newTodo = { id: nextId++, task: task.trim(), completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// UPDATE
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const { task, completed } = req.body;
  if (task !== undefined) {
    if (typeof task !== "string" || task.trim() === "") {
      return res.status(400).json({ error: '"task" must be a non-empty string' });
    }
    todo.task = task.trim();
  }
  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }
  res.json(todo);
});

// DELETE
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const [removed] = todos.splice(index, 1);
  res.json({ message: "Todo deleted", todo: removed });
});

app.listen(PORT, () => {
  console.log(`Todo API running on http://localhost:${PORT}`);
});