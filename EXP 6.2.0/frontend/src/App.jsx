import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';
const PAGE_SIZE = 5;

const emptySummary = {
  total: 0,
  completed: 0,
  pending: 0,
  dueToday: 0,
  dueTomorrow: 0,
  overdue: 0,
};

function formatDueDate(date) {
  if (!date) return 'No due date';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDueStatus(task) {
  if (!task.dueDate) return null;
  if (task.completed) return { label: 'Completed', className: 'due-complete' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T00:00:00`);
  const diff = Math.round((due - today) / 86400000);

  if (diff < 0) return { label: 'Overdue', className: 'due-overdue' };
  if (diff === 0) return { label: 'Due today', className: 'due-today' };
  if (diff === 1) return { label: 'Due tomorrow', className: 'due-tomorrow' };
  return { label: formatDueDate(task.dueDate), className: 'due-upcoming' };
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id,desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state is still handled by the backend through Pageable.
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Summary is fetched separately so the dashboard represents the whole database,
  // not just the five tasks visible on the current page.
  const [summary, setSummary] = useState(emptySummary);

  const searchActive = search.trim().length > 0;

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint = searchActive ? `${API_URL}/search` : API_URL;
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
        sort,
      });

      if (searchActive) params.set('keyword', search.trim());

      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setTasks(data.content || []);
      setTotalPages(Math.max(data.totalPages || 1, 1));
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not connect to the backend. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, searchActive ? 250 : 0);

    return () => clearTimeout(timer);
  }, [page, search, sort]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const completionPercent = useMemo(() => {
    if (!summary.total) return 0;
    return Math.round((summary.completed / summary.total) * 100);
  }, [summary]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(0);
  };

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setError('');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          completed: false,
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to add task');

      setNewTaskTitle('');
      setPriority('MEDIUM');
      setDueDate('');
      setSearch('');
      setSort('id,desc');
      setPage(0);
      await Promise.all([fetchSummary(), fetchTasks()]);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Could not add the task.');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
      await fetchSummary();
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Could not update the task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      // If the last item on a later page was deleted, move back one page.
      if (tasks.length === 1 && page > 0) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await fetchTasks();
      }
      await fetchSummary();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Could not delete the task.');
    }
  };

  return (
    <div className="app-container">
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="glass-card">
        <header className="header">
          <div className="eyebrow">EXPERIMENT 6 · SCALABLE APIs & CACHING</div>
          <h1 className="title">Student Task Manager</h1>
          <p className="subtitle">Plan clearly. Finish what matters.</p>
        </header>

        <section className="progress-card" aria-label="Task completion progress">
          <div className="progress-copy">
            <div className="progress-kicker">TODAY'S PROGRESS</div>
            <div className="progress-number-row">
              <span className="progress-number">{completionPercent}%</span>
              <span className="progress-label">complete</span>
            </div>
            <p>
              {summary.completed} of {summary.total} {summary.total === 1 ? 'task' : 'tasks'} completed
            </p>
          </div>

          <div className="progress-ring" style={{ '--progress': `${completionPercent * 3.6}deg` }}>
            <div className="progress-ring-inner">
              <span>{summary.completed}</span>
              <small>DONE</small>
            </div>
          </div>
        </section>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${completionPercent}%` }}></div>
        </div>

        <section className="deadline-strip" aria-label="Deadline summary">
          <div className="deadline-item today">
            <span className="deadline-icon">●</span>
            <div><strong>{summary.dueToday}</strong><span>Due today</span></div>
          </div>
          <div className="deadline-item tomorrow">
            <span className="deadline-icon">◐</span>
            <div><strong>{summary.dueTomorrow}</strong><span>Tomorrow</span></div>
          </div>
          <div className="deadline-item overdue">
            <span className="deadline-icon">!</span>
            <div><strong>{summary.overdue}</strong><span>Overdue</span></div>
          </div>
        </section>

        <section className="toolbar">
          <div className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
            </svg>
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search tasks"
            />
            {search && (
              <button className="clear-search" type="button" onClick={() => { setSearch(''); setPage(0); }} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <label className="select-control">
            <span>Sort</span>
            <select value={sort} onChange={handleSortChange}>
              <option value="id,desc">Newest</option>
              <option value="id,asc">Oldest</option>
              <option value="title,asc">A–Z</option>
              <option value="title,desc">Z–A</option>
              <option value="dueDate,asc">Due date</option>
            </select>
          </label>
        </section>

        <form onSubmit={handleAddTask} className="add-task-card">
          <div className="add-title-row">
            <div className="input-group">
              <input
                type="text"
                className="task-input"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                maxLength={120}
              />
              <div className="input-glow"></div>
            </div>
            <button type="submit" className="add-button">
              <span className="btn-text">Add Task</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          <div className="task-options">
            <div className="option-group">
              <span className="option-label">Priority</span>
              <div className="priority-picker">
                {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`priority-option ${level.toLowerCase()} ${priority === level ? 'active' : ''}`}
                    onClick={() => setPriority(level)}
                  >
                    <span className="priority-dot"></span>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <label className="date-option">
              <span className="option-label">Due date</span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </label>
          </div>
        </form>

        {error && <div className="error-banner">{error}</div>}

        <div className="list-heading">
          <div>
            <span className="list-title">Your tasks</span>
            {searchActive && <span className="search-result-label">Results for “{search.trim()}”</span>}
          </div>
          <span className="task-count">{summary.pending} pending</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Fetching tasks from H2 Database...</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{searchActive ? '⌕' : '✓'}</div>
                <p className="empty-text">
                  {searchActive ? 'No matching tasks found.' : 'No tasks here yet. Add your first one above.'}
                </p>
              </div>
            ) : (
              tasks.map((task) => {
                const dueStatus = getDueStatus(task);
                const taskPriority = (task.priority || 'MEDIUM').toLowerCase();

                return (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} priority-${taskPriority}`}>
                    <div className="priority-rail" aria-hidden="true"></div>

                    <div className="task-content" onClick={() => handleToggleTask(task.id)} role="button" tabIndex={0} onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') handleToggleTask(task.id);
                    }}>
                      <div className={`checkbox-wrapper ${task.completed ? 'checked' : ''}`}>
                        <div className="checkbox-inner">
                          {task.completed && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="task-info">
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta-row">
                          <span className={`priority-badge ${taskPriority}`}>
                            <span className="priority-dot"></span>
                            {taskPriority}
                          </span>
                          {task.dueDate && <span className={`due-badge ${dueStatus?.className || ''}`}>📅 {dueStatus?.label}</span>}
                          <span className="task-id">ID #{task.id}</span>
                        </div>
                      </div>
                    </div>

                    <button className="delete-button" onClick={() => handleDeleteTask(task.id)} title="Delete Task" aria-label={`Delete ${task.title}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="trash-icon">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  disabled={page === 0}
                  className="page-button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Prev
                </button>

                <div className="page-indicator">
                  <span className="current-page">{page + 1}</span>
                  <span className="page-divider">/</span>
                  <span className="total-pages">{totalPages}</span>
                </div>

                <button
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={page >= totalPages - 1}
                  className="page-button"
                >
                  Next
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
