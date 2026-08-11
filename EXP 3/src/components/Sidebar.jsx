import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="app-sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-logo">W</div>

        <div>
          <strong>WorkSpace</strong>
          <span>Management Portal</span>
        </div>
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">

        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "sidebar-link active" : "sidebar-link"}
        >
          <span className="sidebar-icon">⌂</span>
          Dashboard
        </Link>

        {user?.role === "Admin" && (
          <Link
            to="/admin"
            className={isActive("/admin") ? "sidebar-link active" : "sidebar-link"}
          >
            <span className="sidebar-icon">▦</span>
            Admin Panel
          </Link>
        )}

        {user?.role === "Editor" && (
          <Link
            to="/editor"
            className={isActive("/editor") ? "sidebar-link active" : "sidebar-link"}
          >
            <span className="sidebar-icon">✎</span>
            Editor Panel
          </Link>
        )}

        {user?.role === "Viewer" && (
          <Link
            to="/viewer"
            className={isActive("/viewer") ? "sidebar-link active" : "sidebar-link"}
          >
            <span className="sidebar-icon">◉</span>
            Viewer Panel
          </Link>
        )}

      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;