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
// import mail service
const { sendEmail } = require("../utils/mailService");
// config
const { APP_URL, ADMIN_APP_URL } = require("../config");

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

  async UpdateUserProfile(userInputs) {
    let { email, phone, name, id } = userInputs;

    try {

      const result = await this.repository.UpdateUserProfile({
        email,
        phone,
        name,
        id
      });

      return FormateData(result);
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
  //GetAllUsers
  async GetAllUsers(user) {

    try {
      const existingCustomer = await this.repository.GetAllUsers(user);
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
  async ForgotPasswordUpdate(userInputs) {
    let { password, resetToken } = userInputs;
    console.log({ userInputs });

    if (!password || !resetToken) {
      //   throw new APIError('Missing required fields: password or resetToken');
      throw new APIError(
        "Missing required fields",
        STATUS_CODES.NOT_FOUND,
        "Missing required fields: password or resetToken"
      );
    }

    try {
      const existingUser = await this.repository.FindResetPasswordToken({
        resetToken,
      });

      if (existingUser && existingUser.resetToken && existingUser.salt) {
        let userPassword = await GeneratePassword(password, existingUser.salt);

        const updateUser = await this.repository.ResetForgotPassword({
          userId: existingUser.userId,
          password: userPassword,
        });

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
          "Invalid User Reset Token",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }

  //
  async ForgotPasswordRequest(userInputs) {
    let { email } = userInputs;
    console.log({ userInputs });

    if (!email) {
      throw new APIError(
        "Missing required fields",
        STATUS_CODES.NOT_FOUND,
        "Missing required fields: email"
      );
    }

    try {
      const existingUser = await this.repository.FindCustomer({ email });

      if (existingUser) {
        let resetToken = await GenerateSalt();

        const updateUser = await this.repository.ForgotPasswordRequest({
          userId: existingUser.id,
          resetToken: resetToken,
        });

        if (!updateUser) {
          throw new APIError(
            "Unable to add User Reset token",
            STATUS_CODES.NOT_FOUND,
            null
          );
        }
        // send email here
        let resetLink = `${ADMIN_APP_URL}/reset-password?resetToken=${resetToken}`;
        const mailSendResult = await sendEmail({
          to: email,
          // to: "newmohib@gmail.com",
          subject: "Reset Password Request",
          text: "Reset Password Request",
          html: ``,
          userName: existingUser.name,
          resetLink,
        });
        if (mailSendResult.isSuccess) {
          return FormateData({
            message:
              "Sent an Email with reset link, please check you email and also check your spam folder",
          });
        } else {
          throw new APIError(
            "Can not send email",
            STATUS_CODES.NOT_FOUND,
            null
          );
        }
      } else {
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, null);
      }
    } catch (err) {
      throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND, err);
    }
  }
}

module.exports = CustomerService;
