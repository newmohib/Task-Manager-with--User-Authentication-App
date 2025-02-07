import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "tasks";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const taskActions = { ...slice.actions, ...extraActions };
export const tasksReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    list: null,
    item: null,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/tasks`;

  return {
    create: createTask(),
    getAll: getAllTasks(),
    getById: getTaskById(),
    update: updateTask(),
    delete: deleteTask(),
  };

  function createTask() {
    return createAsyncThunk(
      `${name}/create`,
      async (task) => await fetchWrapper.post(`${baseUrl}/create`, task)
    );
  }

  // function getAllTasks() {
  //   return createAsyncThunk(
  //     `${name}/getAll`,
  //     async () => await fetchWrapper.get(`${baseUrl}/all`)
  //   );
  // }

  // function getAllTasks() {
  //   return createAsyncThunk(
  //     `${name}/getAll`,
  //     async ({ page = 1, limit = 10 }) =>
  //       await fetchWrapper.get(`${baseUrl}/all?page=${page}&limit=${limit}`)
  //   );
  // }

  function getAllTasks() {
    return createAsyncThunk(
      `${name}/getAll`,
      async ({ page = 1, limit = 10, status = "", dueDate = "" }) => {
        if (!status) status = "";
        if (!dueDate) dueDate = "";
        let queryParams = new URLSearchParams({ page, limit, status, dueDate });
        // if (status) queryParams.append("status", status);
        // if (dueDate) queryParams.append("dueDate", dueDate);

        return await fetchWrapper.get(
          `${baseUrl}/all?${queryParams.toString()}`
        );
      }
    );
  }

  function getTaskById() {
    return createAsyncThunk(
      `${name}/getById`,
      async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
    );
  }

  function updateTask() {
    return createAsyncThunk(
      `${name}/update`,
      async ({ id, data }) => await fetchWrapper.put(`${baseUrl}/update`, data)
    );
  }

  function deleteTask() {
    return createAsyncThunk(
      `${name}/delete`,
      async (id) => await fetchWrapper.delete(`${baseUrl}/${id}`)
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getAllTasks();
    getTaskById();
    deleteTask();

    function getAllTasks() {
      var { pending, fulfilled, rejected } = extraActions.getAll;
      builder
        .addCase(pending, (state) => {
          state.list = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          const { tasks, total, page, limit } = action.payload;
          const totalPages = Math.ceil(total / limit); // Calculate total pages

          state.list = {
            value: tasks,
            total,
            page,
            totalPages,
          };
        })
        .addCase(rejected, (state, action) => {
          state.list = { error: action.error };
        });
    }

    function getTaskById() {
      var { pending, fulfilled, rejected } = extraActions.getById;
      builder
        .addCase(pending, (state) => {
          state.item = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.item = { value: action.payload };
        })
        .addCase(rejected, (state, action) => {
          state.item = { error: action.error };
        });
    }

    function deleteTask() {
      var { pending, fulfilled, rejected } = extraActions.delete;
      builder
        .addCase(pending, (state, action) => {
          const task = state.list?.value?.find((x) => x.id === action.meta.arg);
          if (task) task.isDeleting = true;
        })
        .addCase(fulfilled, (state, action) => {
          state.list.value = state.list.value.filter(
            (x) => x.id !== action.meta.arg
          );
        })
        .addCase(rejected, (state, action) => {
          const task = state.list?.value?.find((x) => x.id === action.meta.arg);
          if (task) task.isDeleting = false;
        });
    }
  };
}
