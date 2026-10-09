
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;