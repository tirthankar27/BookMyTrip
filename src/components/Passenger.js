import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Passenger(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus || {};

  const [numPassengers, setNumPassengers] = useState(1);
  const [passengerNames, setPassengerNames] = useState([""]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Dark mode classes
  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";
  const textClass = props.darkMode ? "text-white" : "text-dark";
  const cardClass = props.darkMode
    ? "glass-dark text-white"
    : "glass-light text-dark";
  const inputClass = props.darkMode
    ? "bg-dark text-white border-secondary"
    : "bg-white text-dark";

  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  useEffect(() => {
    console.log("Bus object received:", bus);
    if (!bus || !bus._id) return;

    axios
      .post(props.seatsendpoint, {
        busId: bus._id,
        doj: bus.doj,
      })
      .then((res) => setAvailableSeats(res.data.seats || []))
      .catch((err) => console.error("Failed to fetch seats", err));
  }, [bus]);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
    } else if (selectedSeats.length < numPassengers) {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const handlePassengerNameChange = (index, value) => {
    const updated = [...passengerNames];
    updated[index] = value;
    setPassengerNames(updated);
  };

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count > 0 && count <= 10) {
      setNumPassengers(count);
      setPassengerNames(
        Array.from({ length: count }, (_, i) => passengerNames[i] || "")
      );
      setSelectedSeats([]);
    }
  };

  const seatBoxStyle = (seat) => ({
    width: "40px",
    height: "40px",
    margin: "5px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: availableSeats.includes(seat) ? "pointer" : "not-allowed",
    backgroundColor: selectedSeats.includes(seat)
      ? "#3a7bd5"
      : availableSeats.includes(seat)
      ? props.darkMode
        ? "#2c3e50"
        : "#e2e6ea"
      : props.darkMode
      ? "#495057"
      : "#ccc",
    color: selectedSeats.includes(seat)
      ? "white"
      : props.darkMode
      ? "white"
      : "black",
    border: selectedSeats.includes(seat)
      ? "1px solid #3a7bd5"
      : props.darkMode
      ? "1px solid #495057"
      : "1px solid #999",
    transition: "all 0.2s ease",
  });

  const handleProceed = () => {
    if (selectedSeats.length === numPassengers) {
      navigate("/payment", {
        state: {
          bus,
          passengers: passengerNames.map((name, i) => ({
            name,
            seat: selectedSeats[i],
          })),
          totalFare: Math.round(
            bus.baseFare * bus.fareMultiplier * numPassengers
          ),
        },
      });
    }
  };

  if (!bus) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div className="passenger-overlay"></div>
        <div className="container py-5">
          <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
            <h2 className="text-center mb-4" style={gradientText}>
              No Bus Selected
            </h2>
            <p className={`text-center fs-5 ${textClass}`}>
              Please go back and choose a bus first.
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
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="passenger-overlay"></div>

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className="mb-4 text-center" style={gradientText}>
            Passenger Details for <strong>{bus.name}</strong>
          </h2>

          <div className={`${cardClass} p-4 mb-4 rounded-4 shadow`}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    className={`form-control ${inputClass}`}
                    min="1"
                    max="10"
                    value={numPassengers}
                    onChange={handlePassengerCountChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>
                    Total Fare
                  </label>
                  <input
                    type="text"
                    className={`form-control ${inputClass}`}
                    value={`₹${Math.round(
                      bus.baseFare * bus.fareMultiplier * numPassengers
                    )}`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-4 mb-4 rounded-4 shadow`}>
            <h4 className="mb-3" style={gradientText}>
              Passenger Information
            </h4>
            {passengerNames.map((name, index) => (
              <div className="mb-3" key={index}>
                <label className={`form-label ${textClass}`}>
                  Passenger {index + 1} Name
                </label>
                <input
                  type="text"
                  className={`form-control ${inputClass}`}
                  value={name}
                  onChange={(e) =>
                    handlePassengerNameChange(index, e.target.value)
                  }
                  placeholder={`Enter passenger ${index + 1} name`}
                />
              </div>
            ))}
          </div>

          <div className={`${cardClass} p-4 mb-4 rounded-4 shadow`}>
            <h4 className="mb-3" style={gradientText}>
              Select Seats
            </h4>
            <p className={`${textClass}`}>
              Available seats: {availableSeats.length} | Selected:{" "}
              {selectedSeats.length}/{numPassengers}
            </p>
            <div className="d-flex flex-wrap mb-3">
              {[...Array(bus.totalSeats || 40).keys()].map((i) => {
                const seatNumber = i + 1;
                return (
                  <div
                    key={seatNumber}
                    style={seatBoxStyle(seatNumber)}
                    onClick={() =>
                      availableSeats.includes(seatNumber) &&
                      handleSeatClick(seatNumber)
                    }
                    onMouseEnter={(e) => {
                      if (
                        availableSeats.includes(seatNumber) &&
                        !selectedSeats.includes(seatNumber)
                      ) {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow =
                          "0 0 8px rgba(58, 123, 213, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        availableSeats.includes(seatNumber) &&
                        !selectedSeats.includes(seatNumber)
                      ) {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {seatNumber}
                  </div>
                );
              })}
            </div>
            {selectedSeats.length > 0 && (
              <p className={`${textClass}`}>
                Selected seats: {selectedSeats.sort((a, b) => a - b).join(", ")}
              </p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn py-2 px-4"
              style={{
                background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                border: "none",
                fontWeight: "600",
                color: "white",
                transition: "transform 0.2s ease",
                opacity: selectedSeats.length === numPassengers ? 1 : 0.7,
              }}
              onMouseEnter={(e) =>
                selectedSeats.length === numPassengers &&
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={handleProceed}
              disabled={selectedSeats.length !== numPassengers}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
