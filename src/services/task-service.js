const { TaskRepository } = require("../database");
const { FormateData } = require("../utils");
// const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../utils/app-errors");

// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new TaskRepository();
  }

  async createTask(taskInputs) {
    const { title, description, userId, dueDate = null, status } = taskInputs;

    if (!title || !description || !userId) {
      //   throw new APIError('Missing required fields: title, description, or userId');
      throw new APIError(
        "Missing required fields",
        STATUS_CODES.NOT_FOUND,
        "Missing required fields: title, description, or userId"
      );
    }

    try {
      // Call the createTask function from the model
      const taskInfo = await this.repository.createTask({
        title,
        description,
        userId,
        dueDate,
        status,
      });

      if (taskInfo.taskId) {
        return FormateData({
          isSuccess: true,
          message: "Task Created Succesfully!",
        });
      } else {
        throw new APIError(
          "Unable to Create Task",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }
    } catch (err) {
      console.error("Task Create Error:", err);
      throw new APIError("Unable to Create Task", STATUS_CODES.NOT_FOUND, err);
    }
  }

  // Fetch all tasks
  async getAllTasks(data) {
    try {
      // Call the getAllTasks function from the model
      const taskList = await this.repository.getAllTasks(data);

      return taskList;
    } catch (err) {
      console.error("Get Task Error:", err);
      throw new APIError("Unable to Get Tasks", STATUS_CODES.NOT_FOUND, err);
    }
  }

  async getTaskById(taskId) {
    try {
      if (!taskId) {
        throw new APIError(
          "Invalid Task ID provided",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }

      // Call the getTaskById function from the model
      const taskInfo = await this.repository.getTaskById(taskId);

      if (!taskInfo) {
        throw new APIError("Task not found", STATUS_CODES.NOT_FOUND, null);
      }

      console.log("Fetched Task:", taskInfo);
      // Add additional logic here if needed
      return taskInfo;
    } catch (err) {
      console.error("Get Task By ID Error:", err);
      throw new APIError("Unable to Get Task", STATUS_CODES.NOT_FOUND, err);
    }
  }

  // Update task
  async updateTask(data) {
    try {
      const { taskId, ...updateFields } = data;

      if (!taskId) {
        throw new APIError(
          "Task ID is required for update",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }

      // Call the model function to update the Task
      const updatedTask = await this.repository.updateTask({
        taskId,
        updateFields,
      });

      if (!updatedTask) {
        throw new APIError(
          "Unable to update Task. Task not found.",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }

      return FormateData({
        isSuccess: true,
        message: "Task Updated Succesfully!",
      });

      //return updatedTask;
    } catch (err) {
      console.error("Task Update Error:", err);
      throw new Error("Unable to Update Task", STATUS_CODES.NOT_FOUND, null);
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      if (!taskId) {
        throw new APIError(
          "Task ID is required for deletion",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }

      // Call the model function to delete the Task
      const result = await this.repository.deleteTask(taskId);

      if (!result) {
        throw new APIError(
          "Unable to delete Task. Task not found.",
          STATUS_CODES.NOT_FOUND,
          null
        );
      }
      return { isSuccess: true, message: "Task deleted successfully", taskId };
    } catch (err) {
      console.error("Task Deletion Error:", err);
      throw new Error("Unable to Delete Task", STATUS_CODES.NOT_FOUND, null);
    }
  }
}

module.exports = CustomerService;
