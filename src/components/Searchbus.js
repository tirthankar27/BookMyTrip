import React, { useEffect } from "react";

export default function Searchbus(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, []);
  const inputClass = props.darkMode
    ? "form-control bg-secondary text-white border-light"
    : "form-control";

  const containerClass = props.darkMode
    ? "container bg-dark p-4 rounded"
    : "container bg-light p-4 rounded";
  return (
    <div>
      <div className={containerClass}>
        <div className="row g-3">
          <div className="col">
            <input
              type="text"
              className={inputClass}
              placeholder="From"
              aria-label="From"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className={inputClass}
              placeholder="To"
              aria-label="To"
            />
          </div>
          <div className="col">
            <input type="date" className={inputClass} aria-label="Date" />
          </div>
          <div className="col">
            <button type="submit" className={"btn btn-outline-success"}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
