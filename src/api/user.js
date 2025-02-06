const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new UserService();

  app.post("/auth/register", async (req, res, next) => {
    try {
      // const { email, password, phone } = req.body;
      const { data } = await service.SignUp(req.body);
      return res.json(data);
    } catch (err) {
      console.log("signup Error", { err });
      return res.json({ message: err.err || "Something went wrong" });
      // next(err);
    }
  });

  app.post("/auth/login", async (req, res, next) => {
    try {
      // const { email, password } = req.body;

      const { data } = await service.SignIn(req.body);
      return res.json(data);
    } catch (err) {
      console.log("login Error", { err });

      // return res.json({ message: err || "Something went wrong" });
      next(err);
    }
  });

  app.get("/auth/profile", UserAuth, async (req, res, next) => {
    try {

      const { data } = await service.GetProfile(req.user);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });

  app.get("/auth/profile/:id", UserAuth, async (req, res, next) => {
    try {

      const { data } = await service.GetProfile({...req.user, id: req.params.id});
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  //GetAllUsers
  app.get("/auth/all-user", UserAuth, async (req, res, next) => {
    try {

      const { data } = await service.GetAllUsers(req.user);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });

  app.put("/auth/profile", UserAuth, async (req, res, next) => {
    try {

      const { data } = await service.UpdateUserProfile({...req.body, id: req.user.id});
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });

  app.put("/auth/user-profile/:id", UserAuth, async (req, res, next) => {
    try {

      const { data } = await service.UpdateUserProfile({...req.body, id: req.params.id});
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
 
  // ResetPassword
  app.post("/auth/reset-password", UserAuth, async (req, res, next) => {
    try {
      const { data } = await service.ResetPassword({
        ...req.body,
        email: req.user.email,
      });
      return res.json(data);
    } catch (err) {
      console.log("login Error", { err });

      // return res.json({ message: err || "Something went wrong" });
      next(err);
    }
  });
  
  app.post("/auth/forgot-password", async (req, res, next) => {
    try {
      const { data } = await service.ForgotPasswordRequest({
        ...req.body,
      });
      return res.json(data);
    } catch (err) {
      console.log("login Error", { err });

      // return res.json({ message: err || "Something went wrong" });
      next(err);
    }
  });
  app.post("/auth/reset-password-update", async (req, res, next) => {
    try {
      const { data } = await service.ForgotPasswordUpdate({
        ...req.body,
      });
      return res.json(data);
    } catch (err) {
      console.log("login Error", { err });

      // return res.json({ message: err || "Something went wrong" });
      next(err);
    }
  });
};
