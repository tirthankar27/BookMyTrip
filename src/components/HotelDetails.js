import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaWifi,
  FaBed,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";

const HotelDetails = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;

  const checkIn =
    location.state?.checkIn;

  const checkOut =
    location.state?.checkOut;

  const guests =
    location.state?.guests;

  const [selectedRoom, setSelectedRoom] =
    useState(
      hotel?.roomTypes?.[0]?.type || ""
    );

  if (!hotel) {
    return (
      <div className="container py-5">
        Hotel not found
      </div>
    );
  }

  const room =
    hotel.roomTypes.find(
      (r) => r.type === selectedRoom
    ) || hotel.roomTypes[0];

  const nights =
    Math.ceil(
      (new Date(checkOut) -
        new Date(checkIn)) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const roomsNeeded =
    Math.ceil(guests / 2);

  const totalPrice =
    room.pricePerNight *
    roomsNeeded *
    nights;

  const handleBooking = async () => {
    try {
      const res = await fetch(
        props.hotelBookingEndpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",

            "auth-token":
              localStorage.getItem(
                "token"
              ),
          },

          body: JSON.stringify({
            hotelId: hotel._id,
            roomType: room.type,
            guests,
            checkIn,
            checkOut,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        props.showAlert(
          "Hotel booked successfully",
          "success"
        );

        navigate("/tickets");
      } else {
        props.showAlert(
          data.message,
          "danger"
        );
      }
    } catch (err) {
      console.error(err);

      props.showAlert(
        "Booking failed",
        "danger"
      );
    }
  };

  return (
    <div className="container py-5">
      {/* Hero Image */}

      <img
        src={
          hotel.hotelImages?.[0]
        }
        alt={hotel.name}
        style={{
          width: "100%",
          height: "450px",
          objectFit: "cover",
          borderRadius: "25px",
        }}
      />

      <div className="mt-4">
        <h1>{hotel.name}</h1>

        <p>
          <FaMapMarkerAlt />{" "}
          {hotel.destination?.name}
        </p>

        <p>{hotel.address}</p>

        <p>{hotel.description}</p>
      </div>

      {/* Amenities */}

      <div className="mt-4">
        <h3>Amenities</h3>

        <div className="d-flex flex-wrap gap-2">
          {hotel.hotelAmenities.map(
            (item, index) => (
              <span
                key={index}
                className="badge"
                style={{
                  background:
                    "linear-gradient(135deg,#3a7bd5,#00d2ff)",
                }}
              >
                <FaWifi
                  style={{
                    marginRight: "5px",
                  }}
                />

                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Room Types */}

      <div className="mt-5">
        <h3>Choose Room</h3>

        <div className="row">
          {hotel.roomTypes.map(
            (roomType, index) => (
              <div
                key={index}
                className="col-md-4 mb-3"
              >
                <div
                  onClick={() =>
                    setSelectedRoom(
                      roomType.type
                    )
                  }
                  style={{
                    cursor: "pointer",
                    padding: "20px",
                    borderRadius:
                      "20px",

                    border:
                      selectedRoom ===
                      roomType.type
                        ? "2px solid #3a7bd5"
                        : "1px solid rgba(255,255,255,.2)",
                  }}
                >
                  <h5>
                    {roomType.type}
                  </h5>

                  <p>
                    ₹
                    {
                      roomType.pricePerNight
                    }
                    /night
                  </p>

                  <p>
                    {
                      roomType.totalRooms
                    }{" "}
                    rooms
                  </p>

                  <p>
                    {
                      roomType.description
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Booking Summary */}

      <div
        className="mt-5 p-4 rounded-4"
        style={{
          background:
            "rgba(58,123,213,.08)",
        }}
      >
        <h3>Booking Summary</h3>

        <p>
          <FaBed /> Room Type:{" "}
          {room.type}
        </p>

        <p>
          <FaUsers /> Guests:{" "}
          {guests}
        </p>

        <p>
          Check In: {checkIn}
        </p>

        <p>
          Check Out: {checkOut}
        </p>

        <p>
          Nights: {nights}
        </p>

        <p>
          Rooms Required:{" "}
          {roomsNeeded}
        </p>

        <h2
          style={{
            color: "#3a7bd5",
          }}
        >
          ₹{totalPrice}
        </h2>

        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleBooking}
        >
          <FaPaperPlane
            style={{
              marginRight: "10px",
            }}
          />
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default HotelDetails;