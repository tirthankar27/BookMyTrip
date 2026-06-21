import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaHotel,
  FaUsers,
} from "react-icons/fa";

const HotelResults = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hotels = location.state?.hotels || [];
  const destination =
    location.state?.destination || "";

  const checkIn =
    location.state?.checkIn || "";

  const checkOut =
    location.state?.checkOut || "";

  const guests =
    location.state?.guests || 1;

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  return (
    <div className="container py-5">
      {/* Header */}

      <div className="mb-5">
        <h1
          style={{
            fontWeight: "700",
            color: props.darkMode
              ? "#fff"
              : "#111827",
          }}
        >
          Available Hotels
        </h1>

        <p
          style={{
            color: props.darkMode
              ? "rgba(255,255,255,.7)"
              : "#6b7280",
          }}
        >
          {destination} • {guests} Guests
        </p>

        <div
          style={{
            width: "100px",
            height: "4px",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg,#3a7bd5,#00d2ff)",
          }}
        />
      </div>

      {/* No Hotels */}

      {hotels.length === 0 && (
        <div
          className={`${containerClass} p-5 rounded-5 text-center`}
        >
          <FaHotel
            size={60}
            style={{
              color: "#3a7bd5",
              marginBottom: "20px",
            }}
          />

          <h3>No Hotels Found</h3>

          <p>
            Try another destination.
          </p>
        </div>
      )}

      {/* Hotels */}

      <div className="row">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="col-lg-6 mb-4"
          >
            <div
              className={`${containerClass} h-100 p-4 rounded-5 shadow`}
            >
              {/* Hotel Image */}

              <img
                src={
                  hotel.hotelImages?.[0] ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                }
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />

              {/* Hotel Info */}

              <div className="mt-4">
                <h3
                  style={{
                    color: props.darkMode
                      ? "#fff"
                      : "#111827",
                  }}
                >
                  {hotel.name}
                </h3>

                <p
                  style={{
                    color: props.darkMode
                      ? "rgba(255,255,255,.7)"
                      : "#6b7280",
                  }}
                >
                  <FaMapMarkerAlt
                    style={{
                      marginRight: "8px",
                    }}
                  />

                  {hotel.destination?.name}
                </p>

                <p
                  style={{
                    color: props.darkMode
                      ? "rgba(255,255,255,.8)"
                      : "#374151",
                  }}
                >
                  {hotel.address}
                </p>

                <p
                  style={{
                    color: props.darkMode
                      ? "rgba(255,255,255,.8)"
                      : "#374151",
                  }}
                >
                  {hotel.description}
                </p>

                {/* Amenities */}

                <div className="mb-3">
                  {hotel.hotelAmenities
                    ?.slice(0, 4)
                    .map((amenity, idx) => (
                      <span
                        key={idx}
                        className="badge me-2 mb-2"
                        style={{
                          background:
                            "linear-gradient(135deg,#3a7bd5,#00d2ff)",
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                </div>

                {/* Room Types */}

                <div className="mb-4">
                  <h5>Room Types</h5>

                  {hotel.roomTypes?.map(
                    (room, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                      >
                        <div>
                          <strong>
                            {room.type}
                          </strong>

                          <div
                            style={{
                              fontSize:
                                ".9rem",
                            }}
                          >
                            {
                              room.totalRooms
                            }{" "}
                            rooms
                          </div>
                        </div>

                        <div
                          style={{
                            fontWeight:
                              "700",
                            color:
                              "#3a7bd5",
                          }}
                        >
                          ₹
                          {
                            room.pricePerNight
                          }
                          /night
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Dates */}

                <div
                  className="mb-3"
                  style={{
                    color: props.darkMode
                      ? "rgba(255,255,255,.7)"
                      : "#6b7280",
                  }}
                >
                  Check In: {checkIn}
                  <br />
                  Check Out: {checkOut}
                  <br />
                  <FaUsers
                    style={{
                      marginRight: "8px",
                    }}
                  />
                  {guests} Guests
                </div>

                {/* Button */}

                <button
                  className="btn w-100"
                  style={{
                    background:
                      "linear-gradient(135deg,#3a7bd5,#00d2ff)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    borderRadius: "14px",
                  }}
                  onClick={() =>
                    navigate(
                      `/hotel/${hotel._id}`,
                      {
                        state: {
                          hotel,
                          checkIn,
                          checkOut,
                          guests,
                        },
                      }
                    )
                  }
                >
                  View Hotel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelResults;