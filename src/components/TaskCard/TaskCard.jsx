
import { useState } from 'react';
import './TaskCard.css'

function TaskCard({ task, toggleTask, deleteTask, editTask }){

  const [ isEditing, setIsEditing ] = useState(false);
  const [ title, setTitle ] = useState(task.title);
  const [ date, setDate ] = useState(task.date);
  const [ priority, setPriority ] = useState(task.priority);
  const [ category, setCategory ] = useState(task.category);

  const handleSave = () => {
    editTask(task._id, {
      title,
      date,
      priority,
      category
    });

    setIsEditing(false);
  }

  const handleCancel = () => {
    setTitle(task.title);
    setDate(task.date);
    setPriority(task.priority);
    setCategory(task.category);

    setIsEditing(false);
  }
  

  return(
    <div className="task-card">
      {isEditing ? (
        <>
        <input type="text"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
        />
        <input type="date"
          value={date}
          onChange={(e)=> setDate(e.target.value)}
        />

        <select 
          value={priority}
          onChange={(e)=> setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Development">Development</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>

        <button className="save-btn" onClick={handleSave}>Save</button>
        <button className="cancel-btn" onClick={handleCancel}>cancel</button>
        </>
      ):(
        <>
         <button
            className={`complete-btn ${task.completed ? "completed" : ""}`}
            onClick={() => toggleTask(task._id)}
          >
            {task.completed ? "✓" : ""}
          </button>

          <div className="task-info">

            <h3 className={task.completed ? "completed-title" : ""}>
              {task.title}
            </h3>

            <div className="task-tags">
              <span className="category-tag">
                {task.category}
              </span>

              <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>

          </div>

          <div className="task-date">
            {task.date}
          </div>

          <div className="task-actions">

            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard