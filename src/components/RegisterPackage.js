import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const RegisterPackage = (props) => {
  const [places, setPlaces] = useState([]);

  const [form, setForm] = useState({
    title: "",
    destination: "",
    duration: "",
    price: "",
    description: "",
    inclusions: "",
    exclusions: "",
    image: "",
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(props.packageEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          inclusions: form.inclusions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          exclusions: form.exclusions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Package submitted for approval!", "success");

        setForm({
          title: "",
          destination: "",
          duration: "",
          price: "",
          description: "",
          inclusions: "",
          exclusions: "",
          image: "",
        });
      } else {
        props.showAlert(data.message || "Failed to submit package", "danger");
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
          Register Package
        </h2>

        <p
          style={{
            color: props.darkMode ? "rgba(255,255,255,.7)" : "#6b7280",
            marginBottom: "20px",
          }}
        >
          Create and submit travel packages for approval
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
        <div className="mb-3">
          <label className="form-label">Package Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Darjeeling Weekend Getaway"
            required
          />
        </div>

        <div className="mb-3">
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

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Duration</label>

            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className={inputClass}
              placeholder="3 Days / 2 Nights"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Price (₹)</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="4999"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>

          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputClass}
            placeholder="Describe the package..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Inclusions</label>

          <textarea
            rows="3"
            name="inclusions"
            value={form.inclusions}
            onChange={handleChange}
            className={inputClass}
            placeholder="Hotel Stay, Breakfast, Sightseeing"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Exclusions</label>

          <textarea
            rows="3"
            name="exclusions"
            value={form.exclusions}
            onChange={handleChange}
            className={inputClass}
            placeholder="Flights, Personal Expenses"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>

          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://example.com/image.jpg"
          />
        </div>

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
            Register Package
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterPackage;
