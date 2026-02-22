import React from "react";
export default function Alert(props) {
  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  return (
    <div
      style={{
        height: "60px",
        top: "56px",
        left: 0,
        right: 0,
        zIndex: 1051,
        position: "fixed",
      }}
    >
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show mb-3`}
          role="alert"
        >
          {capitalize(props.alert.msg)}
        </div>
      )}
    </div>
  );
}
