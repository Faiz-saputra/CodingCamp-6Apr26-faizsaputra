'use strict';

// ============================================================
// StorageService — thin wrapper around localStorage
// ============================================================
const StorageService = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (e) {
      console.warn(`StorageService.get failed for key "${key}":`, e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`StorageService.set failed for key "${key}":`, e);
    }
  },
};

// ============================================================
// GreetingWidget — time / date / greeting display
// ============================================================
const GREETINGS = [
  { start:  5, end: 11, message: 'Good morning'   },
  { start: 12, end: 17, message: 'Good afternoon' },
  { start: 18, end: 21, message: 'Good evening'   },
  // 22–23 and 0–4 → "Good night"
];

function getGreeting(hour) {
  const match = GREETINGS.find(g => hour >= g.start && hour <= g.end);
  return match ? match.message : 'Good night';
}

const GreetingWidget = {
  _elMessage: null,
  _elTime: null,
  _elDate: null,

  init() {
    this._elMessage = document.getElementById('greeting-message');
    this._elTime    = document.getElementById('greeting-time');
    this._elDate    = document.getElementById('greeting-date');

    this._tick();
    setInterval(() => this._tick(), 1000);
  },

  _tick() {
    const now  = new Date();
    const hour = now.getHours();
    const min  = now.getMinutes();

    const hh = String(hour).padStart(2, '0');
    const mm = String(min).padStart(2, '0');

    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month:   'long',
      day:     'numeric',
      year:    'numeric',
    });

    this._elMessage.textContent = getGreeting(hour);
    this._elTime.textContent    = `${hh}:${mm}`;
    this._elDate.textContent    = dateStr;
  },
};

// ============================================================
// FocusTimerWidget — 25-minute countdown timer
// ============================================================
const FocusTimerWidget = {
  state: { remaining: 1500, running: false },

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  _intervalId: null,
  _elDisplay: null,
  _btnStart: null,
  _btnStop: null,
  _btnReset: null,

  init() {
    this._elDisplay = document.getElementById('timer-display');
    this._btnStart  = document.getElementById('timer-start');
    this._btnStop   = document.getElementById('timer-stop');
    this._btnReset  = document.getElementById('timer-reset');

    this._btnStart.addEventListener('click', () => this._start());
    this._btnStop.addEventListener('click',  () => this._stop());
    this._btnReset.addEventListener('click', () => this._reset());

    this._render();
  },

  _render() {
    this._elDisplay.textContent = this.formatTime(this.state.remaining);
  },

  _start() {
    if (this.state.running) return;
    this.state.running = true;
    this._btnStart.disabled = true;
    this._btnStop.disabled  = false;

    this._intervalId = setInterval(() => this._tick(), 1000);
  },

  _stop() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this.state.running = false;
    this._btnStart.disabled = false;
    this._btnStop.disabled  = true;
  },

  _reset() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    this.state.running   = false;
    this.state.remaining = 1500;
    this._btnStart.disabled = false;
    this._btnStop.disabled  = true;
    this._render();
  },

  _tick() {
    this.state.remaining -= 1;
    this._render();

    if (this.state.remaining <= 0) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      this.state.running = false;
      this._btnStart.disabled = false;
      this._btnStop.disabled  = true;
    }
  },
};

// ============================================================
// TodoWidget — task CRUD + persistence
// ============================================================
const TodoWidget = {
  _tasks: [],
  _storageKey: 'dashboard_todos',
  _elForm: null,
  _elInput: null,
  _elList: null,

  _generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString() + Math.random();
  },

  addTask(description) {
    const trimmed = description.trim();
    if (!trimmed) {
      this._elInput.focus();
      return;
    }
    const task = { id: this._generateId(), description: trimmed, completed: false };
    this._tasks.push(task);
    StorageService.set(this._storageKey, this._tasks);
    this.renderTasks();
    this._elInput.value = '';
    this._elInput.focus();
  },

  renderTasks() {
    this._elList.innerHTML = '';
    this._tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo__item';
      li.dataset.id = task.id;

      // Completion toggle
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'btn todo__toggle';
      toggle.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
      toggle.textContent = task.completed ? '✓' : '○';
      toggle.addEventListener('click', () => this._toggleTask(task.id));

      // Description
      const span = document.createElement('span');
      span.className = 'todo__description' + (task.completed ? ' todo__description--done' : '');
      span.textContent = task.description;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn todo__edit';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => this._editTask(task.id));

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn todo__delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this._deleteTask(task.id));

      li.append(toggle, span, editBtn, deleteBtn);
      this._elList.appendChild(li);
    });
  },

  _toggleTask(id) {
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    StorageService.set(this._storageKey, this._tasks);
    this.renderTasks();
  },

  _deleteTask(id) {
    this._tasks = this._tasks.filter(t => t.id !== id);
    StorageService.set(this._storageKey, this._tasks);
    this.renderTasks();
  },

  _editTask(id) {
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;

    const li = this._elList.querySelector(`[data-id="${id}"]`);
    if (!li) return;

    // Replace content with inline edit form
    li.innerHTML = '';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'input todo__edit-input';
    editInput.value = task.description;
    editInput.setAttribute('aria-label', 'Edit task description');

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn todo__save';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn todo__cancel';
    cancelBtn.textContent = 'Cancel';

    const save = () => {
      const newDesc = editInput.value.trim();
      if (newDesc) {
        task.description = newDesc;
        StorageService.set(this._storageKey, this._tasks);
      }
      this.renderTasks();
    };

    const cancel = () => this.renderTasks();

    saveBtn.addEventListener('click', save);
    cancelBtn.addEventListener('click', cancel);
    editInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') cancel();
    });

    li.append(editInput, saveBtn, cancelBtn);
    editInput.focus();
  },

  init() {
    this._elForm  = document.getElementById('todo-form');
    this._elInput = document.getElementById('todo-input');
    this._elList  = document.getElementById('todo-list');

    this._tasks = StorageService.get(this._storageKey) || [];
    this.renderTasks();

    this._elForm.addEventListener('submit', e => {
      e.preventDefault();
      this.addTask(this._elInput.value);
    });
  },
};

// ============================================================
// QuickLinksWidget — link CRUD + persistence
// ============================================================
const QuickLinksWidget = {
  _links: [],
  _storageKey: 'dashboard_links',
  _elForm: null,
  _elLabelInput: null,
  _elUrlInput: null,
  _elList: null,

  _generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString() + Math.random();
  },

  addLink(label, url) {
    const trimmedLabel = label.trim();
    const trimmedUrl   = url.trim();
    if (!trimmedLabel || !trimmedUrl) return;

    const link = { id: this._generateId(), label: trimmedLabel, url: trimmedUrl };
    this._links.push(link);
    StorageService.set(this._storageKey, this._links);
    this.renderLinks();
  },

  renderLinks() {
    this._elList.innerHTML = '';
    this._links.forEach(link => {
      const item = document.createElement('div');
      item.className = 'links__item';
      item.dataset.id = link.id;

      const linkBtn = document.createElement('button');
      linkBtn.type = 'button';
      linkBtn.className = 'btn links__link';
      linkBtn.textContent = link.label;
      linkBtn.setAttribute('aria-label', `Open ${link.label}`);
      linkBtn.addEventListener('click', () => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn links__delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete ${link.label}`);
      deleteBtn.addEventListener('click', () => this._deleteLink(link.id));

      item.append(linkBtn, deleteBtn);
      this._elList.appendChild(item);
    });
  },

  _deleteLink(id) {
    this._links = this._links.filter(l => l.id !== id);
    StorageService.set(this._storageKey, this._links);
    this.renderLinks();
  },

  init() {
    this._elForm       = document.getElementById('links-form');
    this._elLabelInput = document.getElementById('links-label-input');
    this._elUrlInput   = document.getElementById('links-url-input');
    this._elList       = document.getElementById('links-list');

    this._links = StorageService.get(this._storageKey) || [];
    this.renderLinks();

    this._elForm.addEventListener('submit', e => {
      e.preventDefault();
      this.addLink(this._elLabelInput.value, this._elUrlInput.value);
      this._elLabelInput.value = '';
      this._elUrlInput.value   = '';
      this._elLabelInput.focus();
    });
  },
};

// ============================================================
// Bootstrap
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  GreetingWidget.init();
  FocusTimerWidget.init();
  TodoWidget.init();
  QuickLinksWidget.init();
});
