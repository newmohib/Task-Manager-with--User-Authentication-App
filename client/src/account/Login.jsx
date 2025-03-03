import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { authActions } from "_store";

export { Login };

function Login() {
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email("Email is invalid")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <div className="card m-3">
      <div className="text-center">
        <h4 className="card-header">Log in to Task Manager</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="username"
              type="text"
              {...register("username")}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              {...register("password")}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <div className="text-center">
            <button disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm me-1"></span>
              )}
              Login
            </button>
            <Link to="../register" className="btn btn-link">
              Create new account
            </Link>
            <Link to="../forgot-password" className="btn btn-link">
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
