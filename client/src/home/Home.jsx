import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export { Home };

function Home() {
  const auth = useSelector((x) => x.auth.value);
  return (
    <div>
      <div>
        <div class="text-center">
          <h1> Welcome to {auth?.name}</h1>
          <h4>
            <span id="userName">
              Task Manager with User Authentication & Profile Management
            </span>
          </h4>
        </div>

        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card shadow">
              <div class="card-body text-center">
                <h5 class="card-title">Task Management</h5>
                <p class="card-text">Manage your smart Task from here.</p>
                <a href="/tasks" class="btn btn-primary">
                  Go to Tasks
                </a>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card shadow">
              <div class="card-body text-center">
                <h5 class="card-title">User Management</h5>
                <p class="card-text">Check and manage User settings.</p>
                <a href="/users" class="btn btn-primary">
                  Go to Users
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //     <h1>Hi {auth?.firstName}!</h1>
    //     <p>You're logged in Task Manager with User Authentication & Profile Management</p>
    //     <p><Link to="/users">Manage Users</Link></p>
    // </div>
  );
}
