import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const RegisterHotel = (props) => {
  const [places, setPlaces] = useState([]);

  const [form, setForm] = useState({
    name: "",
    destination: "",
    address: "",
    description: "",
    hotelAmenities: "",
    hotelImages: "",
    roomTypes: [
      {
        type: "",
        description: "",
        pricePerNight: "",
        totalRooms: "",
        amenities: "",
        images: "",
      },
    ],
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await fetch(props.placesendpoint);
      const data = await res.json();

      if (data.success) {
        setPlaces(data.places);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addRoomType = () => {
    setForm({
      ...form,
      roomTypes: [
        ...form.roomTypes,
        {
          type: "",
          description: "",
          pricePerNight: "",
          totalRooms: "",
          amenities: "",
          images: "",
        },
      ],
    });
  };

  const removeRoomType = (index) => {
    setForm({
      ...form,
      roomTypes: form.roomTypes.filter((_, i) => i !== index),
    });
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...form.roomTypes];

    updated[index][field] = value;

    setForm({
      ...form,
      roomTypes: updated,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(props.hotelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: form.name,
          destination: form.destination,
          address: form.address,
          description: form.description,

          hotelAmenities: form.hotelAmenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          hotelImages: form.hotelImages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          roomTypes: form.roomTypes.map((room) => ({
            type: room.type,

            description: room.description,

            pricePerNight: Number(room.pricePerNight),

            totalRooms: Number(room.totalRooms),

            amenities: room.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),

            images: room.images
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Hotel submitted for approval!", "success");

        setForm({
          name: "",
          destination: "",
          address: "",
          description: "",

          hotelAmenities: "",
          hotelImages: "",

          roomTypes: [
            {
              type: "",
              description: "",
              pricePerNight: "",
              totalRooms: "",
              amenities: "",
              images: "",
            },
          ],
        });
      } else {
        props.showAlert(data.message || "Failed to submit hotel", "danger");
      }
    } catch (err) {
      console.error(err);
      props.showAlert("Network or server error", "danger");
    }
  };

  const inputClass = props.darkMode
    ? "form-control glass-dark"
    : "form-control glass-light";

  return (
    <>
      <div className="mb-4">
        <h2
          style={{
            color: props.darkMode ? "#fff" : "#111827",
            fontWeight: "700",
            fontSize: "2rem",
          }}
        >
          Register Hotel
        </h2>

        <p
          style={{
            color: props.darkMode ? "rgba(255,255,255,.7)" : "#6b7280",
            marginBottom: "20px",
          }}
        >
          Add hotels and room categories for bookings and package bundling
        </p>

        <div
          style={{
            width: "100px",
            height: "4px",
            borderRadius: "20px",
            background: "linear-gradient(135deg,#3a7bd5,#00d2ff)",
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Hotel Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Royal Palace Hotel"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Destination</label>

            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Destination</option>

              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className={inputClass}
            placeholder="MG Road, Gangtok"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>

          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputClass}
            placeholder="Describe the hotel..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hotel Amenities</label>

          <textarea
            rows="3"
            name="hotelAmenities"
            value={form.hotelAmenities}
            onChange={handleChange}
            className={inputClass}
            placeholder="WiFi, Pool, Restaurant, Parking"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Hotel Images</label>

          <textarea
            rows="3"
            name="hotelImages"
            value={form.hotelImages}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://img1.jpg, https://img2.jpg"
          />
        </div>

        <hr className="my-4" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Room Types</h4>

          <button
            type="button"
            className="btn btn-primary"
            onClick={addRoomType}
          >
            + Add Room Type
          </button>
        </div>

        {form.roomTypes.map((room, index) => (
          <div
            key={index}
            className={`rounded-4 p-4 mb-4 ${
              props.darkMode ? "glass-container-dark" : "glass-container-light"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Room Type {index + 1}</h5>

              {form.roomTypes.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeRoomType(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Room Type</label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="Deluxe"
                  value={room.type}
                  onChange={(e) =>
                    handleRoomChange(index, "type", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Price Per Night</label>

                <input
                  type="number"
                  className={inputClass}
                  placeholder="3500"
                  value={room.pricePerNight}
                  onChange={(e) =>
                    handleRoomChange(index, "pricePerNight", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>

              <textarea
                rows="3"
                className={inputClass}
                value={room.description}
                onChange={(e) =>
                  handleRoomChange(index, "description", e.target.value)
                }
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Total Rooms</label>

                <input
                  type="number"
                  className={inputClass}
                  placeholder="20"
                  value={room.totalRooms}
                  onChange={(e) =>
                    handleRoomChange(index, "totalRooms", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Amenities</label>

                <input
                  type="text"
                  className={inputClass}
                  placeholder="AC, TV, Balcony"
                  value={room.amenities}
                  onChange={(e) =>
                    handleRoomChange(index, "amenities", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="form-label">Room Images</label>

              <textarea
                rows="2"
                className={inputClass}
                placeholder="https://room1.jpg, https://room2.jpg"
                value={room.images}
                onChange={(e) =>
                  handleRoomChange(index, "images", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn py-3"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              border: "none",
              width: "260px",
              margin: "0 auto",
              fontWeight: "700",
              fontSize: "1.2rem",
              color: "white",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
            }}
          >
            <FaPaperPlane
              style={{
                marginRight: "10px",
              }}
            />
            Register Hotel
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterHotel;
