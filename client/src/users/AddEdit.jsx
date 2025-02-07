import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import { history } from "_helpers";
import { userActions, alertActions } from "_store";

export { AddEdit };

function AddEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSelf = searchParams.get("isSelf") === "true";

  const [title, setTitle] = useState();
  const dispatch = useDispatch();
  const user = useSelector((x) => x.users?.item);

  useEffect(() => {
    // Fetch data or update state when `id` or `isSelf` changes
    console.log("URL params changed", { id, isSelf });
    if (id) {
      dispatch(userActions.getById(id))
        .unwrap()
        .then((user) => reset(user));
    }
  }, [id, isSelf]); // Dependency array ensures re-render when these values change

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      // password optional in edit mode
      .concat(id ? null : Yup.string().required("Password is required"))
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (id) {
      const message = isSelf ? "Edit Profile" : "Edit User";
      setTitle(message);

      // fetch user details into redux state and
      // populate form fields with reset()
      dispatch(userActions.getById(id))
        .unwrap()
        .then((user) => reset(user));
    } else {
      setTitle("Add User");
    }
  }, [isSelf]);

  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      // create or update user based on id param
      let message;
      if (id) {
        const result = await dispatch(
          userActions.update({ id, data })
        ).unwrap();
        if (result?.id || result.isSuccess) {
          message = "User updated";
          if (!isSelf) {
            history.navigate("/users");
          }
          dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } else {
          message = "Invalid data";
          dispatch(alertActions.error(message));
        }
      } else {
        const result = await dispatch(userActions.register(data)).unwrap();
        if (result.id || result.isSuccess) {
          message = "User added";
          // redirect to user list with success message
          history.navigate("/users");
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
      {!(user?.loading || user?.error) && (
        <div className="card p-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="mb-3 col">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  type="text"
                  {...register("name")}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.name?.message}</div>
              </div>
              <div className="mb-3 col">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  type="text"
                  {...register("phone")}
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.phone?.message}</div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="text"
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>
              <div className="mb-3 col">
                <label className="form-label">
                  Password
                  {id && (
                    <em className="ml-1">
                      {" "}
                      ( Leave blank to keep the same password )
                    </em>
                  )}
                </label>
                <input
                  name="password"
                  type="password"
                  {...register("password")}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
            </div>
            <div className="mb-3">
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
              <Link to={`${isSelf ? "/" : "/users"}`} className="btn btn-link">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
      {user?.loading && (
        <div className="text-center m-5">
          <span className="spinner-border spinner-border-lg align-center"></span>
        </div>
      )}
      {user?.error && (
        <div class="text-center m-5">
          <div class="text-danger">Error loading user: {user.error}</div>
        </div>
      )}
    </>
  );
}
