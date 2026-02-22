import React from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo3.png";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(props) {
  const navClass = props.darkMode
    ? "navbar navbar-expand-lg glass-container-dark"
    : "navbar navbar-expand-lg glass-container-light";
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    props.setUsername(null);
    window.location.href = "/BookMyTrip/login";
  };

  // Gradient text style
  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  // Gradient button style
  const gradientButton = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    border: "none",
    fontWeight: "600",
    color: "white",
  };

  // Regular text style with hover animation
  const navLinkStyle = {
    fontWeight: "500",
    position: "relative",
    color: props.darkMode ? "#e0e0e0" : "#333",
    transition: "all 0.3s ease",
    padding: "0.5rem 0",
    margin: "0 0.5rem",
  };

  // Hover effect for nav links
  const navLinkHoverEffect = {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "0",
    height: "2px",
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    transition: "width 0.3s ease",
  };

  return (
    <div>
      <nav
        className={`${navClass} fixed-top shadow-sm`}
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
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 position-relative"
                  to="/"
                  style={
                    location.pathname === "/" ? gradientText : navLinkStyle
                  }
                >
                  Home
                  <span
                    className="nav-link-hover-effect"
                    style={{
                      ...navLinkHoverEffect,
                      width: location.pathname === "/" ? "100%" : "0",
                    }}
                  ></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 position-relative"
                  to="/searchbus"
                  style={
                    location.pathname === "/searchbus"
                      ? gradientText
                      : navLinkStyle
                  }
                >
                  Book Ticket
                  <span
                    className="nav-link-hover-effect"
                    style={{
                      ...navLinkHoverEffect,
                      width: location.pathname === "/searchbus" ? "100%" : "0",
                    }}
                  ></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 position-relative"
                  to="/about"
                  style={
                    location.pathname === "/about" ? gradientText : navLinkStyle
                  }
                >
                  About Us
                  <span
                    className="nav-link-hover-effect"
                    style={{
                      ...navLinkHoverEffect,
                      width: location.pathname === "/about" ? "100%" : "0",
                    }}
                  ></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 position-relative"
                  to="/ticket"
                  style={
                    location.pathname === "/ticket" ? gradientText : navLinkStyle
                  }
                >
                  Bookings
                  <span
                    className="nav-link-hover-effect"
                    style={{
                      ...navLinkHoverEffect,
                      width: location.pathname === "/ticket" ? "100%" : "0",
                    }}
                  ></span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fs-5 position-relative"
                  to="/weather"
                  style={
                    location.pathname === "/weather"
                      ? gradientText
                      : navLinkStyle
                  }
                >
                  Weather
                  <span
                    className="nav-link-hover-effect"
                    style={{
                      ...navLinkHoverEffect,
                      width: location.pathname === "/weather" ? "100%" : "0",
                    }}
                  ></span>
                </Link>
              </li>
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
              {props.username ? (
                <>
                  <span className="nav-link fs-5" style={gradientText}>
                    Welcome, {props.username}
                  </span>
                  <button
                    className="btn py-2 px-3"
                    onClick={handleLogout}
                    style={{
                      background:
                        "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
                      border: "none",
                      fontWeight: "600",
                      color: "white",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="nav-link fs-5 position-relative"
                    to="/login"
                    style={gradientText}
                  >
                    Login
                  </Link>
                  <Link
                    className="btn py-2 px-3"
                    to="/signup"
                    style={{
                      ...gradientButton,
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                className="btn py-2 px-3"
                onClick={props.toggleDarkMode}
                style={
                  props.darkMode
                    ? {
                        background:
                          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        border: "none",
                        fontWeight: "600",
                        color: "#333",
                        transition: "transform 0.2s ease",
                      }
                    : {
                        background:
                          "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
                        border: "none",
                        fontWeight: "600",
                        color: "white",
                        transition: "transform 0.2s ease",
                      }
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
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
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  title: "Set title here",
};
