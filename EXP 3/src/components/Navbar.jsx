import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="top-navbar">
      <Link to="/dashboard" className="brand-name">
        WorkSpace
      </Link>

      <div className="nav-right">
        {!isAuthenticated ? (
          <Link to="/login" className="nav-login">
            Sign in
          </Link>
        ) : (
          <>
            <div className="user-mini-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <strong>{user?.name}</strong>
                <span>{user?.role}</span>
              </div>
            </div>

            <button
              className="nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;