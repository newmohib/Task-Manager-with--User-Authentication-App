const {
  createCustomer,
  findCustomerByEmail,
  findCustomerById,
  resetPassword,
} = require("../models/userModel"); // Import the function

const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

//Dealing with data base operations
class CustomerRepository {
  async CreateCustomer(userInfo) {
    try {
      // Call the createCustomer function from the model
      const customer = await createCustomer(userInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return customer;
    } catch (err) {
      console.error("Registration Error:", err);
      throw new Error("Unable to Register Customer");
    }
  }
  async ResetPassword(userInfo) {
    try {
      // Call the createCustomer function from the model
      const userData = await resetPassword(userInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return userData;
    } catch (err) {
      console.error("Reset Password Error:", err);
      throw new Error("Unable to Reset Password");
    }
  }

  async FindCustomer(filterData) {
    try {
      const existingCustomer = await findCustomerByEmail(filterData);
      if (!existingCustomer) {
        return null;
      }
      return existingCustomer;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.NOT_FOUND,
        "Unable to Find Customer"
      );
    }
  }

  async FindCustomerById(id) {
    try {
      // Call the findCustomerById function from the model
      const customer = await findCustomerById(id);

      if (!customer) {
        throw new Error("Customer not found");
      }

      return customer;
    } catch (err) {
      console.error("Error getting customer by ID:", err);
      throw new Error("Unable to Retrieve Customer");
    }
  }
}

module.exports = CustomerRepository;
