  import { useState } from 'react';
  import TaskCard from '../TaskCard/TaskCard';
  import './TaskList.css'

  function TaskList({ tasks, toggleTask, deleteTask,editTask }) {

    const [ activeFilter, setActiveFilter ] = useState("All");
    const filteredTasks = tasks.filter((task)=>{
      if(activeFilter==="Active"){
        return !task.completed;
      }
      if(activeFilter==="Completed"){
        return task.completed;
      }

      return true;
    });

    const [ sortOption, setSortOption ] = useState("Newest");

    const sortedTasks = [...filteredTasks].sort((a,b) =>{
      if(sortOption === "Newest"){
        return b._id.localeCompare(a._id);
      }

      if(sortOption === "Oldest"){
        return a._id.localeCompare(b._id);
      }

      if(sortOption === "Due Date"){
        return new Date(a.date) - new Date(b.date);
      }

      if( sortOption === "Priority") {
        const priorityOrder ={
          High:1,
          Medium:2,
          Low:3
        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    })

    return (
      <section className="task-list">

        <div className="task-list-header">

          <div className="task-title">
            <h2>Your Tasks</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <div className="task-controls">
            <button onClick={() => setActiveFilter("All")}>
              All
            </button>

            <button onClick={() => setActiveFilter("Active")}>
              Active
            </button>

            <button onClick={() => setActiveFilter("Completed")}>
              Completed
            </button>

            <select
              name="Sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Priority">Priority</option>
              <option value="Due Date">Due Date</option>
            </select>
          </div>

        </div>


        {sortedTasks.map((task) => (
          <TaskCard 
          key={task._id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          editTask={editTask}
          />
        ))}
      </section>
    );
  }

  export default TaskList