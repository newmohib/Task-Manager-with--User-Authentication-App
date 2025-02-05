const mysql = require('mysql2');
const { DB_URL } = require('../../config');

// Set up the MySQL connection
const connection = mysql.createPool(DB_URL);

async function createCustomer({ email, password, phone, salt, name, role }) {

  try {
    const query = `
      INSERT INTO users (email, password, salt, phone, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query, [email, password, salt, phone, name, role]);
    console.log({rows});
    

    // Return the inserted customer details, including the customer ID
    return {
      id: rows.insertId,
      email, password, phone, salt, name, role
    };
  } catch (err) {
    console.error("Error creating customer:", err);
    throw new Error("Unable to Create Customer");
  }
}

async function findCustomerByEmail({ email }) {
  try {
    const query = `
      SELECT * FROM users WHERE email = ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query, [email]);
    console.log({rows});
    

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

async function findCustomerById( id ) {
  try {
    const query = `
      SELECT * FROM users WHERE id = ?
    `;

    // Use query params to prevent SQL injection
    const [rows, fields] = await connection.promise().query(query, [id]);
    console.log({rows});
    

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

module.exports = { createCustomer, findCustomerByEmail, findCustomerById };
