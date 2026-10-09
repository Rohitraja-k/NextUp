
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AddTask from "./components/AddTask/AddTask";
import TaskList from "./components/TaskList/TaskList";
import TaskProgress from "./components/TaskProgress/TaskProgress";
import Footer from "./components/Footer/Footer";

import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

function App() {
  const [theme, setTheme] = useState("dark");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");

  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nextup-notifications") || "[]");
    } catch {
      return [];
    }
  });

  const [browserPermission, setBrowserPermission] = useState(
    typeof Notification !== "undefined"
      ? Notification.permission
      : "unsupported"
  );

  const toggleTheme = () => {
    setTheme((previous) => previous === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "nextup-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const fetchTasks = async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      setTasks(await response.json());
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setFetchError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    setActionError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const savedTask = await response.json();
      setTasks((previous) => [...previous, savedTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
      setActionError("Unable to add task. Please try again.");
    }
  };

  const toggleTask = async (id) => {
    setActionError("");

    try {
      const task = tasks.find((item) => item._id === id);
      if (!task) return;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();

      setTasks((previous) =>
        previous.map((item) => item._id === id ? updatedTask : item)
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setActionError("Unable to update task. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    setActionError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((previous) => previous.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      setActionError("Unable to delete task. Please try again.");
    }
  };

  const editTask = async (id, updatedTask) => {
    setActionError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to edit task");

      const savedTask = await response.json();

      setTasks((previous) =>
        previous.map((item) => item._id === id ? savedTask : item)
      );
    } catch (error) {
      console.error("Failed to edit task:", error);
      setActionError("Unable to edit task. Please try again.");
    }
  };

  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) {
      setBrowserPermission("unsupported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
    } catch (error) {
      console.error("Notification permission failed:", error);
    }
  };

  const markNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Check reminders while the app is open.
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");

      let sentKeys = [];

      try {
        sentKeys = JSON.parse(
          localStorage.getItem("nextup-sent-reminders") || "[]"
        );
      } catch {
        sentKeys = [];
      }

      const newNotifications = [];

      const notify = (task, type, message, key) => {
        if (sentKeys.includes(key)) return;

        sentKeys.push(key);

        newNotifications.push({
          id: key,
          taskId: task._id,
          title: task.title,
          type,
          message,
          createdAt: new Date().toISOString(),
          read: false,
        });

        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          try {
            new Notification(`Next Up: ${task.title}`, {
              body: message,
              tag: key,
            });
          } catch (error) {
            console.error("Browser notification failed:", error);
          }
        }
      };

      tasks.forEach((task) => {
        if (task.completed) return;

        // Custom reminder: notify when the selected time is reached.
        if (task.reminderAt) {
          const reminderTime = new Date(task.reminderAt);

          if (
            !Number.isNaN(reminderTime.getTime()) &&
            reminderTime <= now
          ) {
            notify(
              task,
              "reminder",
              "Your custom task reminder is due.",
              `reminder-${task._id}-${task.reminderAt}`
            );
          }
        }

        // Deadline alert: notify once on the due date.
        if (task.date) {
          const dueDate = task.date.slice(0, 10);

          if (dueDate === today) {
            notify(
              task,
              "due",
              "This task is due today.",
              `due-${task._id}-${dueDate}`
            );
          } else if (dueDate < today) {
            notify(
              task,
              "overdue",
              "This task is overdue.",
              `overdue-${task._id}-${dueDate}`
            );
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications((previous) => [
          ...newNotifications,
          ...previous,
        ].slice(0, 100));

        // Keep recent keys so the same alert isn't repeated.
        localStorage.setItem(
          "nextup-sent-reminders",
          JSON.stringify(sentKeys.slice(-500))
        );
      }
    };

    checkReminders();

    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [tasks]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="app">
      <Navbar
        toggleTheme={toggleTheme}
        notifications={notifications}
        unreadCount={unreadCount}
        markNotificationsRead={markNotificationsRead}
        clearNotifications={clearNotifications}
        browserPermission={browserPermission}
        requestBrowserPermission={requestBrowserPermission}
      />

      <div className="hero-row">
        <Hero />
        <AddTask addTask={addTask} />
      </div>

      <div className="tasks-progress-row">
        {actionError && (
          <div className="tasks-error">
            <p>{actionError}</p>
          </div>
        )}

        {loading ? (
          <div className="tasks-loading">Loading your tasks...</div>
        ) : fetchError ? (
          <div className="tasks-error">
            <p>{fetchError}</p>
            <button className="retry-btn" onClick={fetchTasks}>
              Try Again
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        )}

        <TaskProgress tasks={tasks} />
      </div>

      <Footer />
    </div>
  );
}

export default App;
