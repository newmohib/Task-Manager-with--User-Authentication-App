import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import { history } from "_helpers";
import { taskActions, alertActions } from "_store";

export { AddEditTask };

function AddEditTask() {
  const { id } = useParams();
  const [title, setTitle] = useState();
  const dispatch = useDispatch();
  const task = useSelector((x) => x.tasks?.item);

  useEffect(() => {
    if (id) {
      setTitle("Edit Task");
      dispatch(taskActions.getById(id))
        .unwrap()
        .then((task) => {
          let _task = { ...task };
          if (!_task.due_date) {
            _task.dueDate = "";
          } else {
            _task.dueDate = formatDateForInput(_task.due_date);
            // _task.dueDate = new Date(_task.due_date).toISOString().slice(0, 16);
            console.log(_task.dueDate);
          }
          console.log({ _task });

          reset(_task);
        });
    } else {
      setTitle("Add Task");
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    dueDate: Yup.string().required("Due date is required"),
    status: Yup.string()
      .oneOf(
        [
          "pending",
          "in_progress",
          "completed",
          "on_hold",
          "canceled",
          "failed",
          "review",
          "approved",
          "rejected",
        ],
        "Invalid status"
      )
      .required("Status is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Handle empty case
    const date = new Date(dateString);

    // Convert to local timezone format (YYYY-MM-DDTHH:MM)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // 2025-02-07T16:55

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      let message;
      if (id) {
        const result = await dispatch(
          taskActions.update({ id, data })
        ).unwrap();
        if (result?.id || result.isSuccess) {
          message = "Task updated";
          history.navigate("/tasks");
          dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } else {
          message = "Invalid data";
          dispatch(alertActions.error(message));
        }
      } else {
        const result = await dispatch(taskActions.create(data)).unwrap();
        if (result.id || result.isSuccess) {
          message = "Task added";
          history.navigate("/tasks");
          dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } else {
          message = "Invalid data";
          dispatch(alertActions.error(message));
        }
      }
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <>
      <h1>{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4">
        <div className="row">
          <div className="mb-3 col">
            <label className="form-label">Title</label>
            <input
              name="title"
              type="text"
              {...register("title")}
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>

          <div className="mb-3 col">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              {...register("description")}
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">
              {errors.description?.message}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col">
            <label className="form-label">Due Date</label>
            <input
              name="dueDate"
              type="datetime-local"
              {...register("dueDate")}
              className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
              //   value="2025-02-07T16:55"
            />
            <div className="invalid-feedback">{errors.dueDate?.message}</div>
          </div>

          <div className="mb-3 col">
            <label className="form-label">Status</label>
            <select
              name="status"
              {...register("status")}
              className={`form-control ${errors.status ? "is-invalid" : ""}`}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="canceled">Canceled</option>
              <option value="failed">Failed</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="invalid-feedback">{errors.status?.message}</div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary me-2"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm me-1"></span>
              )}
              Save
            </button>
            <button
              onClick={() => reset()}
              type="button"
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Reset
            </button>
            <Link to="/tasks" className="btn btn-link">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
