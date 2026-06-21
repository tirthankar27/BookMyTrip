import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

const RegisterPlace = (props) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    state: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "agency") {
      props.showAlert("Only travel agencies can register places", "warning");
      navigate("/");
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(props.placeendpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success) {
        props.showAlert(
          "Place request submitted for admin approval!",
          "success",
        );
        setForm({ name: "", code: "", state: "" });
      } else {
        props.showAlert(json.error || "Error registering place", "danger");
      }
    } catch (err) {
      console.error("Request failed:", err);
      props.showAlert("Network or server error", "danger");
    }
  };

  // Dark mode classes
  const inputClass = props.darkMode
    ? "form-control glass-dark"
    : "form-control glass-light";

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

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
          Register Place
        </h2>

        <p
          style={{
            color: props.darkMode ? "rgba(255,255,255,.7)" : "#6b7280",
            marginBottom: "20px",
          }}
        >
          Add a new destination to BookMyTrip
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
          <label className="form-label">Place Name</label>

          <input
            name="name"
            className={inputClass}
            placeholder="Enter place name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Place Code</label>

          <input
            name="code"
            className={inputClass}
            placeholder="Enter place code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>

          <input
            name="state"
            className={inputClass}
            placeholder="Enter state"
            value={form.state}
            onChange={handleChange}
            required
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
            Register Place
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterPlace;
