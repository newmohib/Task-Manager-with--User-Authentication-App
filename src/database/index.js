// database related modules
module.exports = {
  databaseConnection: require("./connection"),
  CustomerRepository: require("./repository/user-repository"),
  TaskRepository: require("./repository/task-repository"),
};
