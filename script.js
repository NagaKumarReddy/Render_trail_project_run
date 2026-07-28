const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const gaugeFill = document.getElementById('gaugeFill');
const gaugeText = document.getElementById('gaugeText');
const gaugePct = document.getElementById('gaugePct');
const rocket = document.getElementById('rocket');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  render(tasks);
}

function render(tasks) {
  taskList.innerHTML = '';
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task';

    const check = document.createElement('button');
    check.className = 'task__check' + (task.done ? ' done' : '');
    check.type = 'button';
    check.innerHTML = task.done ? '✓' : '';
    check.addEventListener('click', () => toggleTask(task));

    const title = document.createElement('span');
    title.className = 'task__title' + (task.done ? ' done' : '');
    title.textContent = task.title;

    const del = document.createElement('button');
    del.className = 'task__delete';
    del.type = 'button';
    del.innerHTML = '✕';
    del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => deleteTask(task.id));

    li.append(check, title, del);
    taskList.appendChild(li);
  });

  updateGauge(tasks);
}

function updateGauge(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  gaugeFill.style.width = pct + '%';
  rocket.style.left = pct + '%';
  gaugeText.textContent = `${done} / ${total} checks complete`;
  gaugePct.textContent = pct + '%';
}

async function addTask(title) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (res.ok) fetchTasks();
}

async function toggleTask(task) {
  await fetch(`/api/tasks/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !task.done }),
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
}

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      statusDot.classList.add('online');
      statusText.textContent = 'server online';
    } else {
      throw new Error('bad status');
    }
  } catch {
    statusDot.classList.add('offline');
    statusText.textContent = 'server unreachable';
  }
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  addTask(value);
  taskInput.value = '';
});

fetchTasks();
checkHealth();
