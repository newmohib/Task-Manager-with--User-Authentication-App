import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { history } from "_helpers";
import { userActions, alertActions } from "_store";

export { Register };

function Register() {
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  // async function onSubmit(data) {
  //   dispatch(alertActions.clear());
  //   try {
  //     await dispatch(userActions.register(data)).unwrap();

  //     // redirect to login page and display success alert
  //     history.navigate("/account/login");
  //     dispatch(
  //       alertActions.success({
  //         message: "Registration successful",
  //         showAfterRedirect: true,
  //       })
  //     );
  //   } catch (error) {
  //     dispatch(alertActions.error(error));
  //   }
  // }
  async function onSubmit(data) {
    dispatch(alertActions.clear());
    try {
      // create or update user based on id param
      let message;
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
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <div className="card m-3">
      <h4 className="card-header text-center">Create a new account</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              {...register("name")}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              type="text"
              {...register("phone")}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.phone?.message}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="text"
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
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
              sign up
            </button>
            <button
              onClick={() => reset()}
              type="button"
              disabled={isSubmitting}
              className="btn btn-secondary mx-1"
            >
              Reset
            </button>
            <Link to="../login" className="btn btn-link">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
