const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- tiny "database": a JSON file on disk ---
function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// --- API routes ---

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

// Create a task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const tasks = readTasks();
  const task = {
    id: Date.now().toString(),
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Toggle / update a task
app.patch('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (typeof req.body.done === 'boolean') task.done = req.body.done;
  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    task.title = req.body.title.trim();
  }
  writeTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const next = tasks.filter((t) => t.id !== req.params.id);
  writeTasks(next);
  res.status(204).end();
});

// Simple health check — handy for confirming a Render deploy is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
