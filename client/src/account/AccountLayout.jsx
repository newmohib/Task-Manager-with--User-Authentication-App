import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Login, Register, ForgotPassword, ResetPassword } from "./";

export { AccountLayout };

function AccountLayout() {
  const auth = useSelector((x) => x.auth.value);

  // redirect to home if already logged in
  if (auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
