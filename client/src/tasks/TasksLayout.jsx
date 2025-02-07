import { Routes, Route } from "react-router-dom";

import { TaskList, AddEditTask } from "./index";

export { TasksLayout };

function TasksLayout() {
  return (
    <div className="p-4">
      <div className="container">
        <Routes>
          <Route index element={<TaskList />} />
          <Route path="add" element={<AddEditTask />} />
          <Route path="edit/:id" element={<AddEditTask />} />
        </Routes>
      </div>
    </div>
  );
}
