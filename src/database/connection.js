// const mysql = require('mysql2');
// const { DB_URL } = require('../config');  // Make sure DB_URL contains your MySQL connection string

// // Set up the MySQL connection
// const connection = mysql.createConnection(DB_URL);

// // Create a wrapper function for database connection
// // module.exports = async () => {
// //   try {
// //     connection.connect((err) => {
// //       if (err) {
// //         console.error('Error connecting to the database:', err.stack);
// //         process.exit(1);  // Exit the process if there is an error
// //       } else {
// //         console.log('Database connected as ID ' + connection.threadId);
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error occurred while connecting to the database:', error);
// //     process.exit(1);  // Exit if there's an error
// //   }
// // };

// class DBConnection {
//   async isDBConnected () {
//     try {
//       connection.connect((err) => {
//         if (err) {
//           console.error('Error connecting to the database:', err.stack);
//           process.exit(1);  // Exit the process if there is an error
//         } else {
//           console.log('Database connected as ID ' + connection.threadId);
//         }
//       });
//     } catch (error) {
//       console.error('Error occurred while connecting to the database:', error);
//       process.exit(1);  // Exit if there's an error
//     }
//   };
//   async connection() {
//     return connection;
//   }
// }

// module.exports = new DBConnection();

const mysql = require('mysql2/promise');
const { DB_URL } = require('../config');  // Make sure DB_URL contains your MySQL connection string

class DBConnection {
  constructor() {
    this.connection = null;  // Holds the database connection instance
  }

  // Initialize the connection
  async init() {
    try {
      this.connection = await mysql.createPool(DB_URL);
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1);  // Exit the process if there is an error
    }
  }

  // Get the connection instance
  // getConnection() {
  //   if (!this.connection) {
  //     throw new Error('Database connection not initialized. Call init() first.');
  //   }
  //   return this.connection;
  // }
}

module.exports = new DBConnection();
