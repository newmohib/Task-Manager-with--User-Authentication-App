import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "_store";

export { Nav };

function Nav() {
  const auth = useSelector((x) => x.auth.value);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!auth) return null;
  // get user id from auth object

  return (
    <nav
      class="navbar navbar-expand-lg "
      style={{ backgroundColor: "#e3f2fd" }}
    >
      <div class="container-fluid">
        <a className="navbar-brand" href="/">
          Logo
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <NavLink to="/" className="nav-item nav-link">
                Home
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink to="/users" className="nav-item nav-link">
                Users
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink to="/tasks" className="nav-item nav-link">
                Tasks
              </NavLink>
            </li>
          </ul>
          {/* <span class="navbar-text">Navbar text with an inline element</span> */}
          <NavLink
            to={`users/edit/${auth.id}?isSelf=${true}`}
            className="nav-item nav-link mx-4"
          >
            Edit Profile
          </NavLink>
          <button onClick={logout} className="btn btn-link nav-item nav-link">
            Logout
          </button>
        </div>
      </div>

      {/* <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <div className="navbar-nav">
          <NavLink to="/" className="nav-item nav-link">
            Home
          </NavLink>
          <NavLink to="/users" className="nav-item nav-link">
            Users
          </NavLink>
          <NavLink to="/tasks" className="nav-item nav-link">
            Tasks
          </NavLink>
          <NavLink
            to={`users/edit/${auth.id}?isSelf=${true}`}
            className="nav-item nav-link"
          >
            Edit Profile
          </NavLink>
          <button onClick={logout} className="btn btn-link nav-item nav-link">
            Logout
          </button>
        </div>
      </nav> */}
    </nav>
  );
}
