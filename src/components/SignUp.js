import React from "react";
import { useEffect } from "react";
import password from "../assets/password.png";

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
  return (
    <div className={containerClass}>
      <div>
        <h1>Welcome Back</h1>
      </div>
      <h2>Sign Up</h2>
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
      <div className="input-group flex-nowrap">
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
    </div>
  );
}
