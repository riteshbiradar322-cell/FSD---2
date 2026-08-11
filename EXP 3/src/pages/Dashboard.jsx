import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/fakeBackend";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalEditors: 0,
    totalViewers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <p className="page-label">OVERVIEW</p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Welcome back, {user?.name}. Here's what's happening
            in your workspace.
          </p>
        </div>

        <div className="header-role">
          <span className="role-dot"></span>
          {user?.role}
        </div>
      </div>

      {/* User information */}
      <div className="profile-card">

        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="profile-info">
          <span className="profile-label">
            CURRENT ACCOUNT
          </span>

          <h2>{user?.name}</h2>

          <p>
            @{user?.username}
          </p>
        </div>

        <div className="profile-role">
          <span>Access level</span>

          <strong>{user?.role}</strong>
        </div>

      </div>

      {/* Statistics */}
      <div className="section-heading">
        <div>
          <h2>System Overview</h2>
          <p>Current user distribution across the platform.</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon users-icon">U</div>

          <div>
            <span>Total users</span>
            <strong>{stats.totalUsers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin-icon">A</div>

          <div>
            <span>Administrators</span>
            <strong>{stats.totalAdmins}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon editor-icon">E</div>

          <div>
            <span>Editors</span>
            <strong>{stats.totalEditors}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon viewer-icon">V</div>

          <div>
            <span>Viewers</span>
            <strong>{stats.totalViewers}</strong>
          </div>
        </div>

      </div>

      {/* Quick actions */}
      <div className="section-heading actions-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Access the tools available for your role.</p>
        </div>
      </div>

      <div className="action-grid">

        {user?.role === "Admin" && (
          <Link to="/admin" className="action-card">
            <div className="action-icon">A</div>

            <div>
              <h3>Admin Panel</h3>
              <p>Manage users and system settings.</p>
            </div>

            <span className="action-arrow">→</span>
          </Link>
        )}

        {user?.role === "Editor" && (
          <Link to="/editor" className="action-card">
            <div className="action-icon">E</div>

            <div>
              <h3>Editor Panel</h3>
              <p>Create and manage application content.</p>
            </div>

            <span className="action-arrow">→</span>
          </Link>
        )}

        {user?.role === "Viewer" && (
          <Link to="/viewer" className="action-card">
            <div className="action-icon">V</div>

            <div>
              <h3>Viewer Panel</h3>
              <p>View available application information.</p>
            </div>

            <span className="action-arrow">→</span>
          </Link>
        )}

        <button
          className="action-card logout-card"
          onClick={logout}
        >
          <div className="action-icon logout-icon">↪</div>

          <div>
            <h3>Sign out</h3>
            <p>End your current session securely.</p>
          </div>

          <span className="action-arrow">→</span>
        </button>

      </div>

    </div>
  );
};

export default Dashboard;