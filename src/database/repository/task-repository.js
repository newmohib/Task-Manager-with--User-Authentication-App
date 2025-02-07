const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../models/taskModel"); // Import the function

// const {
//   APIError,
//   BadRequestError,
//   STATUS_CODES,
// } = require("../../utils/app-errors");

//Dealing with data base operations
class TaskRepository {
  async createTask(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await createTask(data);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Task Create Error:", err);
      throw new Error("Unable to Create Task");
    }
  }

  async getAllTasks(data) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await getAllTasks(data);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Get Task Error:", err);
      throw new Error("Unable to Get Task");
    }
  }

  async getTaskById(taskId) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await getTaskById(taskId);
      console.log("Fetched Task:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Get Task Error:", err);
      throw new Error("Unable to Get Task");
    }
  }

  async updateTask({ taskId, updateFields }) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await updateTask(taskId, updateFields);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Task Update Error:", err);
      throw new Error("Unable to Update Task");
    }
  }

  async deleteTask(taskId) {
    try {
      // Call the createCustomer function from the model
      const ticktInfo = await deleteTask(taskId);
      console.log("Deleted Task:", ticktInfo);
      // You can add additional logic, like sending a confirmation email, etc.
      return ticktInfo;
    } catch (err) {
      console.error("Delete Task Error:", err);
      throw new Error("Unable to Delete Task");
    }
  }
}

module.exports = TaskRepository;
