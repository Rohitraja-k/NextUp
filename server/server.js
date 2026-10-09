const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");


const app = express();
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

app.use(express.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();

    res.status(201).json(task);

  } catch(error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid task data"
        });
      }

    res.status(500).json({
      message: "Failed to create task"
    });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid task ID"
      });
    }

    res.status(500).json({
      message: "Failed to delete task"
    });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(updatedTask);
  } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID"
        });
      }
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid task data"
        });
      }
    res.status(500).json({
      message: "Failed to update task"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});