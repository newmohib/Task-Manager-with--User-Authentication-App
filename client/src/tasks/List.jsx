import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { alertActions, taskActions } from "_store";

export { TaskList };

function TaskList() {
  const dispatch = useDispatch();
  const {
    value: tasks,
    total,
    page,
    totalPages,
    loading,
  } = useSelector((x) => x.tasks.list || {});

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(taskActions.getAll({ page: currentPage, limit: pageSize }));
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const taskDelete = async (taskId) => {
    const result = await dispatch(taskActions.delete(taskId)).unwrap();
    let message = "Task is Deleted Successfully!";
    if (result?.isSuccess) {
      dispatch(taskActions.getAll({ page: currentPage, limit: pageSize }));
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } else {
      message = "Task Can't be Deleted, Please try again later";
      dispatch(alertActions.error(message));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mt-1">
        <div>
          <h1>Tasks</h1>
        </div>
        <div>
          <Link to="add" className="btn btn-sm btn-success mb-0">
            Add Task
          </Link>
        </div>
      </div>
      <div className="card p-4">
        <table className="table table-striped table-bordered">
          <thead>
            <tr className="table-secondary">
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
            {tasks?.map((task) => (
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
                    onClick={() => taskDelete(task.taskId)}
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
            {loading && (
              <tr>
                <td colSpan="7" className="text-center">
                  <span className="spinner-border spinner-border-lg align-center"></span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
