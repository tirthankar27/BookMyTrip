import React from "react";

export default function Alert(props) {
  let alertType = props.darkMode ? "info" : "warning";
  return (
    <div style={{height: "50px"}}>
      <div
        className={`alert alert-${alertType} alert-dismissible fade show mb-3`}
        role="alert"
      >
        <strong>You're not Logged In</strong> Please Login/Signup before making
        bookings.
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}
