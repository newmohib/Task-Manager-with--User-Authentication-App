const TaskService = require("../services/task-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new TaskService();

  // api middleware for authentication
  app.use(UserAuth);

  app.post("/tasks/create", async (req, res, next) => {
    try {
      req.body.userId = req.user.id;

      const { data } = await service.createTask(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });

  // app.get("/tasks/all", async (req, res, next) => {
  //   try {
  //     const data = await service.getAllTasks();
  //     // console.log({ data });
  //     return res.json(data);
  //   } catch (err) {
  //     // return res.json({ message: err.err || "Something went wrong" });
  //     next(err);
  //   }
  // });

  app.get("/tasks/all", async (req, res, next) => {
    try {
      let { page = 1, limit = 10, status, dueDate } = req.query; // Default values if not provided
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      const data = await service.getAllTasks({ page, limit, status, dueDate });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
  app.get("/tasks/:id", async (req, res, next) => {
    try {
      const data = await service.getTaskById(req.params.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.put("/tasks/update", async (req, res, next) => {
    try {
      const { data } = await service.updateTask(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.delete("/tasks/:id", async (req, res, next) => {
    try {
      const data = await service.deleteTask(req.params.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
};
