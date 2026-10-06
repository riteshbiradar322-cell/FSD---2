import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api/tasks';

export default function Posts({ user, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ totalPages: 0, totalElements: 0, number: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const authConfig = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  const loadPosts = async (pageNumber = 0) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API}?page=${pageNumber}&size=5`, authConfig);
      setTasks(response.data.content);
      setPageData(response.data);
      setPage(response.data.number);
    } catch (err) {
      setError(err.response?.data || 'Unable to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(page);
  }, []);

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `${API}/${editingTask}`,
        { title: editTitle, description: editDescription },
        authConfig
      );

      setTasks(tasks.map(task => task.id === editingTask ? response.data : task));
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data || 'Could not update the task.');
    }
  };

  const deleteTask = async (id) => {
    if (user.role !== 'ROLE_ADMIN') {
      setError('Delete is available only to administrators.');
      return;
    }

    if (!window.confirm('Delete this task?')) return;

    try {
      await axios.delete(`${API}/${id}`, authConfig);
      const remaining = tasks.filter(task => task.id !== id);
      setTasks(remaining);

      // If the last item on a non-first page is deleted, reload that page.
      if (remaining.length === 0 && page > 0) {
        loadPosts(page - 1);
      } else {
        setPageData(prev => ({ ...prev, totalElements: Math.max(prev.totalElements - 1, 0) }));
      }
    } catch (err) {
      setError(err.response?.data || 'Delete failed.');
    }
  };

  return (
    <div className="posts-page glass-panel">
      <div className="posts-header">
        <div>
          <h2>GET POSTS</h2>
          <p>Posts are loaded only when this page is opened. 5 posts are shown per page.</p>
        </div>
        <button className="btn-secondary" onClick={onBack}>← Back to Dashboard</button>
      </div>

      {loading && <div className="loading-box">Loading posts...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="post-list">
            {tasks.length === 0 ? (
              <div className="empty-box">No tasks have been created yet.</div>
            ) : (
              tasks.map(task => (
                <div className="post-card" key={task.id}>
                  {editingTask === task.id ? (
                    <div className="edit-post-form">
                      <input
                        className="form-input"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="Task title"
                      />
                      <textarea
                        className="form-input textarea"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        placeholder="Task description"
                        rows="3"
                      />
                      <div className="task-actions">
                        <button className="btn-small" onClick={saveEdit}>Save</button>
                        <button className="btn-small btn-secondary" onClick={() => setEditingTask(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="post-card-top">
                        <h3>{task.title}</h3>
                        <span className="post-id">#{task.id}</span>
                      </div>
                      <p>{task.description || 'No description provided.'}</p>
                      <div className="post-meta">
                        <span>Created by: {task.createdBy}</span>
                        <span>{task.createdAt ? new Date(task.createdAt).toLocaleString() : ''}</span>
                      </div>
                      <div className="task-actions post-actions">
                        <button className="btn-small" onClick={() => startEdit(task)}>Edit</button>
                        {user.role === 'ROLE_ADMIN' && (
                          <button className="btn-small btn-danger" onClick={() => deleteTask(task.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button
              className="btn-secondary"
              disabled={page === 0}
              onClick={() => loadPosts(page - 1)}
            >
              ← Previous
            </button>

            <span>
              Page <strong>{page + 1}</strong> of <strong>{Math.max(pageData.totalPages, 1)}</strong>
              {' '}({pageData.totalElements || 0} total posts)
            </span>

            <button
              className="btn-secondary"
              disabled={page >= pageData.totalPages - 1 || pageData.totalPages === 0}
              onClick={() => loadPosts(page + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
