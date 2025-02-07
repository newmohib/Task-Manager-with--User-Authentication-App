import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { alertActions, userActions } from "_store";

export function ForgotPassword() {
  const dispatch = useDispatch();

  // Form validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(data) {
    dispatch(alertActions.clear());

    try {
      await dispatch(userActions.forgotPassword(data)).unwrap();

      dispatch(
        alertActions.success({
          message:
            "A password reset email has been sent successfully! Please check your inbox and spam folder if you don’t see it.",
          showAfterRedirect: false,
        })
      );
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  return (
    <div className="card m-3">
      <h4 className="card-header">Forgot Password</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          <button disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm me-1"></span>
            )}
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
