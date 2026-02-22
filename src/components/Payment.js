import React,{ useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import upiImage from "../assets/UPI.jpg";

export default function Payment(props) {
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
  const listItemClass = props.darkMode
    ? "bg-dark text-white"
    : "bg-light text-dark";

  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  const handleBook = async () => {
    if (!bus || !passengers || !totalFare) return;

    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      for (const p of passengers) {
        const response = await axios.post(
          props.bookingendpoint,
          {
            bus: bus._id,
            passenger: p.name,
            email: email || "anonymous@example.com",
            doj: bus.doj,
            source: bus.source,
            destination: bus.destination,
            seatnumber: p.seat,
            fare: Math.round(bus.baseFare * bus.fareMultiplier),
          },
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        if (!response.data.success) {
          throw new Error("One or more bookings failed");
        }
      }

      // Redirect on success
      navigate("/confirmation", { state: { bus, passengers, totalFare } });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  if (!bus || !passengers || !totalFare) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div className="payment-overlay"></div>
        <div className="container py-5">
          <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
            <h2 className="text-center mb-4" style={gradientText}>
              Payment Error
            </h2>
            <p className={`text-center fs-5 ${textClass}`}>
              Missing booking information. Please start your booking again.
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
      <div className="payment-overlay"></div>

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className="text-center mb-4" style={gradientText}>
            Complete Your Payment
          </h2>

          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-4">
              <div className={`${cardClass} p-4 rounded-4 shadow mb-3`}>
                <h4 className={`mb-3 ${textClass}`}>Scan & Pay via UPI</h4>
                <img
                  src={upiImage}
                  alt="Scan UPI QR"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                />
                <p className={`mt-3 ${textClass}`}>
                  Once paid, your ticket will be confirmed.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className={`${cardClass} p-4 rounded-4 shadow`}>
                <h4 className="mb-3" style={gradientText}>
                  Booking Summary
                </h4>

                <div className="mb-3">
                  <p className={`${textClass}`}>
                    <strong>Bus:</strong> {bus.name}
                  </p>
                  <p className={`${textClass}`}>
                    <strong>Route:</strong> {places.sourceName || bus.source} →{" "}
                      {places.destinationName || bus.destination}
                  </p>
                  <p className={`${textClass}`}>
                    <strong>Date of Journey:</strong> {bus.doj?.slice(0, 10)}
                  </p>
                  <p className={`${textClass}`}>
                    <strong>Departure Time:</strong> {bus.departureTime}
                  </p>
                </div>

                <div className="mb-3">
                  <p className={`${textClass}`}>
                    <strong>Fare per Seat:</strong> ₹
                    {Math.round(bus.baseFare * bus.fareMultiplier)}
                  </p>
                  <p className={`${textClass}`}>
                    <strong>Total Fare:</strong> ₹{totalFare}
                  </p>
                </div>

                <div className="mb-3">
                  <h5 style={gradientText}>Passengers</h5>
                  <ul className="list-group">
                    {passengers.map((p, i) => (
                      <li
                        key={i}
                        className={`list-group-item ${listItemClass} mb-2 rounded-3`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{p.name}</span>
                          <span className="badge bg-primary rounded-pill">
                            Seat {p.seat}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center mt-4">
                  <button
                    className="btn w-100 py-2"
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
                    onClick={handleBook}
                  >
                    Confirm & Book Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
