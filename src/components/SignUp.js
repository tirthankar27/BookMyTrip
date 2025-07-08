import React from "react";
import { useEffect, useState } from "react";
import passwordImg from "../assets/password.png";
import { Link } from "react-router-dom";

export default function SignUp(props) {
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch(props.signupendpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Signup successful:", result);
    } else {
      console.error("Signup failed:", result.error || result.message);
    }
  };
  return (
    <div className="row mt-5">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1>Hop On to Hassle-Free Travel</h1>
          <p className="fs-5">Sign Up and Book Your Ride in Minutes!</p>
        </div>
      </div>
      <form
        className={`col-12 col-md-6 ${containerClass}`}
        onSubmit={handleSignup}
      >
        <h2 className="mb-4">Sign Up</h2>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            @
          </span>
          <input
            type="text"
            className={inputClass}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
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
            placeholder="re enter password"
            id="reinputPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="input-group flex-nowrap mb-4">
          <button type="submit" className="btn btn-outline-success">
            Sign up
          </button>
        </div>
        <div className="input-group flex-nowrap">
          <Link to="/login">Already have an account?</Link>
        </div>
        <div className="input-group flex-nowrap">
          <p>
            By clicking on "Sign up" you agree to <u>Terms of Service</u> |{" "}
            <u>Privacy Policy</u>
          </p>
        </div>
      </form>
    </div>
  );
}
