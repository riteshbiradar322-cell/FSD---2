import { FaCalendarAlt, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

const Navbar = ({ searchTerm = "", onSearchChange }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
    setDarkMode((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <FaCalendarAlt className="logo-icon" />
        <h2>Calendar App</h2>
      </div>

      <div className="navbar-right">
        <input
          type="text"
          placeholder="Search events..."
          className="search-box"
          value={searchTerm}
          onChange={onSearchChange}
        />

        <button className="theme-btn" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;