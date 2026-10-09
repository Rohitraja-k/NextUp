import {
  Check,
  Clock3,
  CircleDashed,
  ChevronDown,
} from "lucide-react";

import "./TaskProgress.css";

function TaskProgress({ tasks }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="task-progress">

      {/* Header */}
      <div className="progress-top">
        <h2>Task Progress</h2>

        <button className="progress-filter">
          This Week
          <ChevronDown size={16} />
        </button>
      </div>


      {/* Main progress area */}
      <div className="progress-main">

        {/* Circle */}
        <div
          className="progress-ring"
          style={{
            "--progress": `${progress * 3.6}deg`,
          }}
        >
          <div className="progress-ring-inner">
            <strong>{progress}%</strong>
            <span>Completed</span>
          </div>
        </div>


        {/* Status */}
        <div className="progress-status">

          <div className="status-row">
            <span className="status-dot completed-dot"></span>

            <span>Completed</span>

            <strong>{completedTasks}</strong>
          </div>

          <div className="status-row">
            <span className="status-dot progress-dot"></span>

            <span>In Progress</span>

            <strong>0</strong>
          </div>

          <div className="status-row">
            <span className="status-dot pending-dot"></span>

            <span>Pending</span>

            <strong>{pendingTasks}</strong>
          </div>

        </div>
      </div>


      {/* Divider */}
      <div className="progress-divider"></div>


      {/* Bottom stats */}
      <div className="progress-bottom">

        <div className="progress-stat">
          <div className="stat-icon completed-icon">
            <Check size={20} />
          </div>

          <div>
            <strong>{completedTasks}</strong>
            <span>Completed</span>
          </div>
        </div>


        <div className="progress-stat">
          <div className="stat-icon progress-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <strong>0</strong>
            <span>In Progress</span>
          </div>
        </div>


        <div className="progress-stat">
          <div className="stat-icon pending-icon">
            <CircleDashed size={20} />
          </div>

          <div>
            <strong>{pendingTasks}</strong>
            <span>Pending</span>
          </div>
        </div>

      </div>

    </section>
  );
}

export default TaskProgress;