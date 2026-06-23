import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaTicketAlt,
  FaCalendarDay,
  FaUser,
  FaRupeeSign,
  FaChair,
  FaMapMarkedAlt,
  FaTimes,
  FaHotel,
  FaBed,
  FaUsers,
  FaDoorOpen,
  FaCalendarCheck,
  FaCalendarTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Tickets(props) {
  const [bookingTab, setBookingTab] = useState("bus");
  const [bookings, setBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
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

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (props.loadingRef?.current) {
        props.loadingRef.current.continuousStart();
      }

      // Fetch bookings first
      const response = await axios.get(props.fetchBooking, {
        headers: {
          "auth-token": token,
        },
      });
      const bookingsData = response.data.bookings;
      setBookings(bookingsData);

      if (props.loadingRef?.current) {
        props.loadingRef.current.complete();
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      props.showAlert("Failed to load bookings", "danger");

      if (props.loadingRef?.current) {
        props.loadingRef.current.complete();
      }
    }
  };
  const fetchHotelBookings = async () => {
    try {
      const res = await fetch(props.fetchHotelBookingsEndpoint, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        setHotelBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "warning");
      return;
    }

    fetchBookings();
    fetchHotelBookings();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedSeats([]);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setBookingToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async (cancelAll = false) => {
    if (!selectedBooking) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(props.deleteselectedseat, {
        data: {
          bookingId: selectedBooking._id,
          seatIds: selectedSeats,
          cancelAll,
        },
        headers: {
          "auth-token": token,
        },
      });

      if (response.data.success) {
        props.showAlert(response.data.message, "success");

        if (response.data.deleted) {
          setBookings((prev) =>
            prev.filter((b) => b._id !== selectedBooking._id),
          );
        } else {
          setBookings((prev) =>
            prev.map((b) =>
              b._id === selectedBooking._id ? response.data.updatedBooking : b,
            ),
          );
        }
      }
    } catch (err) {
      props.showAlert("Something went wrong", "danger");
    } finally {
      closeDeleteModal();
    }
  };

  const cancelHotelBooking = async (bookingId) => {
    try {
      const res = await fetch(props.cancelHotelBookingEndpoint, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",

          "auth-token": localStorage.getItem("token"),
        },

        body: JSON.stringify({
          bookingId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Hotel booking cancelled", "success");

        fetchHotelBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSeatSelection = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="tickets-overlay"></div>

      {/* Simple Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content rounded-3"
            style={{
              width: "90%",
              maxWidth: "500px",
              padding: "25px",
              backgroundColor: props.darkMode ? "#2a2a2a" : "white",
              border: props.darkMode ? "1px solid #444" : "1px solid #ddd",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5
                className="mb-0"
                style={{ color: props.darkMode ? "white" : "#333" }}
              >
                Confirm Cancellation
              </h5>
              <button
                type="button"
                className="btn p-0"
                onClick={closeDeleteModal}
                style={{ color: props.darkMode ? "#aaa" : "#777" }}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-3">
              <h6>Select Passengers to Cancel</h6>

              {selectedBooking?.seats.map((seat) => (
                <div key={seat._id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedSeats.includes(seat._id)}
                    onChange={() => toggleSeatSelection(seat._id)}
                  />
                  <label className="form-check-label">
                    {seat.passenger} — Seat {seat.seatNumber}
                  </label>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-danger"
                onClick={() => confirmDelete(true)}
              >
                Cancel Entire Ticket
              </button>

              <div>
                <button className="btn me-2" onClick={closeDeleteModal}>
                  Close
                </button>

                <button
                  className="btn btn-warning"
                  disabled={selectedSeats.length === 0}
                  onClick={() => confirmDelete(false)}
                >
                  Cancel Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className="text-center mb-4" style={gradientText}>
            Your Travel Tickets
          </h2>
          <div
            style={{
              position: "relative",
              display: "flex",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto 35px auto",
              background: props.darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(15px)",
              borderRadius: "50px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: bookingTab === "bus" ? "0%" : "50%",
                width: "50%",
                height: "100%",
                background: "linear-gradient(135deg,#3a7bd5,#00d2ff)",
                borderRadius: "50px",
                transition: "all .35s ease",
              }}
            />

            <button
              onClick={() => setBookingTab("bus")}
              style={{
                flex: 1,
                height: "60px",
                border: "none",
                background: "transparent",
                position: "relative",
                zIndex: 2,
                color: bookingTab === "bus" ? "white" : "#3a7bd5",
                fontWeight: "600",
              }}
            >
              Bus Bookings
            </button>

            <button
              onClick={() => setBookingTab("hotel")}
              style={{
                flex: 1,
                height: "60px",
                border: "none",
                background: "transparent",
                position: "relative",
                zIndex: 2,
                color: bookingTab === "hotel" ? "white" : "#3a7bd5",
                fontWeight: "600",
              }}
            >
              Hotel Bookings
            </button>
          </div>

          {bookingTab === "bus" ? (
            bookings.length === 0 ? (
              <div className={`${cardClass} p-4 rounded-4 shadow text-center`}>
                <h4 style={gradientText}>No Bus Bookings</h4>
              </div>
            ) : (
              <div className="row gy-4">
                {bookings.map((booking, index) => {
                  const bus = booking.bus || {};
                  return (
                    <div
                      key={booking._id || index}
                      className="col-md-6 col-lg-4"
                    >
                      <div className={`card shadow-lg border-0 ${cardClass}`}>
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0" style={gradientText}>
                              <FaTicketAlt className="me-2 text-info" />
                              {bus.name || "Bus Ticket"}
                            </h5>
                            <span className="badge bg-success rounded-pill px-3">
                              Confirmed
                            </span>
                          </div>

                          <div className="d-flex align-items-center mb-2">
                            <FaMapMarkedAlt className="me-3" />
                            <div>
                              <small className={`${textClass}`}>Route</small>
                              <p className="mb-0">
                                {booking.source?.name} →{" "}
                                {booking.destination?.name}
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-center mb-2">
                            <FaBus className="me-3" />
                            <div>
                              <small className={`${textClass}`}>Bus Type</small>
                              <p className="mb-0">
                                {bus.busType || "Standard"}
                              </p>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-6">
                              <div className="d-flex align-items-center mb-2">
                                <FaChair className="me-3" />
                                <div>
                                  <small className={`${textClass}`}>Seat</small>
                                  <p className="mb-0">
                                    {booking.seats
                                      ?.map((s) => s.seatNumber)
                                      .join(", ") || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center mb-2">
                                <FaRupeeSign className="me-3" />
                                <div>
                                  <small className={`${textClass}`}>Fare</small>
                                  <p className="mb-0">
                                    ₹{booking.totalFare || "0"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center mb-2">
                            <FaCalendarDay className="me-3" />
                            <div>
                              <small className={`${textClass}`}>
                                Date & Time
                              </small>
                              <p className="mb-0">
                                {formatDate(booking.doj)} |{" "}
                                {bus.departureTime || "00:00"}
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-center mb-3">
                            <FaUser className="me-3" />
                            <div>
                              <small className={`${textClass}`}>
                                Passenger
                              </small>
                              <p className="mb-0">
                                {booking.seats
                                  ?.map((s) => s.passenger)
                                  .join(", ") || "You"}
                              </p>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between mt-3">
                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                navigate(`/ticket-details/${booking._id}`, {
                                  state: booking,
                                })
                              }
                              style={{
                                background: props.darkMode
                                  ? "#2c3e50"
                                  : "#e9ecef",
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
                              onClick={() => openDeleteModal(booking)}
                              style={{
                                backgroundColor: "#dc3545",
                                border: "none",
                                fontWeight: "500",
                                color: "white",
                                padding: "5px 15px",
                              }}
                            >
                              Cancel Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : hotelBookings.length === 0 ? (
            <div className={`${cardClass} p-4 rounded-4 shadow text-center`}>
              <h4 style={gradientText}>No Hotel Bookings</h4>
              <button
                className="btn mt-3"
                onClick={() => navigate("/searchhotel")}
              >
                Find Hotels
              </button>
            </div>
          ) : (
            <div className="row gy-4">
              {hotelBookings.map((booking) => (
                <div key={booking._id} className="col-md-6 col-lg-4">
                  <div className={`card shadow-lg border-0 ${cardClass}`}>
                    <img
                      src={
                        booking.hotel?.hotelImages?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                      }
                      alt=""
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          <FaHotel
                            style={{
                              marginRight: "8px"
                            }}
                          />
                          {booking.hotel?.name}
                        </span>

                        <span
                          style={{
                            fontSize: "0.9rem",
                            opacity: 0.8,
                          }}
                        >
                          <FaMapMarkerAlt
                            style={{
                              marginRight: "6px"
                            }}
                          />
                          {booking.hotel?.address}
                        </span>
                      </div>

                      <p>
                        <FaBed
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        Room Type: {booking.roomType}
                      </p>

                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          marginBottom: "12px",
                        }}
                      >
                        <span>
                          <FaUsers
                            style={{
                              marginRight: "8px",
                            }}
                          />
                          Guests: {booking.guests}
                        </span>

                        <span>
                          <FaDoorOpen
                            style={{
                              marginRight: "8px",
                            }}
                          />
                          Rooms: {booking.roomsBooked}
                        </span>
                      </div>

                      <p>
                        <FaCalendarCheck
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        Check In:{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </p>

                      <p>
                        <FaCalendarTimes
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        Check Out:{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>

                      <h5
                        style={{
                          color: "#3a7bd5",
                          fontWeight: "700",
                        }}
                      >
                        <FaRupeeSign
                          style={{
                            marginRight: "4px",
                          }}
                        />
                        {booking.totalAmount}
                      </h5>

                      <button
                        className="btn btn-danger w-100"
                        onClick={() => cancelHotelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
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
