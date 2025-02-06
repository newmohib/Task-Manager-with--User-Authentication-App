const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../models/ticketModel"); // Import the function

const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

//Dealing with data base operations
class CustomerRepository {
  async createTicket(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await createTicket(data);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Ticket Create Error:", err);
      throw new Error("Unable to Create Ticket");
    }
  }

  async getAllTickets() {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await getAllTickets();
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Get Task Error:", err);
      throw new Error("Unable to Get Task");
    }
  }

  async getTicketById(taskId) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await getTicketById(taskId);
      console.log("Fetched Task:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Get Task Error:", err);
      throw new Error("Unable to Get Task");
    }
  }

  async updateTicket({ taskId, updateFields }) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await updateTicket(taskId, updateFields);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Task Update Error:", err);
      throw new Error("Unable to Update Task");
    }
  }

  async deleteTicket(taskId) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await deleteTicket(taskId);
      console.log("Deleted Task:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Delete Task Error:", err);
      throw new Error("Unable to Delete Task");
    }
  }
}

module.exports = CustomerRepository;
