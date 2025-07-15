import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import upiImage from "../assets/UPI.jpg";

export default function Payment(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, passengers, totalFare } = location.state || {};

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
      navigate("/", { state: { bus, passengers, totalFare } });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
        Scan & Pay via UPI
      </h2>

      <img
        src={upiImage}
        alt="Scan UPI QR"
        style={{
          width: "300px",
          maxWidth: "90%",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      />

      <p style={{ marginTop: "1rem", color: "#555" }}>
        Once paid, your ticket will be confirmed.
      </p>

      {/* DETAILS */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "2rem",
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "1rem", color: "#444" }}>Booking Summary</h4>
        <p>
          <strong>Bus:</strong> {bus?.name}
        </p>
        <p>
          <strong>Date of Journey:</strong> {bus?.doj?.slice(0, 10)}
        </p>
        <p>
          <strong>Fare per Seat:</strong> ₹
          {Math.round(bus.baseFare * bus.fareMultiplier)}
        </p>
        <p>
          <strong>Total Fare:</strong> ₹{totalFare}
        </p>

        <div style={{ marginTop: "1rem" }}>
          <h5 style={{ marginBottom: "0.5rem" }}>Passengers:</h5>
          <ul>
            {passengers?.map((p, i) => (
              <li key={i}>
                {p.name} (Seat {p.seat})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBook}
        style={{
          marginTop: "2rem",
          backgroundColor: "#3a7bd5",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Book Ticket
      </button>
    </div>
  );
}
