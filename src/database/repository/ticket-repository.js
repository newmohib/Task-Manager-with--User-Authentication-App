
const {createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket } = require('../models/ticketModel'); // Import the function

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

  async getTicketById(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await getTicketById(data);
      console.log("Fetched Ticket:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Get Ticket Error:", err);
      throw new Error("Unable to Get Ticket");
    }
  }

  async updateTicket(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await updateTicket(data.ticketId, data);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Ticket Update Error:", err);
      throw new Error("Unable to Update Ticket");
    }
  }

  async deleteTicket(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await deleteTicket(data);
      console.log("Deleted Ticket:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Delete Ticket Error:", err);
      throw new Error("Unable to Delete Ticket");
    }
  }

}

module.exports = CustomerRepository;
