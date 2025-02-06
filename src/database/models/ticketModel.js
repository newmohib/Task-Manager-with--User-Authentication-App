const mysql = require("mysql2");
const { DB_URL } = require("../../config");

// Set up the MySQL connection
const connection = mysql.createPool(DB_URL);

async function createTicket({ title, description, userId, dueDate }) {
  try {
    const query = `
      INSERT INTO tasks (title, description, user_id, due_date)
      VALUES (?, ?, ?, ?)
    `;

    const [rows] = await connection
      .promise()
      .query(query, [title, description, userId, dueDate]);

    return {
      ticketId: rows.insertId,
      title,
      description,
      userId,
      dueDate,
    };
  } catch (err) {
    console.error("Error creating task:", err);
    throw new Error("Unable to Create task");
  }
}

async function getAllTickets() {
  try {
    const query = `
      SELECT t.id AS taskId, t.title, t.description, t.status, t.created_at, t.updated_at, t.due_date,
             c.name AS userName, c.email AS userEmail 
      FROM tasks t
      LEFT JOIN users c ON t.user_id = c.id
    `;

    const [rows] = await connection.promise().query(query);
    //log
    //console.log({ rows });

    return rows; // Returns an array of all tasks with details
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Unable to Fetch tasks");
  }
}

async function getTicketById(ticketId) {
  try {
    const query = `
      SELECT t.id AS ticketId, t.subject, t.description, t.status, t.created_at, t.updated_at,
             c.name AS customerName, e.name AS executiveName
      FROM tickets t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users e ON t.executive_id = e.id
      WHERE t.id = ?
    `;

    const [rows] = await connection.promise().query(query, [ticketId]);

    if (rows.length === 0) {
      throw new Error("Ticket Not Found");
    }

    return rows[0]; // Returns the ticket details
  } catch (err) {
    console.error("Error fetching ticket:", err);
    throw new Error("Unable to Fetch Ticket");
  }
}

async function updateTicket(
  ticketId,
  { subject, description, status, executiveId }
) {
  try {
    const query = `
      UPDATE tickets
      SET subject = ?, description = ?, status = ?, executive_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await connection
      .promise()
      .query(query, [subject, description, status, executiveId, ticketId]);

    if (result.affectedRows === 0) {
      throw new Error("Ticket Not Found or No Changes Made");
    }

    return {
      ticketId,
      subject,
      description,
      status,
      executiveId,
    };
  } catch (err) {
    console.error("Error updating ticket:", err);
    throw new Error("Unable to Update Ticket");
  }
}

async function deleteTicket(ticketId) {
  try {
    const query = `
      DELETE FROM tickets
      WHERE id = ?
    `;

    const [result] = await connection.promise().query(query, [ticketId]);

    if (result.affectedRows === 0) {
      throw new Error("Ticket Not Found");
    }

    return { ticketId, message: "Ticket Deleted Successfully" };
  } catch (err) {
    console.error("Error deleting ticket:", err);
    throw new Error("Unable to Delete Ticket");
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
