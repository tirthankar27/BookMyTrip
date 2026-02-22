import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPlace = (props) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    state: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(props.placeendpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      
      if (json.success) {
        props.showAlert("Place registered successfully!", "success");
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
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="register-overlay"></div>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`} style={{ width: "100%", maxWidth: "600px" }}>
          <h2 className="text-center mb-4" style={{
            background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>
            Register New Place
          </h2>

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

            <div className="mb-4">
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

            <div className="d-grid">
              <button
                type="submit"
                className="btn py-2"
                style={{
                  background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none",
                  fontWeight: "600",
                  color: "white",
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Register Place
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPlace;