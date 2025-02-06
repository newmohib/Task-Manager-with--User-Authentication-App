const { CustomerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../utils/app-errors");

// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            id: existingCustomer.id,
          });
          return FormateData({ id: existingCustomer.id, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }

  async SignUp(userInputs) {
    let { email, password, phone, name, role } = userInputs;

    if (!role) role = 0;

    try {
      // create salt
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        name,
        role,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        id: existingCustomer.id,
      });

      return FormateData({ id: existingCustomer.id, token });
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }

  async GetProfile(userInof) {
    const { id } = userInof;

    try {
      const existingCustomer = await this.repository.FindCustomerById(id);
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }
  // Reset Pasword
  async ResetPassword(userInputs) {
    let { oldPassword, newPassword, email } = userInputs;
    console.log({ userInputs });

    if (!oldPassword || !newPassword || !email) {
      //   throw new APIError('Missing required fields: title, description, or userId');
      throw new APIError(
        "Missing required fields",
        STATUS_CODES.NOT_FOUND,
        "Missing required fields: oldPassword or newPassword or email"
      );
    }

    try {
      const existingUser = await this.repository.FindCustomer({ email });

      if (existingUser) {
        const validPassword = await ValidatePassword(
          oldPassword,
          existingUser.password,
          existingUser.salt
        );

        if (validPassword) {
          // const token = await GenerateSignature({ email: existingUser.email, id: existingUser.id});
          // return FormateData({id: existingUser.id, token });

          let userPassword = await GeneratePassword(
            newPassword,
            existingUser.salt
          );

          const updateUser = await this.repository.ResetPassword({
            email,
            password: userPassword,
          });
          //   console.log({ updateUser });

          if (!updateUser) {
            throw new APIError(
              "Unable to update User Password",
              STATUS_CODES.NOT_FOUND,
              null
            );
          }
          return FormateData({ message: "Password Updated" });
        } else {
          throw new APIError(
            "Invalid Old Password",
            STATUS_CODES.NOT_FOUND,
            null
          );
        }
      }
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }
  // forgot password
  async ResetPassword(userInputs) {
    let { oldPassword, newPassword, email } = userInputs;
    console.log({ userInputs });

    if (!oldPassword || !newPassword || !email) {
      //   throw new APIError('Missing required fields: title, description, or userId');
      throw new APIError(
        "Missing required fields",
        STATUS_CODES.NOT_FOUND,
        "Missing required fields: oldPassword or newPassword or email"
      );
    }

    try {
      const existingUser = await this.repository.FindCustomer({ email });

      if (existingUser) {
        const validPassword = await ValidatePassword(
          oldPassword,
          existingUser.password,
          existingUser.salt
        );

        if (validPassword) {
          // const token = await GenerateSignature({ email: existingUser.email, id: existingUser.id});
          // return FormateData({id: existingUser.id, token });

          let userPassword = await GeneratePassword(
            newPassword,
            existingUser.salt
          );

          const updateUser = await this.repository.ResetPassword({
            email,
            password: userPassword,
          });
          //   console.log({ updateUser });

          if (!updateUser) {
            throw new APIError(
              "Unable to update User Password",
              STATUS_CODES.NOT_FOUND,
              null
            );
          }
          return FormateData({ message: "Password Updated" });
        } else {
          throw new APIError(
            "Invalid Old Password",
            STATUS_CODES.NOT_FOUND,
            null
          );
        }
      }
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }
}

module.exports = CustomerService;
