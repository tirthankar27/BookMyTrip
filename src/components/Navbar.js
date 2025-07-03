import React from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo3.png";
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
export default function Navbar(props) {
  const navClass = props.darkMode ? "navbar bg-dark navbar-expand-lg bg-body-tertiary" : "navbar navbar-expand-lg bg-body-tertiary";
  const location = useLocation();
  return (
    <div>
      <nav
        className={navClass}
        {...props.darkMode ? {"data-bs-theme":"dark"} : {}}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
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
              <li className="nav-item">
                <Link className={location.pathname !== "/about" && location.pathname!=="/weather" && location.pathname==="/"? "nav-link fs-5 active" : "nav-link fs-5"} aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={location.pathname === "/about" && location.pathname!=="/weather" && location.pathname!=="/" ? "nav-link fs-5 active" : "nav-link fs-5"} to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className={location.pathname !== "/about" && location.pathname==="/weather" && location.pathname!=="/" ? "nav-link fs-5 active" : "nav-link fs-5"} to="/weather">
                  Weather
                </Link>
              </li>
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-4">
              <Link
                className="nav-link fs-5"
                aria-current="page"
                to="/login"
                style={{ color: props.darkMode ? "white" : "black" }}
              >
                Login
              </Link>
              <Link
                className="nav-link fs-5"
                aria-current="page"
                to="/signup"
                style={{ color: props.darkMode ?"white" : "black" }}
              >
                Sign Up
              </Link>
              <button className="btn btn-outline-success" onClick={props.toggleDarkMode}>{props.darkMode ? "Light Mode" : "Dark Mode"}</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
  title: "Set title here",
};
