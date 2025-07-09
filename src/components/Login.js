import React, { useEffect, useState } from "react";
import passwordImg from "../assets/password.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);
  const inputClass = props.darkMode
    ? "form-control bg-secondary text-white border-light"
    : "form-control";
  const containerClass = props.darkMode
    ? "container bg-dark p-4 rounded"
    : "container bg-light p-4 rounded";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please fill in all fields.");
    }
    try {
      const response = await fetch(props.loginendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("token", result.authToken);
        localStorage.setItem("username", result.username);
        props.setUsername(result.username);
        console.log("Login successful:", result);
        props.showAlert("Login successfull!", "success");
        navigate("/");
      } else {
        console.error("Login failed:", result.error || result.message);
        props.showAlert(
          result.message || "Login failed. Please try again.",
          "danger"
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="row mt-5">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1>Welcome Back</h1>
          <p className="fs-5">Welcome aboard! Login to start your next trip.</p>
        </div>
      </div>
      <form
        className={`col-12 col-md-6 ${containerClass}`}
        onSubmit={handleLogin}
      >
        <h2 className="mb-4">Login</h2>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            @
          </span>
          <input
            type="text"
            className={inputClass}
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <img
              src={passwordImg}
              alt="password"
              className="img-fluid"
              style={{ maxHeight: "20px", maxWidth: "15px" }}
            />
          </span>
          <input
            type="password"
            className={inputClass}
            placeholder="password"
            id="inputPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group flex-nowrap mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="checkDefault"
            />
            <label className="form-check-label" htmlFor="checkDefault">
              Remember Me
            </label>
          </div>
        </div>
        <div className="input-group flex-nowrap mb-4">
          <button type="submit" className="btn btn-outline-success">
            Login
          </button>
        </div>
        <div className="input-group flex-nowrap">
          <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
