import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaTicketAlt, FaCalendarDay, FaUser, FaRupeeSign, FaChair } from "react-icons/fa";

export default function Tickets(props) {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "warning");
      navigate("/login");
      return;
    }
    

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (props.loadingRef?.current) {
          props.loadingRef.current.continuousStart();
        }

        const response = await axios.get(props.fetchBooking, {
          headers: {
            "auth-token": token,
          }
        });

        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }

        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        props.showAlert("Failed to load bookings", "danger");

        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }
      }
    };

    fetchBookings();
  }, [navigate, props]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="tickets-overlay"></div>
      
      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className="text-center mb-4" style={gradientText}>
            Your Travel Tickets
          </h2>

          {bookings.length === 0 ? (
            <div className={`${cardClass} p-4 rounded-4 shadow text-center`}>
              <h4 className="mb-3" style={gradientText}>No Bookings Found</h4>
              <p className={`${textClass}`}>
                You haven't made any bookings yet. Start your journey today!
              </p>
              <button
                className="btn mt-3"
                style={{
                  background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none",
                  fontWeight: "600",
                  color: "white",
                  padding: "8px 24px",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => navigate("/searchbus")}
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="row gy-4">
              {bookings.map((booking, index) => (
                <div key={booking._id || index} className="col-md-6 col-lg-4">
                  <div className={`card shadow-lg border-0 ${cardClass}`}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0" style={gradientText}>
                          {booking.bus?.name || "Bus Ticket"}
                        </h5>
                        <span className="badge bg-success rounded-pill px-3">
                          Confirmed
                        </span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <FaBus className="me-3" />
                        <div>
                          <small className={`${textClass}`}>Bus</small>
                          <p className="mb-0">{booking.bus?.busType || "Standard"}</p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarDay className="me-3" />
                        <div>
                          <small className={`${textClass}`}>Date & Time</small>
                          <p className="mb-0">{formatDate(booking.doj)}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <div className="d-flex align-items-center mb-2">
                            <FaChair className="me-3" />
                            <div>
                              <small className={`${textClass}`}>Seat</small>
                              <p className="mb-0">{booking.seatnumber || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center mb-2">
                            <FaRupeeSign className="me-3" />
                            <div>
                              <small className={`${textClass}`}>Fare</small>
                              <p className="mb-0">₹{booking.fare || "0"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <FaUser className="me-3" />
                        <div>
                          <small className={`${textClass}`}>Passenger</small>
                          <p className="mb-0">{booking.passenger || "You"}</p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-sm"
                          style={{
                            background: props.darkMode ? "#2c3e50" : "#e9ecef",
                            border: "none",
                            fontWeight: "500",
                            color: props.darkMode ? "white" : "black",
                            padding: "5px 15px",
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                            border: "none",
                            fontWeight: "500",
                            color: "white",
                            padding: "5px 15px",
                          }}
                        >
                          Download Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}