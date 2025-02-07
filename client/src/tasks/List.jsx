import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { taskActions } from "_store";

export { TaskList };

function TaskList() {
  const tasks = useSelector((x) => {
    console.log({ x });

    return x.tasks.list;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(taskActions.getAll());
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <Link to="add" className="btn btn-sm btn-success mb-2">
        Add Task
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "15%" }}>Title</th>
            <th style={{ width: "15%" }}>Description</th>
            <th style={{ width: "15%" }}>Due Date</th>
            <th style={{ width: "15%" }}>Status</th>
            <th style={{ width: "15%" }}>Created By</th>
            <th style={{ width: "15%" }}>Created At</th>
            <th style={{ width: "10%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.value?.map((task) => (
            <tr key={task.taskId}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.due_date}</td>
              <td>{task.status}</td>
              <td>{task.userName}</td>
              <td>{task.created_at}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <Link
                  to={`edit/${task.taskId}`}
                  className="btn btn-sm btn-primary me-1"
                >
                  Edit
                </Link>
                <button
                  onClick={() => dispatch(taskActions.delete(task.taskId))}
                  className="btn btn-sm btn-danger"
                  style={{ width: "60px" }}
                  disabled={task.isDeleting}
                >
                  {task.isDeleting ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </td>
            </tr>
          ))}
          {tasks?.loading && (
            <tr>
              <td colSpan="3" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
