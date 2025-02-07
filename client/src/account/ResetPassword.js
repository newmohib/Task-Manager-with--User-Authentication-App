import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { alertActions, userActions } from "_store";

export function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken"); // Get token from URL

  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!resetToken) {
      setTokenValid(false);
    }
  }, [resetToken]);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(data) {
    dispatch(alertActions.clear());

    try {
      const resetResult = await dispatch(
        userActions.resetPassword({ resetToken, password: data.password })
      ).unwrap();
      if (resetResult?.isSuccess || resetResult?.message) {
        dispatch(
          alertActions.success({
            message: "Password reset successfully!",
            showAfterRedirect: true,
          })
        );
        navigate("/account/login"); // Redirect to login page after success
      } else {
        dispatch(alertActions.error("Password reset failed!"));
      }
    } catch (error) {
      dispatch(alertActions.error(error));
    }
  }

  if (!tokenValid) {
    return (
      <div className="alert alert-danger">Invalid or expired reset token.</div>
    );
  }

  return (
    <div className="card m-3">
      <h4 className="card-header">Reset Password</h4>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              name="password"
              type="password"
              {...register("password")}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">
              {errors.confirmPassword?.message}
            </div>
          </div>
          <button disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm me-1"></span>
            )}
            Reset Password
          </button>
          <Link to="../forgot-password" className="btn btn-link">
            Change Eamil
          </Link>
        </form>
      </div>
    </div>
  );
}
