import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaBus,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaUserFriends,
  FaRupeeSign,
} from "react-icons/fa";

export default function Confirmation(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, passengers, totalFare } = location.state || {};
  const [places, setPlaces] = useState({
    sourceName: "",
    destinationName: "",
  });
  useEffect(() => {
    const fetchPlaceNames = async () => {
      try {
        // Fetch source name
        const sourceResponse = await axios.get(props.placename, {
          params: { id: bus.source },
        });
        // Fetch destination name
        const destinationResponse = await axios.get(props.placename, {
          params: { id: bus.destination },
        });

        setPlaces({
          sourceName: sourceResponse.data.place.name,
          destinationName: destinationResponse.data.place.name,
        });
      } catch (error) {
        console.error("Error fetching place names:", error);
        // Fallback to showing IDs if API fails
        setPlaces({
          sourceName: bus.source,
          destinationName: bus.destination,
        });
      }
    };

    if (bus?.source && bus?.destination) {
      fetchPlaceNames();
    }
  }, [bus]);
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

  const celebrationEmojis = ["🎉", "✨", "🚌", "👍", "👏", "🎊"];

  if (!bus || !passengers || !totalFare) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div className="confirmation-overlay"></div>
        <div className="container py-5">
          <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
            <h2 className="text-center mb-4" style={gradientText}>
              Booking Not Found
            </h2>
            <p className={`text-center fs-5 ${textClass}`}>
              We couldn't find your booking details. Please check your email or
              try booking again.
            </p>
            <div className="text-center mt-4">
              <button
                className="btn"
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
                Search Buses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="confirmation-overlay"></div>

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          {/* Celebration Header */}
          <div className="text-center mb-5">
            <FaCheckCircle
              className="mb-3"
              style={{
                fontSize: "5rem",
                color: "#28a745",
                filter: "drop-shadow(0 4px 8px rgba(40, 167, 69, 0.3))",
              }}
            />
            <h1 style={gradientText}>Booking Confirmed!</h1>
            <p className={`fs-4 ${textClass} mt-3`}>
              Your journey with {bus.name} is all set!{" "}
              {
                celebrationEmojis[
                  Math.floor(Math.random() * celebrationEmojis.length)
                ]
              }
            </p>
            <p className={`${textClass}`}>
              A confirmation has been sent to your email. Happy travels!
            </p>
          </div>

          {/* Unique Message */}
          <div className={`${cardClass} p-4 mb-5 rounded-4 shadow text-center`}>
            <h4 style={gradientText}>✨ Adventure Awaits! ✨</h4>
            <p className={`${textClass} mb-0`}>
              "Every journey begins with a single ticket. Yours starts now! Get
              ready to create memories that'll last a lifetime."
            </p>
          </div>

          {/* Booking Details */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className={`${cardClass} p-4 h-100 rounded-4 shadow`}>
                <h4 className="mb-4" style={gradientText}>
                  Trip Details
                </h4>

                <div className="d-flex align-items-center mb-3">
                  <FaBus className="me-3" size="1.5em" />
                  <div>
                    <h5 className="mb-0">{bus.name}</h5>
                    <small className={`${textClass}`}>{bus.busType}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaMapMarkedAlt className="me-3" size="1.5em" />
                  <div>
                    <h6 className="mb-0">
                      {places.sourceName || bus.source} →{" "}
                      {places.destinationName || bus.destination}
                    </h6>
                    <small className={`${textClass}`}>
                      Dep: {bus.departureTime} | Arr: {bus.arrivalTime}
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <FaCalendarAlt className="me-3" size="1.5em" />
                  <div>
                    <h6 className="mb-0">Date of Journey</h6>
                    <p className={`mb-0 ${textClass}`}>
                      {new Date(bus.doj).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className={`${cardClass} p-4 h-100 rounded-4 shadow`}>
                <h4 className="mb-4" style={gradientText}>
                  Your Passengers
                </h4>

                <div className="mb-3">
                  {passengers.map((p, i) => (
                    <div
                      key={i}
                      className={`d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 ${
                        props.darkMode ? "bg-dark" : "bg-light"
                      }`}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {i + 1}
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{p.name}</h6>
                          <small className={`${textClass}`}>
                            Seat {p.seat}
                          </small>
                        </div>
                      </div>
                      <div className="badge bg-primary rounded-pill px-3 py-1">
                        ₹{Math.round(bus.baseFare * bus.fareMultiplier)}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`d-flex justify-content-between align-items-center p-3 rounded-3 ${
                    props.darkMode ? "bg-dark" : "bg-light"
                  }`}
                >
                  <h5 className="mb-0">Total Paid</h5>
                  <h4 className="mb-0" style={gradientText}>
                    ₹{totalFare}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className={`${cardClass} p-4 rounded-4 shadow`}>
            <h4 className="mb-3" style={gradientText}>
              Need Help?
            </h4>
            <p className={`${textClass}`}>
              Contact our 24/7 customer support at{" "}
              <a
                href="mailto:tirthankarghosh4@gmail.com"
                className="text-decoration-none"
                style={gradientText}
              >
                tirthankarghosh4@gmail.com
              </a>{" "}
              or call <span style={gradientText}>+91-9733978278</span>
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-5">
            <button
              className="btn me-3"
              style={{
                background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                border: "none",
                fontWeight: "600",
                color: "white",
                padding: "8px 24px",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => navigate("/searchbus")}
            >
              Book Another Trip
            </button>
            <button
              className="btn"
              style={{
                background: props.darkMode ? "#2c3e50" : "#e9ecef",
                border: "none",
                fontWeight: "600",
                color: props.darkMode ? "white" : "black",
                padding: "8px 24px",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
