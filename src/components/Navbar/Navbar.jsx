import {
  Sun,
  Moon
} from "lucide-react";

import "./Navbar.css";

function Navbar({ toggleTheme }) {

  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  return (
    <nav className="navbar">

      <div className="navbar-brand">

        <div className="nav-logo">
          N
        </div>

        <span className="nav-name">
          Next <span>Up</span>
        </span>

      </div>


      <div className="navbar-actions">

        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isLight ? (
            <Moon
              size={19}
              strokeWidth={1.8}
            />
          ) : (
            <Sun
              size={19}
              strokeWidth={1.8}
            />
          )}
        </button>


        <button
          className="profile-avatar"
          aria-label="Profile"
        >
          R
        </button>

      </div>

    </nav>
  );
}

export default Navbar;