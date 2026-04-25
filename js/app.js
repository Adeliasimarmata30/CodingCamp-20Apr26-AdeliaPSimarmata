// ============================================================
//  LIFE DASHBOARD — app.js
//  Features: Clock, Greeting, Focus Timer, To-Do, Quick Links
//  Challenges: Light/Dark Mode, Custom Name, Prevent Duplicates, Change Pomodoro Time
// ============================================================

// ── THEME TOGGLE ────────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

themeBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});

applyTheme(currentTheme);

// ── CLOCK & GREETING ─────────────────────────────────────────
const clockEl    = document.getElementById('clock');
const dateEl     = document.getElementById('date-display');
const greetingEl = document.getElementById('greeting-text');
const nameInput  = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');

let userName = localStorage.getItem('userName') || '';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function updateGreeting() {
  const name = userName ? `, ${userName}` : '!';
  greetingEl.textContent = getGreeting() + name;
}

function updateClock() {
  const now = new Date();

  // Clock
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;

  // Date
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  updateGreeting();
}

// Name save
if (userName) nameInput.value = userName;

saveNameBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (val) {
    userName = val;
    localStorage.setItem('userName', userName);
    updateGreeting();
    nameInput.blur();
  }
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveNameBtn.click();
});

setInterval(updateClock, 1000);
updateClock();

// ── FOCUS TIMER ──────────────────────────────────────────────
const timerDisplay  = document.getElementById('timer-display');
const startBtn      = document.getElementById('start-btn');
const stopBtn       = document.getElementById('stop-btn');
const resetBtn      = document.getElementById('reset-btn');
const timerStatus   = document.getElementById('timer-status');
const pomodoroInput = document.getElementById('pomodoro-input');
const setDurationBtn = document.getElementById('set-duration-btn');

let pomoDuration  = parseInt(localStorage.getItem('pomodoroDuration')) || 25;
let timerSeconds  = pomoDuration * 60;
let timerInterval = null;
let timerRunning  = false;

pomodoroInput.value = pomoDuration;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

setDurationBtn.addEventListener('click', () => {
  const val = parseInt(pomodoroInput.value);
  if (val >= 1 && val <= 120) {
    pomoDuration = val;
    localStorage.setItem('pomodoroDuration', pomoDuration);
    timerSeconds = pomoDuration * 60;
    renderTimer();
    timerStatus.textContent = `Duration set to ${pomoDuration} min`;
    setTimeout(() => timerStatus.textContent = '', 2000);
  }
});

startBtn.addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  timerStatus.textContent = '🎯 Focus mode ON!';
  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStatus.textContent = '🎉 Session complete!';
      return;
    }
    timerSeconds--;
    renderTimer();
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerStatus.textContent = '⏸ Paused';
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = pomoDuration * 60;
  renderTimer();
  timerStatus.textContent = '';
});

renderTimer();

// ── TO-DO LIST ────────────────────────────────────────────────
const taskInput   = document.getElementById('task-input');
const addTaskBtn  = document.getElementById('add-task-btn');
const taskList    = document.getElementById('task-list');
const taskCount   = document.getElementById('task-count');
const dupWarning  = document.getElementById('duplicate-warning');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
  const done = tasks.filter(t => t.done).length;
  taskCount.textContent = `${done} / ${tasks.length} tasks completed`;
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.done) li.classList.add('done');

    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} data-index="${index}" />
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="btn-icon edit" data-index="${index}" title="Edit">✏️</button>
        <button class="btn-icon delete" data-index="${index}" title="Delete">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateTaskCount();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function isDuplicate(text) {
  return tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  // Prevent duplicate
  if (isDuplicate(text)) {
    dupWarning.style.display = 'block';
    setTimeout(() => dupWarning.style.display = 'none', 2500);
    return;
  }

  dupWarning.style.display = 'none';
  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });

taskList.addEventListener('click', (e) => {
  const idx = parseInt(e.target.dataset.index);

  // Toggle done
  if (e.target.type === 'checkbox') {
    tasks[idx].done = e.target.checked;
    saveTasks();
    renderTasks();
    return;
  }

  // Delete
  if (e.target.classList.contains('delete')) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
    return;
  }

  // Edit
  if (e.target.classList.contains('edit')) {
    const li = e.target.closest('.task-item');
    const textSpan = li.querySelector('.task-text');
    const current = tasks[idx].text;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = current;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-icon save';
    saveBtn.textContent = '💾';
    saveBtn.title = 'Save';

    textSpan.replaceWith(editInput);
    e.target.replaceWith(saveBtn);
    editInput.focus();

    function saveEdit() {
      const newText = editInput.value.trim();
      if (!newText) return;
      // Check duplicate (excluding itself)
      const others = tasks.filter((_, i) => i !== idx);
      if (others.some(t => t.text.toLowerCase() === newText.toLowerCase())) {
        dupWarning.style.display = 'block';
        setTimeout(() => dupWarning.style.display = 'none', 2500);
        return;
      }
      tasks[idx].text = newText;
      saveTasks();
      renderTasks();
    }

    saveBtn.addEventListener('click', saveEdit);
    editInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') saveEdit(); });
  }
});

renderTasks();

// ── QUICK LINKS ───────────────────────────────────────────────
const linkNameInput  = document.getElementById('link-name-input');
const linkUrlInput   = document.getElementById('link-url-input');
const addLinkBtn     = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');

let links = JSON.parse(localStorage.getItem('quickLinks')) || [
  { name: 'Google', url: 'https://google.com' },
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'GitHub', url: 'https://github.com' }
];

function saveLinks() {
  localStorage.setItem('quickLinks', JSON.stringify(links));
}

function renderLinks() {
  linksContainer.innerHTML = '';
  links.forEach((link, i) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip-wrapper';
    chip.innerHTML = `
      <a href="${link.url}" target="_blank" rel="noopener" class="link-chip">
        🔗 ${escapeHtml(link.name)}
        <button class="remove-link" data-index="${i}" title="Remove">✕</button>
      </a>
    `;
    linksContainer.appendChild(chip);
  });
}

addLinkBtn.addEventListener('click', () => {
  const name = linkNameInput.value.trim();
  let url    = linkUrlInput.value.trim();
  if (!name || !url) return;

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  links.push({ name, url });
  saveLinks();
  renderLinks();
  linkNameInput.value = '';
  linkUrlInput.value = '';
});

linksContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-link')) {
    e.preventDefault();
    const idx = parseInt(e.target.dataset.index);
    links.splice(idx, 1);
    saveLinks();
    renderLinks();
  }
});

renderLinks();
