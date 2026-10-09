
import { useState } from "react";
import { Sun, Moon, Bell, CheckCheck, Trash2 } from "lucide-react";
import "./Navbar.css";

function Navbar({
  toggleTheme,
  notifications = [],
  unreadCount = 0,
  markNotificationsRead,
  clearNotifications,
  browserPermission,
  requestBrowserPermission,
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  const openNotifications = () => {
    const nextOpen = !panelOpen;
    setPanelOpen(nextOpen);

    if (nextOpen) {
      markNotificationsRead?.();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="nav-logo">N</div>
        <span className="nav-name">
          Next <span>Up</span>
        </span>
      </div>

      <div className="navbar-actions">
        <div className="notification-wrapper">
          <button
            className="theme-btn notification-btn"
            onClick={openNotifications}
            aria-label="Notifications"
            aria-expanded={panelOpen}
          >
            <Bell size={19} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {panelOpen && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <h3>Notifications</h3>
                <button
                  type="button"
                  onClick={clearNotifications}
                  aria-label="Clear notifications"
                  title="Clear notifications"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {browserPermission !== "granted" && (
                <button
                  className="enable-notifications-btn"
                  onClick={requestBrowserPermission}
                  disabled={browserPermission === "unsupported"}
                >
                  {browserPermission === "denied"
                    ? "Enable notifications in browser settings"
                    : browserPermission === "unsupported"
                    ? "Browser notifications unavailable"
                    : "Enable browser notifications"}
                </button>
              )}

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <p className="notification-empty">
                    You're all caught up!
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      className={`notification-item ${item.read ? "" : "unread"}`}
                      key={item.id}
                    >
                      <span className="notification-dot" />
                      <div>
                        <p className="notification-title">{item.title}</p>
                        <p className="notification-message">{item.message}</p>
                        <span className="notification-time">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <button
                  className="mark-read-btn"
                  onClick={markNotificationsRead}
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>

        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isLight ? (
            <Moon size={19} strokeWidth={1.8} />
          ) : (
            <Sun size={19} strokeWidth={1.8} />
          )}
        </button>

        <button className="profile-avatar" aria-label="Profile">
          R
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
