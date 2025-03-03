CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending', 'in_progress', 'completed', 'on_hold', 'canceled', 'failed', 'review', 'approved', 'rejected') DEFAULT 'pending',
  user_id INT NOT NULL, -- Reference to the user who created the tasks
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  due_date TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE -- Example: 'Admin', 'Customer Support'
);

INSERT INTO roles (role_name)
SELECT 'Admin'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Admin');

CREATE TABLE password_reset_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE, -- Ensure each user has only one reset request
    reset_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 HOUR),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- CREATE TABLE task_replies (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   task_id INT NOT NULL, -- Reference to the task
--   user_id INT NOT NULL, -- Reference to the user replying
--   reply TEXT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );



-- CREATE TABLE task_status_history (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   task_id INT NOT NULL, -- Reference to the task
--   previous_status ENUM('Open', 'Resolved', 'Closed') NOT NULL,
--   new_status ENUM('Open', 'Resolved', 'Closed') NOT NULL,
--   changed_by INT NOT NULL, -- Reference to the user who changed the status
--   changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
--   FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE
-- );


