const mysql = require("mysql2");
const { DB_URL } = require("../../config");

// Set up the MySQL connection
const connection = mysql.createPool(DB_URL);

async function createTask({ title, description, userId, dueDate, status }) {
  try {
    const query = `
      INSERT INTO tasks (title, description, user_id, due_date, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [rows] = await connection
      .promise()
      .query(query, [title, description, userId, dueDate, status]);

    return {
      taskId: rows.insertId,
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

// async function getAllTasks({ page, limit }) {
//   try {
//     const offset = (page - 1) * limit;

//     const query = `
//       SELECT t.id AS taskId, t.title, t.description, t.status, t.created_at, t.updated_at, t.due_date,
//              c.name AS userName, c.email AS userEmail
//       FROM tasks t
//       LEFT JOIN users c ON t.user_id = c.id
//       LIMIT ? OFFSET ?
//     `;

//     const countQuery = `SELECT COUNT(*) AS total FROM tasks`; // Get total count for pagination

//     // const [rows] = await connection.promise().query(query, [limit, offset]);
//     // const [[{ total }]] = await connection.promise().query(countQuery); // Fetch total count
//     // return { tasks: rows, total }; // Return both tasks and total count

//     const [rows, totalCount] = await Promise.all([
//       connection.promise().query(query, [limit, offset]),
//       connection.promise().query(countQuery),
//     ]);

//     const tasks = rows[0]; // Extract tasks from the first query result
//     const total = totalCount[0][0].total; // Extract total count from the second query result
//     return { tasks, total, page, limit }; // Return both tasks and total count
//   } catch (err) {
//     console.error("Error fetching tasks:", err);
//     throw new Error("Unable to Fetch tasks");
//   }
// }

async function getAllTasks({ page, limit, status, dueDate }) {
  try {
    const offset = (page - 1) * limit;
    let whereClause = "WHERE 1=1"; // Always true, allowing easy appending
    const queryParams = [];

    if (status) {
      whereClause += " AND t.status = ?";
      queryParams.push(status);
    }

    if (dueDate) {
      whereClause += " AND DATE(t.due_date) = ?";
      queryParams.push(dueDate);
    }

    const query = `
      SELECT t.id AS taskId, t.title, t.description, t.status, t.created_at, t.updated_at, t.due_date,
        c.name AS userName, c.email AS userEmail 
        FROM tasks t
        LEFT JOIN users c ON t.user_id = c.id
        ${whereClause} ORDER BY t.created_at DESC
        LIMIT ? OFFSET ? 
    `;

    queryParams.push(limit, offset);

    const countQuery = `SELECT COUNT(t.id) AS total FROM tasks t ${whereClause}`;
    const [rows, totalCount] = await Promise.all([
      connection.promise().query(query, queryParams),
      connection.promise().query(countQuery, queryParams.slice(0, -2)), // Remove limit & offset for count query
    ]);
    console.log(rows[0], totalCount[0]);

    const tasks = rows[0];
    const total = totalCount[0][0].total;

    return { tasks, total, page, limit };
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Unable to fetch tasks");
  }
}

async function getTaskById(taskId) {
  try {
    const query = `
      SELECT t.id AS taskId, t.title, t.description, t.status, t.created_at, t.updated_at, t.due_date,
             c.name AS userName, c.email AS userEmail 
      FROM tasks t
      LEFT JOIN users c ON t.user_id = c.id
      WHERE t.id = ?
    `;

    const [rows] = await connection.promise().query(query, [taskId]);

    if (!rows.length || rows.length === 0) {
      throw new Error("task Not Found");
    }

    return rows[0]; // Returns the task details
  } catch (err) {
    console.error("Error fetching task:", err);
    throw new Error("Unable to Fetch task");
  }
}

async function updateTask(taskId, { title, description, status, dueDate }) {
  try {
    const query = `
      UPDATE tasks
      SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP, due_date = ?
      WHERE id = ?
    `;

    const [result] = await connection
      .promise()
      .query(query, [title, description, status, dueDate, taskId]);

    if (result.affectedRows === 0) {
      throw new Error("Task Not Found or No Changes Made");
    }

    return {
      taskId,
      title,
      description,
      status,
    };
  } catch (err) {
    console.error("Error updating Task:", err);
    throw new Error("Unable to Update Task");
  }
}

async function deleteTask(taskId) {
  try {
    const query = `
      DELETE FROM tasks
      WHERE id = ?
    `;

    const [result] = await connection.promise().query(query, [taskId]);

    if (result.affectedRows === 0) {
      throw new Error("Task Not Found");
    }

    return { taskId, message: "Task Deleted Successfully" };
  } catch (err) {
    console.error("Error deleting Task:", err);
    throw new Error("Unable to Delete Task");
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
