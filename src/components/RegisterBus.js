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
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);
  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
  const [departureTimeObj, setDepartureTimeObj] = useState({ hour: "09", minute: "00", period: "AM" });
  const [arrivalTimeObj, setArrivalTimeObj] = useState({ hour: "18", minute: "00", period: "PM" });
  
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

  // Format time from object to HH:MM string
  const formatTimeToString = (timeObj) => {
    let hour = parseInt(timeObj.hour);
    if (timeObj.period === "PM" && hour !== 12) hour += 12;
    if (timeObj.period === "AM" && hour === 12) hour = 0;
    
    const hourStr = hour.toString().padStart(2, '0');
    return `${hourStr}:${timeObj.minute}`;
  };

  // Parse time string to object
  const parseTimeToObj = (timeStr) => {
    if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
    
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr);
    const minute = minuteStr;
    
    let period = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    
    return {
      hour: hour.toString().padStart(2, '0'),
      minute,
      period
    };
  };

  // Update bus time when time picker changes
  useEffect(() => {
    setBus(prev => ({
      ...prev,
      departureTime: formatTimeToString(departureTimeObj)
    }));
  }, [departureTimeObj]);

  useEffect(() => {
    setBus(prev => ({
      ...prev,
      arrivalTime: formatTimeToString(arrivalTimeObj)
    }));
  }, [arrivalTimeObj]);

  // Initialize time objects from existing values
  useEffect(() => {
    if (bus.departureTime) {
      setDepartureTimeObj(parseTimeToObj(bus.departureTime));
    }
    if (bus.arrivalTime) {
      setArrivalTimeObj(parseTimeToObj(bus.arrivalTime));
    }
  }, [bus.departureTime, bus.arrivalTime]);

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

  // Time picker component
  const TimePicker = ({ value, onChange, onClose }) => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    const periods = ['AM', 'PM'];

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '8px',
        background: props.darkMode ? 'rgba(17, 25, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: props.darkMode ? '1px solid rgba(255, 255, 255, 0.125)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        padding: '1rem',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        animation: 'slideDown 0.3s ease'
      }}>
        <div className="d-flex justify-content-between align-items-center gap-2">
          {/* Hour selector */}
          <div style={{ flex: 1 }}>
            <label style={{ 
              fontSize: '0.8rem', 
              color: props.darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              marginBottom: '4px',
              display: 'block'
            }}>Hour</label>
            <select
              value={value.hour}
              onChange={(e) => onChange({ ...value, hour: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '12px',
                background: props.darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                border: props.darkMode ? '1px solid rgba(255,255,255,0.125)' : '1px solid rgba(0,0,0,0.1)',
                color: props.darkMode ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {hours.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>

          {/* Minute selector */}
          <div style={{ flex: 1 }}>
            <label style={{ 
              fontSize: '0.8rem', 
              color: props.darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              marginBottom: '4px',
              display: 'block'
            }}>Minute</label>
            <select
              value={value.minute}
              onChange={(e) => onChange({ ...value, minute: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '12px',
                background: props.darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                border: props.darkMode ? '1px solid rgba(255,255,255,0.125)' : '1px solid rgba(0,0,0,0.1)',
                color: props.darkMode ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {minutes.map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>

          {/* Period selector (AM/PM) */}
          <div style={{ flex: 1 }}>
            <label style={{ 
              fontSize: '0.8rem', 
              color: props.darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              marginBottom: '4px',
              display: 'block'
            }}>Period</label>
            <select
              value={value.period}
              onChange={(e) => onChange({ ...value, period: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '12px',
                background: props.darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                border: props.darkMode ? '1px solid rgba(255,255,255,0.125)' : '1px solid rgba(0,0,0,0.1)',
                color: props.darkMode ? '#fff' : '#000',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Done button */}
        <div className="text-end mt-3">
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 20px',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  // Format time for display
  const formatTimeForDisplay = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;
  };

  // Glass morphism styles
  const glassDarkStyle = {
    background: "rgba(17, 25, 40, 0.85)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
  };

  const glassLightStyle = {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)"
  };

  // Input styles with proper dark mode contrast
  const inputDarkStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease",
    WebkitTextFillColor: "#ffffff",
    caretColor: "#3b82f6"
  };

  const inputLightStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    color: "#000000",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease"
  };

  // Select styles
  const selectDarkStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease"
  };

  const selectLightStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    color: "#000000",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease"
  };

  // Label style
  const labelStyle = {
    color: props.darkMode ? "#ffffff" : "#000000",
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "0.95rem"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0
      }}>
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          filter: "blur(80px)",
          opacity: props.darkMode ? 0.2 : 0.1,
          top: "-100px",
          right: "-50px",
          animation: "float 20s infinite"
        }} />
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
          filter: "blur(100px)",
          opacity: props.darkMode ? 0.15 : 0.1,
          bottom: "-150px",
          left: "-100px",
          animation: "floatReverse 25s infinite"
        }} />
      </div>

      <div className="container py-5" style={{ position: "relative", zIndex: 1 }}>
        <div 
          style={{
            ...(props.darkMode ? glassDarkStyle : glassLightStyle),
            borderRadius: "32px",
            padding: "2.5rem",
            animation: "slideUp 0.6s ease"
          }}
        >
          <h2 className="text-center mb-4" style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "2rem"
          }}>
            Register New Bus
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-4">
                  <label style={labelStyle}>Bus Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter bus name"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Source</label>
                  <select 
                    name="source" 
                    style={props.darkMode ? selectDarkStyle : selectLightStyle}
                    className="form-select"
                    value={bus.source} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="" style={props.darkMode ? {backgroundColor: "#1a1a1a"} : {}}>Select Source</option>
                    {places.map(place => (
                      <option 
                        key={place._id} 
                        value={place._id}
                        style={props.darkMode ? {backgroundColor: "#1a1a1a", color: "#fff"} : {}}
                      >
                        {place.name} ({place.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Destination</label>
                  <select 
                    name="destination" 
                    style={props.darkMode ? selectDarkStyle : selectLightStyle}
                    className="form-select"
                    value={bus.destination} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="" style={props.darkMode ? {backgroundColor: "#1a1a1a"} : {}}>Select Destination</option>
                    {places.map(place => (
                      <option 
                        key={place._id} 
                        value={place._id}
                        style={props.darkMode ? {backgroundColor: "#1a1a1a", color: "#fff"} : {}}
                      >
                        {place.name} ({place.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Distance (km)</label>
                  <input 
                    type="number" 
                    name="distance" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.distance} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter distance in km"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Base Price (₹)</label>
                  <input 
                    type="number" 
                    name="baseFare" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.baseFare} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter base fare"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-4 position-relative">
                  <label style={labelStyle}>Departure Time</label>
                  <div className="position-relative">
                    <input 
                      type="text"
                      className="form-control"
                      value={formatTimeForDisplay(bus.departureTime)}
                      onClick={() => {
                        setShowDepartureTimePicker(true);
                        setShowArrivalTimePicker(false);
                      }}
                      readOnly
                      style={props.darkMode ? inputDarkStyle : inputLightStyle}
                      placeholder="Select departure time"
                    />
                    <i 
                      className="bi bi-clock position-absolute end-0 top-50 translate-middle-y me-3"
                      style={{ 
                        color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
                        pointerEvents: "none"
                      }}
                    ></i>
                  </div>
                  
                  {showDepartureTimePicker && (
                    <TimePicker 
                      value={departureTimeObj}
                      onChange={setDepartureTimeObj}
                      onClose={() => setShowDepartureTimePicker(false)}
                    />
                  )}
                </div>

                <div className="mb-4 position-relative">
                  <label style={labelStyle}>Arrival Time</label>
                  <div className="position-relative">
                    <input 
                      type="text"
                      className="form-control"
                      value={formatTimeForDisplay(bus.arrivalTime)}
                      onClick={() => {
                        setShowArrivalTimePicker(true);
                        setShowDepartureTimePicker(false);
                      }}
                      readOnly
                      style={props.darkMode ? inputDarkStyle : inputLightStyle}
                      placeholder="Select arrival time"
                    />
                    <i 
                      className="bi bi-clock position-absolute end-0 top-50 translate-middle-y me-3"
                      style={{ 
                        color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
                        pointerEvents: "none"
                      }}
                    ></i>
                  </div>
                  
                  {showArrivalTimePicker && (
                    <TimePicker 
                      value={arrivalTimeObj}
                      onChange={setArrivalTimeObj}
                      onClose={() => setShowArrivalTimePicker(false)}
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Days of Operation</label>
                  <div className="d-flex flex-wrap gap-3" style={{
                    background: props.darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)",
                    padding: "1rem",
                    borderRadius: "16px",
                    border: props.darkMode ? "1px solid rgba(255,255,255,0.125)" : "1px solid rgba(0,0,0,0.1)"
                  }}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`day-${day}`}
                          value={day}
                          checked={bus.daysOfWeek.includes(day)}
                          onChange={handleCheckbox}
                          style={{
                            cursor: "pointer",
                            backgroundColor: bus.daysOfWeek.includes(day) ? "#3b82f6" : props.darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                            borderColor: bus.daysOfWeek.includes(day) ? "#3b82f6" : props.darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"
                          }}
                        />
                        <label className="form-check-label" htmlFor={`day-${day}`} style={{
                          color: props.darkMode ? "#fff" : "#000",
                          marginLeft: "4px",
                          cursor: "pointer"
                        }}>
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Total Seats</label>
                  <input 
                    type="number" 
                    name="totalSeats" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.totalSeats} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter total seats"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Available Seats</label>
                  <input 
                    type="number" 
                    name="availableSeats" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.availableSeats} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter available seats"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Fare Multiplier</label>
                  <input 
                    type="number" 
                    name="fareMultiplier" 
                    style={props.darkMode ? inputDarkStyle : inputLightStyle}
                    className="form-control"
                    value={bus.fareMultiplier} 
                    onChange={handleChange} 
                    step="0.1" 
                    min="1.0"
                    placeholder="1.0"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Bus Type</label>
                  <select 
                    name="busType" 
                    style={props.darkMode ? selectDarkStyle : selectLightStyle}
                    className="form-select"
                    value={bus.busType} 
                    onChange={handleChange}
                  >
                    <option value="Non-AC" style={props.darkMode ? {backgroundColor: "#1a1a1a", color: "#fff"} : {}}>Non-AC</option>
                    <option value="AC" style={props.darkMode ? {backgroundColor: "#1a1a1a", color: "#fff"} : {}}>AC</option>
                    <option value="Sleeper" style={props.darkMode ? {backgroundColor: "#1a1a1a", color: "#fff"} : {}}>Sleeper</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button 
                type="submit" 
                className="btn py-3"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  color: "white",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
                }}
              >
                <i className="bi bi-bus-front me-2"></i>
                Register Bus
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, 30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, -30px) rotate(-120deg); }
          66% { transform: translate(20px, -20px) rotate(-240deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-control:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
        }
        
        .form-check-input:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .form-check-input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        
        /* Dark mode specific input styles */
        input[type="text"].form-control,
        input[type="number"].form-control,
        select.form-select {
          -webkit-text-fill-color: ${props.darkMode ? '#ffffff' : '#000000'};
          opacity: 1;
        }
        
        input::placeholder {
          color: ${props.darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
          opacity: 1;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${props.darkMode ? "rgba(17, 25, 40, 0.5)" : "rgba(0, 0, 0, 0.05)"};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${props.darkMode ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.3)"};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}