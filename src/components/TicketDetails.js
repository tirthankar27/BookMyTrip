import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaDownload,
  FaTrash,
} from "react-icons/fa";

export default function TicketDetails(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const ticketRef = useRef();

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h3>No Ticket Found</h3>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ---------------- PDF GENERATION ---------------- */

  const handleDownload = async () => {
    setIsGeneratingPDF(true);

    setTimeout(() => {
      const element = ticketRef.current;

      const options = {
        margin: 0.3,
        filename: `BoardingPass-${booking._id}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(options).from(element).save().then(() => {
        setIsGeneratingPDF(false);
      });
    }, 300);
  };

  /* ---------------- CANCEL SEAT ---------------- */

  const handleCancelSeat = async (seatId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "/api/booking/cancel-seat",
        {
          data: {
            bookingId: booking._id,
            seatId,
          },
          headers: { "auth-token": token },
        }
      );

      if (response.data.success) {
        const updatedSeats = booking.seats.filter(
          (seat) => seat._id !== seatId
        );

        if (updatedSeats.length === 0) {
          navigate("/tickets");
        } else {
          setBooking({
            ...booking,
            seats: updatedSeats,
            totalFare: updatedSeats.reduce(
              (sum, seat) => sum + seat.fare,
              0
            ),
          });
        }
      }
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  return (
    <div className="container py-5">

      {/* ACTION HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ticket Details</h2>
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={isGeneratingPDF}
        >
          <FaDownload className="me-2" />
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </button>
      </div>

      {/* PREMIUM PDF LAYOUT */}
      <div ref={ticketRef}
        style={{
          background: "white",
          padding: "50px",
          borderRadius: "16px",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >

        {/* WATERMARK */}
        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          fontSize: "100px",
          color: "rgba(58, 123, 213, 0.08)",
          fontWeight: "bold",
          pointerEvents: "none",
          whiteSpace: "nowrap"
        }}>
          BookMyTrip
        </div>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #3a7bd5",
          paddingBottom: "15px",
          marginBottom: "30px"
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#3a7bd5" }}>BookMyTrip</h1>
            <small style={{ color: "#666" }}>
              Travel Boarding Pass
            </small>
          </div>

          <div style={{ textAlign: "right" }}>
            <h3 style={{ margin: 0 }}>{booking.bus?.name}</h3>
            <small>Booking ID: {booking._id}</small>
          </div>
        </div>

        {/* PER SEAT BOARDING PASS */}
        {booking.seats.map((seat, index) => (
          <div key={seat._id}
            style={{
              display: "flex",
              marginBottom: "40px",
              border: "2px solid #3a7bd5",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
          >

            {/* LEFT STUB */}
            <div style={{
              background: "linear-gradient(135deg, #3a7bd5, #00d2ff)",
              color: "white",
              padding: "25px",
              width: "25%",
              textAlign: "center",
              position: "relative"
            }}>
              <h2 style={{ margin: "10px 0" }}>SEAT</h2>
              <h1 style={{
                fontSize: "3.5rem",
                margin: "0",
                fontWeight: "bold"
              }}>
                {seat.seatNumber}
              </h1>

              <div style={{ marginTop: "20px", fontSize: "14px" }}>
                Passenger
                <br />
                <strong>{seat.passenger}</strong>
              </div>

              {/* Tear Line */}
              <div style={{
                position: "absolute",
                right: "-1px",
                top: 0,
                bottom: 0,
                borderRight: "3px dashed white"
              }} />
            </div>

            {/* RIGHT BODY */}
            <div style={{
              padding: "30px",
              width: "75%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p><strong>Route:</strong> {booking.source?.name} → {booking.destination?.name}</p>
                <p><strong>Date:</strong> {formatDate(booking.doj)}</p>
                <p><strong>Departure:</strong> {booking.bus?.departureTime}</p>
                <p><strong>Fare:</strong> ₹{seat.fare}</p>
              </div>

              <QRCodeCanvas
                value={`BOOKING:${booking._id}-SEAT:${seat.seatNumber}`}
                size={120}
              />
            </div>
          </div>
        ))}

        {/* TOTAL SECTION */}
        <div style={{
          textAlign: "right",
          marginTop: "20px"
        }}>
          <h2 style={{ color: "#3a7bd5" }}>
            Total Paid: ₹{booking.totalFare}
          </h2>
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop: "60px",
          fontSize: "12px",
          textAlign: "center",
          color: "#555"
        }}>
          This is a digitally generated boarding pass.
          Please carry valid ID proof while travelling.
          <br />
          © 2025 BookMyTrip. All Rights Reserved.
        </div>

      </div>
    </div>
  );
}