const TaskService = require("../services/task-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new TaskService();

  // api middleware for authentication
  app.use(UserAuth);

  app.post("/task/create", async (req, res, next) => {
    try {
      req.body.userId = req.user.id;

      const { data } = await service.createTask(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.get("/task/all", async (req, res, next) => {
    try {
      const data = await service.getAllTasks();
      // console.log({ data });
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.get("/task/:id", async (req, res, next) => {
    try {
      const data = await service.getTaskById(req.params.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.post("/task/update", async (req, res, next) => {
    try {
      const data = await service.updateTask(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.delete("/task/:id", async (req, res, next) => {
    try {
      const data = await service.deleteTask(req.params.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
};
