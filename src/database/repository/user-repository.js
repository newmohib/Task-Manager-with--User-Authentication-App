const {
  createCustomer,
  findCustomerByEmail,
  findCustomerById,
  resetPassword,
  forgotPasswordRequest,
  findResetPasswordToken,
  resetForgotPassword,
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
  // resetForgotPassword
  async ResetForgotPassword(userInfo) {
    try {
      // Call the createCustomer function from the model
      const userData = await resetForgotPassword(userInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return userData;
    } catch (err) {
      console.error("Reset Password Error:", err);
      throw new Error("Unable to Reset Password");
    }
  }

  async ForgotPasswordRequest(userInfo) {
    try {
      // Call the createCustomer function from the model
      const userData = await forgotPasswordRequest(userInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return userData;
    } catch (err) {
      console.error("Forgot Password Request Error:", err);
      throw new Error("Forgot Password Request Error");
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

  async FindResetPasswordToken(resetTokenInfo) {
    try {
      const existingTokenInfo = await findResetPasswordToken(resetTokenInfo);
      if (!existingTokenInfo) {
        return null;
      }
      return existingTokenInfo;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.NOT_FOUND,
        "Unable to Find Forgot Password Token"
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
