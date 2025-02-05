const TicketService = require("../services/ticket-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new TicketService();

  // api middleware for authentication
  app.use(UserAuth)

  app.post("/task/create", async (req, res, next) => {
    try {
      req.body.userId = req.user.id

      const { data } = await service.createTicket(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.get("/task/all", async (req, res, next) => {
    try {
      const { data } = await service.getAllTickets();
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.get("/ticket/:id", async (req, res, next) => {
    try {
      const { data } = await service.getTicketById(req.params.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.post("/ticket/update", async (req, res, next) => {
    try {

      const { data } = await service.updateTicket(req.body);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
  app.delete("/ticket/delete", async (req, res, next) => {
    try {
      const { data } = await service.deleteTicket(req.body.id);
      return res.json(data);
    } catch (err) {
      // return res.json({ message: err.err || "Something went wrong" });
      next(err);
    }
  });
};
