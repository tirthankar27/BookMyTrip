import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterBus(props) {
  const [places, setPlaces] = useState([]);
  const [bus, setBus] = useState({
    name: "",
    source: "",
    destination: "",
    distance: "",
    baseFare: "",
    departureTime: "",
    arrivalTime: "",
    daysOfWeek: [],
    totalSeats: "",
    availableSeats: "",
    fareMultiplier: 1.0,
    busType: "Non-AC"
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
    }
    
    axios.get(props.placesendpoint)
      .then(res => {
        setPlaces(res.data.places);
        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }
      })
      .catch(err => {
        console.error("Error fetching places", err);
        props.showAlert("Failed to load places", "danger");
        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus({ ...bus, [name]: value });
  };

  const handleCheckbox = (e) => {
    const value = e.target.value;
    setBus((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(value)
        ? prev.daysOfWeek.filter(day => day !== value)
        : [...prev.daysOfWeek, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(props.busendpoint, bus);
      props.showAlert("Bus registered successfully!", "success");
      setBus({ 
        ...bus, 
        name: "", 
        distance: "", 
        baseFare: "", 
        totalSeats: "", 
        availableSeats: "", 
        fareMultiplier: 1.0 
      });
      navigate("/"); // Redirect after successful registration
    } catch (err) {
      console.error(err);
      props.showAlert(err.response?.data?.message || "Error registering bus", "danger");
    }
  };

  // Dark mode classes
  const inputClass = props.darkMode
    ? "form-control glass-dark text-white"
    : "form-control glass-light";

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  const textClass = props.darkMode ? "text-white" : "text-dark";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="register-overlay"></div>

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className={`text-center mb-4 ${textClass}`} style={{
            background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>
            Register New Bus
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Bus Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className={inputClass} 
                    value={bus.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Source</label>
                  <select 
                    name="source" 
                    className={inputClass} 
                    value={bus.source} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Source</option>
                    {places.map(place => (
                      <option key={place._id} value={place._id}>
                        {place.name} ({place.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Destination</label>
                  <select 
                    name="destination" 
                    className={inputClass} 
                    value={bus.destination} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Destination</option>
                    {places.map(place => (
                      <option key={place._id} value={place._id}>
                        {place.name} ({place.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Distance (km)</label>
                  <input 
                    type="number" 
                    name="distance" 
                    className={inputClass} 
                    value={bus.distance} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Base Price (₹)</label>
                  <input 
                    type="number" 
                    name="baseFare" 
                    className={inputClass} 
                    value={bus.baseFare} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Departure Time</label>
                  <input 
                    type="time" 
                    name="departureTime" 
                    className={inputClass} 
                    value={bus.departureTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Arrival Time</label>
                  <input 
                    type="time" 
                    name="arrivalTime" 
                    className={inputClass} 
                    value={bus.arrivalTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Days of Operation</label>
                  <div className="d-flex flex-wrap gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`day-${day}`}
                          value={day}
                          checked={bus.daysOfWeek.includes(day)}
                          onChange={handleCheckbox}
                        />
                        <label className={`form-check-label ${textClass}`} htmlFor={`day-${day}`}>
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Total Seats</label>
                  <input 
                    type="number" 
                    name="totalSeats" 
                    className={inputClass} 
                    value={bus.totalSeats} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Available Seats</label>
                  <input 
                    type="number" 
                    name="availableSeats" 
                    className={inputClass} 
                    value={bus.availableSeats} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Fare Multiplier</label>
                  <input 
                    type="number" 
                    name="fareMultiplier" 
                    className={inputClass} 
                    value={bus.fareMultiplier} 
                    onChange={handleChange} 
                    step="0.1" 
                    min="1.0"
                  />
                </div>

                <div className="mb-3">
                  <label className={`form-label ${textClass}`}>Bus Type</label>
                  <select 
                    name="busType" 
                    className={inputClass} 
                    value={bus.busType} 
                    onChange={handleChange}
                  >
                    <option value="Non-AC">Non-AC</option>
                    <option value="AC">AC</option>
                    <option value="Sleeper">Sleeper</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-grid mt-4">
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
                Register Bus
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}