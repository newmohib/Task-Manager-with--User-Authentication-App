const mysql = require("mysql2");
const { DB_URL } = require("../../config");

// Set up the MySQL connection
const connection = mysql.createPool(DB_URL);

async function createCustomer({ email, password, phone, salt, name, role }) {
  try {
    const query = `
      INSERT INTO users (email, password, salt, phone, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection
      .promise()
      .query(query, [email, password, salt, phone, name, role]);
    console.log({ rows });

    // Return the inserted customer details, including the customer ID
    return {
      id: rows.insertId,
      email,
      password,
      phone,
      salt,
      name,
      role,
    };
  } catch (err) {
    console.error("Error creating customer:", err);
    throw new Error("Unable to Create Customer");
  }
}
// UpdateUserProfile
async function updateUserProfile({ email, phone, name, id }) {
  try {
    const query = `
      UPDATE users
      SET email = ?, phone = ?, name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection
      .promise()
      .query(query, [email, phone, name, id]);

    if (rows.affectedRows === 0) {
      throw new Error("User Not Found or No Changes Made");
    }

    // Return the inserted customer details, including the customer ID
    return { isSuccess: true, message: "Profile Updated" };
  } catch (err) {
    console.error("Unable to Update User Profile:", err);
    throw new Error("Unable to Update User Profile");
  }
}

// ResetPassword
async function resetPassword({ email, password }) {
  try {
    const query = `
      UPDATE users
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `;

    // Use query params to prevent SQL injection
    const [result] = await connection.promise().query(query, [password, email]);
    // console.log({ result });

    if (result.affectedRows === 0) {
      throw new Error("User Not Found or No Changes Made");
    }
    return {
      message: "Password Updated",
      isSuccess: true,
    };
  } catch (err) {
    console.error("Error Reset Password:", err);
    throw new Error("Unable to Reset Password");
  }
}
async function resetForgotPassword({ userId, password }) {
  try {
    const query = `
      UPDATE users
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    // Use query params to prevent SQL injection
    const [result] = await connection
      .promise()
      .query(query, [password, userId]);

    console.log({ result });

    if (result.affectedRows != 0) {
      const passowrdResetQuery = `DELETE FROM password_reset_requests WHERE user_id = ?;`;
      await connection.promise().query(passowrdResetQuery, [userId]);
    }

    if (result.affectedRows === 0) {
      throw new Error("User Not Found or No Changes Made");
    }
    return {
      message: "Password Updated",
      isSuccess: true,
    };
  } catch (err) {
    console.error("Error Reset Password:", err);
    throw new Error("Unable to Reset Password");
  }
}
//forgotPasswordRequest
async function forgotPasswordRequest({ userId, resetToken }) {
  try {
    const query = `
              INSERT INTO password_reset_requests (user_id, reset_token, created_at, expires_at)
              VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL 5 HOUR)
              ON DUPLICATE KEY UPDATE 
              reset_token = VALUES(reset_token), 
              created_at = VALUES(created_at), 
              expires_at = VALUES(expires_at)`;

    const [rows] = await connection
      .promise()
      .query(query, [userId, resetToken]);

    if (rows.affectedRows === 0) {
      throw new Error("Unable to create/update Forgot Password Request");
    }
    return {
      id: rows.insertId,
      resetToken,
    };
  } catch (err) {
    console.error("Error Reset Password:", err);
    throw new Error("Unable to Reset Password");
  }
}

async function findCustomerByEmail({ email }) {
  try {
    const query = `
      SELECT * FROM users WHERE email = ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query, [email]);
    console.log({ rows });

    // If no user is found, return null
    if (rows.length === 0) {
      return null;
    }

    // Returning the first user (assuming rows is an array of results)
    return rows[0];
  } catch (err) {
    console.error("Error finding user:", err);
    throw new Error("Unable to Find user");
  }
}

async function findResetPasswordToken({ resetToken }) {
  try {
    const query = `
      SELECT prr.reset_token AS resetToken, u.id AS userId, u.email, u.name, u.salt
      FROM password_reset_requests prr
      JOIN users u ON prr.user_id = u.id
      WHERE prr.reset_token = ? 
        AND prr.expires_at > NOW() 
      LIMIT 1;
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection
      .promise()
      .query(query, [resetToken]);
    console.log("200", { rows });

    // If no matching reset request is found, return null
    if (rows.length === 0) {
      return null;
    }

    // Return the first matching record (assuming rows is an array of results)
    return rows[0];
  } catch (err) {
    console.error("Unable to Find Reset Password Token:", err);
    throw new Error("Unable to Find Reset Password Token");
  }
}

async function findCustomerById(id) {
  try {
    const query = `
      SELECT email, phone, name, role, created_at, updated_at FROM users WHERE id = ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query, [id]);
    console.log({ rows });

    // If no customer is found, return null
    if (rows.length === 0) {
      return null;
    }

    // Returning the first customer (assuming rows is an array of results)
    return rows[0];
  } catch (err) {
    console.error("Error finding customer by ID:", err);
    throw new Error("Unable to Find Customer");
  }
}

async function getAllUsers(user) {
  try {
    const query = `
      SELECT id, email, phone, name, role, created_at, updated_at FROM users WHERE id <> ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query,[user.id]);
    console.log({ rows });

    // If no customer is found, return null
    if (rows.length === 0) {
      return null;
    }

    // Returning the first customer (assuming rows is an array of results)
    return rows;
  } catch (err) {
    console.error("Error finding customer by ID:", err);
    throw new Error("Unable to Find Customer");
  }
}

module.exports = {
  createCustomer,
  findCustomerByEmail,
  findCustomerById,
  resetPassword,
  forgotPasswordRequest,
  findResetPasswordToken,
  resetForgotPassword,
  updateUserProfile,
  getAllUsers
};
