import { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AddTask from "./components/AddTask/AddTask";
import TaskList from "./components/TaskList/TaskList";
import TaskProgress from "./components/TaskProgress/TaskProgress";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  /* =========================
     THEME
  ========================= */

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "dark" ? "light" : "dark"
    );
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);


  /* =========================
     TASKS
  ========================= */

  const [tasks, setTasks] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ fetchError, setFetchError ] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchTasks = async () => {
  setLoading(true);
  setFetchError("");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tasks`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await response.json();
    setTasks(data);

  } catch (error) {
    console.log("Failed to fetch tasks:", error);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.log("Failed to add task:",error);
      setActionError("Unable to add task. Please try again");
    }
  };


  const toggleTask = async (id) => {

    setActionError("");

    try {
      const task = tasks.find((task) => task._id === id);
      const newCompleted = !task.completed;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: newCompleted
          })
       }
      );

      const updatedTask = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      );

    } catch (error) {
      console.log("Failed to update task:", error);
      setActionError("Unable to update task. Please try again.");
    }
  };


  const deleteTask = async (id) => {

    setActionError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } catch(error) {
      console.log("Failed to delete task:",error);
      setActionError("Unable to update task. Please try again.");
    }
  };


  const editTask = async (id, updatedTask) => {

    setActionError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedTask)
        }
      );

      const updatedTaskFromServer = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updatedTaskFromServer : task
        )
      );

    } catch (error) {
      console.log("Failed to edit task:", error);
      setActionError("Unable to update task. Please try again.");
    }
  };


  /* =========================
     UI
  ========================= */

  return (
    <div className="app">

      <Navbar toggleTheme={toggleTheme} />


      {/* HERO + ADD TASK */}

      <div className="hero-row">

        <Hero />

        <AddTask
          addTask={addTask}
        />

      </div>


      {/* TASKS + PROGRESS */}

      <div className="tasks-progress-row">

        {actionError && (
          <div className="tasks-error">
            <p>{actionError}</p>
          </div>
        )}

        {loading ? (
          <div className="tasks-loading">
            Loading your tasks...
          </div>
        ) : fetchError ? (
          <div className="tasks-error">
            <p>{fetchError}</p>
            <button
              className="retry-btn"
              onClick={fetchTasks}
            >
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

        <TaskProgress
          tasks={tasks}
        />

      </div>


      {/* FOOTER */}

      <Footer />

    </div>
  );
}

export default App;