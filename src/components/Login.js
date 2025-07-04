import React, { useEffect } from "react";
import password from "../assets/password.png";

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
  return (
    <div className="row">
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1>Welcome Back</h1>
          <p className="fs-5">Welcome aboard! Login to start your next trip.</p>
        </div>
      </div>
      <div className={`col-12 col-md-6 ${containerClass}`}>
        <h2 className="mb-4">Login</h2>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            @
          </span>
          <input
            type="text"
            className={inputClass}
            placeholder="example@gmail.com"
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <img
              src={password}
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
          />
        </div>
        <div className="input-group flex-nowrap mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <img
              src={password}
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
            <label className="form-check-label" for="checkDefault">
              Remember Me
            </label>
          </div>
        </div>
        <div className="input-group flex-nowrap">
          <button type="button" class="btn btn-outline-success">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
