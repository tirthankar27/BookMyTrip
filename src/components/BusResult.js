import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BusResult(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { buses = [], doj } = location.state || {};

  // Dark mode classes
  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  const textClass = props.darkMode ? "text-white" : "text-dark";
  const cardClass = props.darkMode
    ? "glass-dark text-white"
    : "glass-light text-dark";

  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  const handleBookNow = (bus) => {
    navigate("/enterdetails", { state: { bus:{...bus,doj } } });
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="busresult-overlay"></div>

      <div className="container py-5">
        <div
          className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg mb-5`}
        >
          <h2 className="text-center mb-4 fw-bold" style={gradientText}>
            {buses.length > 0 ? "Available Buses" : "No Buses Found"}
          </h2>

          {buses.length > 0 ? (
            <div className="row gy-4">
              {buses.map((bus, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className={`card shadow-lg border-0 ${cardClass}`}>
                    <div className="card-body p-4">
                      <h5
                        className="card-title fw-bold mb-3"
                        style={gradientText}
                      >
                        {bus.name}
                      </h5>

                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-bus-front me-2"></i>
                        <span>Type: {bus.busType}</span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-clock me-2"></i>
                        <span>
                          Dep: {bus.departureTime} | Arr: {bus.arrivalTime}
                        </span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-calendar-week me-2"></i>
                        <span>Days: {bus.daysOfWeek?.join(", ")}</span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-currency-rupee me-2"></i>
                        <span>
                          Fare: ₹{Math.round(bus.baseFare * bus.fareMultiplier)}
                        </span>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-people me-2"></i>
                        <span>Seats: {bus.availableSeats} available</span>
                      </div>

                      <button
                        className="btn w-100 py-2 mt-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                          border: "none",
                          fontWeight: "600",
                          color: "white",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                        onClick={() => handleBookNow(bus)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <h3 className="mt-3" style={gradientText}>
                Sorry we don't serve this route yet!
              </h3>
              <p className="mt-3 fs-5">
                Try another route or check again later.
              </p>
              <button
                className="btn mt-3"
                style={{
                  background:
                    "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none",
                  fontWeight: "600",
                  color: "white",
                  padding: "8px 24px",
                }}
                onClick={() => navigate("/searchbus")}
              >
                Search Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
