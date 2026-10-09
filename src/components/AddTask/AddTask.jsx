
import { Calendar, Flag, List, Plus, Tag } from 'lucide-react';
import './AddTask.css'
import { useState } from 'react';

function AddTask({ addTask}){

  const [ title, setTitle ] = useState("");
  const [ category, setCategory ] = useState("Work");
  const [ priority, setPriority ] = useState("Medium");
  const [ date, setDate ] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  if (!title.trim()) return;

  const newTask = {
    title: title.trim(),
    category,
    priority,
    date,
    completed: false
  };

  addTask(newTask);

  // Clear form after adding
  setTitle("");
  setCategory("Work");
  setPriority("Medium");
  setDate("");
};

  return(
    <section className="add-task-card">
      <div className="add-task-header">
        <div>
          <h2>Add New Task</h2>
        </div>
        <p>Turn Ideas Into Action</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="task-input-header">
          <List size={25} style={{marginLeft:30}}/>

          <input type="text" 
          name="task"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
          placeholder='What to do' />
        
        </div>

        <div className="task-options">

          <div className="option">
          <Calendar size={25}/>
          
          <input type="date" 
          value={date}
          onChange={(e)=> setDate(e.target.value)}
          className="calendar"/>
        
        </div>
        <div className="option">
          <Flag size={25}/>
          <select name="Priority"
          value={priority}
          onChange={(e)=> setPriority(e.target.value)}
          >
            <option value="" disabled >Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="option">
            <Tag size={25}/>
          <select name="category" 
          value={category}
          onChange={(e)=> setCategory(e.target.value)}
          >
            <option value="" disabled>Category</option>
            <option value="Development">Development</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
        </div>

        <div className="option">
          <button >
            <Plus size={25} />
            <p>Add Task</p>
          </button>
        </div>
        </div>
        
      </form>
    </section>
  );
}

export default AddTask