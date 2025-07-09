import React from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo3.png";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(props) {
  const navClass = props.darkMode
    ? "navbar bg-dark navbar-expand-lg bg-body-tertiary"
    : "navbar navbar-expand-lg bg-body-tertiary";
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    props.setUsername(null); // instantly update state
    window.location.href = "/BookMyTrip/login";
  };

  return (
    <div>
      <nav
        className={`${navClass} fixed-top`}
        {...(props.darkMode ? { "data-bs-theme": "dark" } : {})}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              width="84"
              height="42"
              className="d-inline-block align-text-top"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Links */}
              <li className="nav-item">
                <Link
                  className={
                    location.pathname === "/"
                      ? "nav-link fs-5 active"
                      : "nav-link fs-5"
                  }
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    location.pathname === "/searchbus"
                      ? "nav-link fs-5 active"
                      : "nav-link fs-5"
                  }
                  to="/searchbus"
                >
                  Book Ticket
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    location.pathname === "/about"
                      ? "nav-link fs-5 active"
                      : "nav-link fs-5"
                  }
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    location.pathname === "/weather"
                      ? "nav-link fs-5 active"
                      : "nav-link fs-5"
                  }
                  to="/weather"
                >
                  Weather
                </Link>
              </li>
            </ul>

            {/* Right Side */}
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-4">
              {props.username ? (
                <>
                  <span
                    className="nav-link fs-5"
                    style={{ color: props.darkMode ? "white" : "black" }}
                  >
                    Welcome, {props.username}
                  </span>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="nav-link fs-5"
                    to="/login"
                    style={{ color: props.darkMode ? "white" : "black" }}
                  >
                    Login
                  </Link>
                  <Link
                    className="nav-link fs-5"
                    to="/signup"
                    style={{ color: props.darkMode ? "white" : "black" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                className="btn btn-outline-success"
                onClick={props.toggleDarkMode}
              >
                {props.darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  username: PropTypes.string,
  setUsername: PropTypes.func,
};

Navbar.defaultProps = {
  title: "Set title here",
};
