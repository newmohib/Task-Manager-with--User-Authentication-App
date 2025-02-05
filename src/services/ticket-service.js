const { TicketRepository } = require("../database");
// const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError, STATUS_CODES } = require('../utils/app-errors')


// All Business logic will be here
class CustomerService {

    constructor(){
        this.repository = new TicketRepository();
    }

    async createTicket(ticketInputs) {
        const { title, description, userId, dueDate = null  } = ticketInputs;
    
        if (!title || !description || !userId) {
        //   throw new APIError('Missing required fields: title, description, or userId');
          throw new APIError('Missing required fields',STATUS_CODES.NOT_FOUND, 'Missing required fields: title, description, or userId')
        }
    
        try {
          // Call the createTicket function from the model
          const ticketInfo = await this.repository.createTicket({ title, description, userId, dueDate });
    
          // Add additional logic here, such as sending notifications or logging
          // Example: Send an email notification to the admin or executive
    
          return ticketInfo;
        } catch (err) {
          console.error("Ticket Create Error:", err);
          throw new APIError('Unable to Create Ticket', STATUS_CODES.NOT_FOUND, err);
        }
      }

      // Fetch all tickets
  async getAllTickets() {
    try {
      // Call the getAllTickets function from the model
      const ticketList = await this.repository.getAllTickets();

      // Add additional logic here, such as filtering, formatting, or enriching the data
      // Example: You could sort or group tickets by status
      // ticketList = ticketList.sort((a, b) => a.status.localeCompare(b.status));

      return ticketList;
    } catch (err) {
      console.error("Get Ticket Error:", err);
      throw new APIError("Unable to Get Tickets", STATUS_CODES.NOT_FOUND, err);
    }
  }

  async getTicketById(ticketId) {
    try {
      if (!ticketId) {
        throw new APIError("Invalid Ticket ID provided", STATUS_CODES.NOT_FOUND, null);
      }

      // Call the getTicketById function from the model
      const ticketInfo = await getTicketById(ticketId);

      if (!ticketInfo) {
        throw new APIError("Ticket not found", STATUS_CODES.NOT_FOUND, null);
      }

      console.log("Fetched Ticket:", ticketInfo);

      // Add additional logic here if needed
      return ticketInfo;
    } catch (err) {
      console.error("Get Ticket By ID Error:", err);
      throw new APIError("Unable to Get Ticket", STATUS_CODES.NOT_FOUND, err);
    }
  }

  // Update ticket
  async updateTicket(data) {
    try {
      const { ticketId, ...updateFields } = data;

      if (!ticketId) {
        throw new APIError('Ticket ID is required for update', STATUS_CODES.NOT_FOUND, null);
      }

      // Call the model function to update the ticket
      const updatedTicket = await updateTicket(ticketId, updateFields);

      if (!updatedTicket) {
        throw new APIError('Unable to update ticket. Ticket not found.', STATUS_CODES.NOT_FOUND, null);
      }

      return updatedTicket;
    } catch (err) {
      console.error('Ticket Update Error:', err);
      throw new Error('Unable to Update Ticket', STATUS_CODES.NOT_FOUND, null);
    }
  }

   // Delete a ticket
   async deleteTicket(ticketId) {
    try {
      if (!ticketId) {
        throw new APIError('Ticket ID is required for deletion', STATUS_CODES.NOT_FOUND, null);
      }

      // Call the model function to delete the ticket
      const result = await deleteTicket(ticketId);

      if (!result) {
        throw new APIError('Unable to delete ticket. Ticket not found.', STATUS_CODES.NOT_FOUND, null);
      }

      return { message: 'Ticket deleted successfully', ticketId };
    } catch (err) {
      console.error('Ticket Deletion Error:', err);
      throw new Error('Unable to Delete Ticket', STATUS_CODES.NOT_FOUND, null);
    }
  }

}

module.exports = CustomerService;