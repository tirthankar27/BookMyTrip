import React, { useEffect, useState } from "react";
import passwordImg from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);

  // Glass morphism classes with gradient text
  const inputClass = props.darkMode
    ? "form-control glass-dark"
    : "form-control glass-light";

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      props.showAlert("Please fill in all fields", "warning");
      return;
    }

    try {
      const response = await fetch(props.loginendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.authToken);
        localStorage.setItem("username", result.username);
        localStorage.setItem("email", email);
        localStorage.setItem("role", result.role);
        props.setUsername(result.username);
        if (props.setRole) {
          props.setRole(result.role);
        }
        props.showAlert("Login successful!", "success");
        navigate("/");
      } else {
        props.showAlert(result.message || "Login failed", "danger");
      }
    } catch (err) {
      console.error("Network error:", err);
      props.showAlert("Connection error. Please try again.", "danger");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="login-overlay"></div>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className={`${containerClass} p-4 rounded-3 shadow-lg`}
          style={{ width: "90%", maxWidth: "1000px" }}
        >
          <div className="row g-0">
            {/* Left side - Welcome message */}
            <div className="col-lg-6 p-4 d-flex flex-column">
              <h1
                className="mb-4 text-gradient-blue"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                Welcome Back
              </h1>
              <p className="text-gradient-blue mb-4">
                Ready for your next adventure? Log in to continue your journey.
              </p>
              <div className="mt-auto">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3212/3212567.png"
                  alt="Travel illustration"
                  className="img-fluid"
                  style={{ maxHeight: "200px", opacity: 0.9 }}
                />
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="col-lg-6 p-4">
              <form onSubmit={handleLogin} className="h-100 d-flex flex-column">
                <h2 className="mb-4 text-center text-gradient-blue">Login</h2>

                <div className="mb-3">
                  <label className="form-label text-gradient-blue">Email</label>
                  <div className="input-group">
                    <span
                      className={`input-group-text ${
                        props.darkMode ? "bg-dark text-white" : "bg-light"
                      }`}
                    >
                      @
                    </span>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-gradient-blue">
                    Password
                  </label>
                  <div className="input-group">
                    <span
                      className={`input-group-text ${
                        props.darkMode ? "bg-dark text-white" : "bg-light"
                      }`}
                    >
                      <img src={passwordImg} alt="password" width="15" />
                    </span>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label
                    className="form-check-label text-gradient-blue"
                    htmlFor="rememberMe"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-2 mb-2 mt-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                    border: "none",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Login
                </button>

                <div className="text-center">
                  <Link
                    to="/signup"
                    className="text-gradient-blue"
                    style={{ textDecoration: "none", fontWeight: "500" }}
                  >
                    Don't have an account? Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
