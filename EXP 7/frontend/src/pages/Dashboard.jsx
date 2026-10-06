import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api/tasks';

export default function Dashboard({ user, onLogout, onOpenPosts }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const authConfig = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const body = { title, description };

      if (editingId) {
        const response = await axios.put(`${API}/${editingId}`, body, authConfig);
        setMessage('Task updated successfully.');
      } else {
        const response = await axios.post(API, body, authConfig);
        setMessage('Task created successfully.');
      }

      resetForm();
    } catch (err) {
      setError(err.response?.data || 'Could not save the task.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="dashboard-container wide-dashboard glass-panel">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Task Management Portal</h2>
          <p>Welcome back, {user.username}</p>
        </div>

        <div className="header-actions">
          <span className="role-badge">{user.role}</span>
          <button onClick={onLogout} className="btn-logout">Sign Out</button>
        </div>
      </div>

      <div className="task-form card dashboard-form-card">
          <div className="section-heading">
            <div>
              <h3>{editingId ? 'Edit Task' : 'Create Task'}</h3>
              <p>{user.role === 'ROLE_ADMIN'
                ? 'Admin can create, edit and delete tasks.'
                : 'User can create and edit their own tasks.'}</p>
            </div>
          </div>

          <form onSubmit={saveTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows="4"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>

      <button className="get-posts-btn dashboard-get-posts" onClick={onOpenPosts}>
        GET POSTS →
      </button>

      <div className="security-note">
        <strong>API security:</strong> DELETE /api/tasks/{'{id}'} is protected by
        <code> @PreAuthorize("hasRole('ADMIN')")</code>. A normal user cannot access the delete API.
      </div>
    </div>
  );
}
