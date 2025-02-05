const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new UserService();

  app.post("/user/signup", async (req, res, next) => {
    try {
      // const { email, password, phone } = req.body;
      const { data } = await service.SignUp(req.body);
      return res.json(data);
    } catch (err) {
      console.log("signup Error",{ err });
      return res.json({ message: err.err || "Something went wrong" });
      // next(err);
    }
  });

  app.post("/user/login", async (req, res, next) => {
    try {
      // const { email, password } = req.body;

      
      const { data } = await service.SignIn(req.body);
      return res.json(data);
    } catch (err) {
      console.log("login Error",{ err });
      
      // return res.json({ message: err || "Something went wrong" });
      next(err);
    }
  });

  app.get("/user/profile", UserAuth, async (req, res, next) => {
    try {
      //const { _id } = req.user;
      const { data } = await service.GetProfile(req.user);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
};
