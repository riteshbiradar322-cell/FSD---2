import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(window.location.pathname === '/posts' ? 'posts' : 'dashboard');

  useEffect(() => {
    const handleNavigation = () => {
      setPage(window.location.pathname === '/posts' ? 'posts' : 'dashboard');
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setPage(path === '/posts' ? 'posts' : 'dashboard');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="app-container">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {page === 'posts' ? (
        <Posts user={user} onBack={() => navigate('/')} />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onOpenPosts={() => navigate('/posts')}
        />
      )}
    </div>
  );
}

export default App;
