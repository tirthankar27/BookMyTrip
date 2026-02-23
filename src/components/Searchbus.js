import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiSwitchHorizontal } from "react-icons/hi";

export default function Searchbus(props) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [filteredSources, setFilteredSources] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const sourceRef = useRef(null);
  const destRef = useRef(null);
  const sourceSuggestionsRef = useRef(null);
  const destSuggestionsRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "warning");
      return;
    }
    
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
    }

    axios
      .get(props.placesendpoint)
      .then((res) => setPlaces(res.data.places))
      .catch((err) => {
        console.error("Failed to load places:", err);
        props.showAlert("Failed to load places", "danger");
      })
      .finally(() => {
        if (props.loadingRef?.current) {
          props.loadingRef.current.complete();
        }
      });
  }, [props.placesendpoint, props.loadingRef, props.showAlert]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceSuggestionsRef.current && !sourceSuggestionsRef.current.contains(event.target) && 
          sourceRef.current && !sourceRef.current.contains(event.target)) {
        setShowSourceSuggestions(false);
      }
      if (destSuggestionsRef.current && !destSuggestionsRef.current.contains(event.target) && 
          destRef.current && !destRef.current.contains(event.target)) {
        setShowDestSuggestions(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter source suggestions
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    if (value.trim()) {
      const filtered = places
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredSources(filtered);
      setShowSourceSuggestions(true);
    } else {
      setFilteredSources([]);
      setShowSourceSuggestions(false);
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.trim()) {
      const filtered = places
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredDestinations(filtered);
      setShowDestSuggestions(true);
    } else {
      setFilteredDestinations([]);
      setShowDestSuggestions(false);
    }
  };

  const handleSourceSelect = (place) => {
    setSource(place.name);
    setShowSourceSuggestions(false);
  };

  const handleDestinationSelect = (place) => {
    setDestination(place.name);
    setShowDestSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sourcePlace = places.find(
      (p) => p.name.toLowerCase() === source.trim().toLowerCase()
    );
    const destinationPlace = places.find(
      (p) => p.name.toLowerCase() === destination.trim().toLowerCase()
    );

    if (!sourcePlace || !destinationPlace || !journeyDate) {
      props.showAlert("Invalid source, destination or journey date", "warning");
      return;
    }

    const sourceId = sourcePlace._id;
    const destinationId = destinationPlace._id;
    try {
      const result = await axios.get(props.busesendpoint, {
        params: { source: sourceId, destination: destinationId },
      });
      if (result.status === 200) {
        navigate("/searchresults", {
          state: { buses: result.data.buses, doj: journeyDate },
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/searchresults", { state: { buses: [] } });
      } else {
        props.showAlert("Something went wrong", "danger");
      }
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate =
    selectedDate.getFullYear() + "-" +
    String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
    String(selectedDate.getDate()).padStart(2, "0");
    setJourneyDate(formattedDate);
    setShowCalendar(false);
  };

  const isDateDisabled = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const inputDarkStyle = {
    backgroundColor: "rgba(17, 25, 40, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#fff",
    transition: "all 0.3s ease"
  };

  const inputLightStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    color: "#000",
    transition: "all 0.3s ease"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
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

      <div className="container d-flex flex-column align-items-center pt-5" style={{ position: "relative", zIndex: 1 }}>
        <h1
          className="mb-4 text-center search-title"
          style={{
            color: props.darkMode ? "#fff" : "#000",
            textShadow: props.darkMode ? "0 4px 8px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "3rem",
            fontWeight: "800"
          }}
        >
          Our Journey Begins Here <br />
          <span style={{
            background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>Find Your Perfect Bus!</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            ...(props.darkMode ? glassDarkStyle : glassLightStyle),
            width: "95%",
            maxWidth: "1000px",
            padding: "2.5rem",
            borderRadius: "32px",
            animation: "slideUp 0.6s ease"
          }}
        >
          <div className="row g-4 align-items-end">
            {/* From Field */}
            <div className="col-md-3 position-relative">
              <label className="form-label fw-semibold mb-2" style={{ color: props.darkMode ? "#fff" : "#000" }}>
                <i className="bi bi-geo-alt-fill me-2" style={{ color: "#3b82f6" }}></i>
                From
              </label>
              <div className="position-relative">
                <input
                  ref={sourceRef}
                  type="text"
                  className="form-control"
                  placeholder="Departure city"
                  value={source}
                  onChange={handleSourceChange}
                  onFocus={() => source && setShowSourceSuggestions(true)}
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem"
                  }}
                  autoComplete="off"
                />
                {source && (
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y btn p-0 me-3"
                    onClick={() => {
                      setSource("");
                      setFilteredSources([]);
                    }}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <i className={`bi bi-x-circle-fill`} style={{ 
                      color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
                      fontSize: "16px",
                      transition: "all 0.2s"
                    }}></i>
                  </button>
                )}
              </div>
              
              {/* Source Suggestions */}
              {showSourceSuggestions && filteredSources.length > 0 && (
                <div
                  ref={sourceSuggestionsRef}
                  style={{
                    ...(props.darkMode ? glassDarkStyle : glassLightStyle),
                    position: "absolute",
                    width: "100%",
                    marginTop: "8px",
                    borderRadius: "16px",
                    zIndex: 1000,
                    maxHeight: "220px",
                    overflowY: "auto",
                    animation: "slideDown 0.3s ease"
                  }}
                >
                  {filteredSources.map((place) => (
                    <div
                      key={place._id}
                      className="p-3 px-3"
                      onClick={() => handleSourceSelect(place)}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: props.darkMode ? "#fff" : "#000",
                        borderBottom: props.darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <i className="bi bi-geo-alt me-2" style={{ color: "#3b82f6" }}></i>
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Icon */}
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <div 
                className="swap-icon"
                onClick={() => {
                  const temp = source;
                  setSource(destination);
                  setDestination(temp);
                }}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginBottom: "8px",
                  background: props.darkMode ? "rgba(17, 25, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  border: props.darkMode ? "1px solid rgba(255,255,255,0.125)" : "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease"
                }}
              >
                <HiSwitchHorizontal 
                  size={18}
                  style={{ color: "#3b82f6" }} 
                />
              </div>
            </div>

            {/* To Field */}
            <div className="col-md-3 position-relative">
              <label className="form-label fw-semibold mb-2" style={{ color: props.darkMode ? "#fff" : "#000" }}>
                <i className="bi bi-geo-alt-fill me-2" style={{ color: "#dc3545" }}></i>
                To
              </label>
              <div className="position-relative">
                <input
                  ref={destRef}
                  type="text"
                  className="form-control"
                  placeholder="Destination city"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => destination && setShowDestSuggestions(true)}
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem"
                  }}
                  autoComplete="off"
                />
                {destination && (
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y btn p-0 me-3"
                    onClick={() => {
                      setDestination("");
                      setFilteredDestinations([]);
                    }}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <i className={`bi bi-x-circle-fill`} style={{ 
                      color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
                      fontSize: "16px",
                      transition: "all 0.2s"
                    }}></i>
                  </button>
                )}
              </div>
              
              {/* Destination Suggestions */}
              {showDestSuggestions && filteredDestinations.length > 0 && (
                <div
                  ref={destSuggestionsRef}
                  style={{
                    ...(props.darkMode ? glassDarkStyle : glassLightStyle),
                    position: "absolute",
                    width: "100%",
                    marginTop: "8px",
                    borderRadius: "16px",
                    zIndex: 1000,
                    maxHeight: "220px",
                    overflowY: "auto",
                    animation: "slideDown 0.3s ease"
                  }}
                >
                  {filteredDestinations.map((place) => (
                    <div
                      key={place._id}
                      className="p-3 px-3"
                      onClick={() => handleDestinationSelect(place)}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        color: props.darkMode ? "#fff" : "#000",
                        borderBottom: props.darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <i className="bi bi-geo-alt me-2" style={{ color: "#dc3545" }}></i>
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Field - Custom Calendar */}
            <div className="col-md-2 position-relative">
              <label className="form-label fw-semibold mb-2" style={{ color: props.darkMode ? "#fff" : "#000" }}>
                <i className="bi bi-calendar-date me-2" style={{ color: "#28a745" }}></i>
                Journey Date
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Select date"
                  value={journeyDate ? formatDate(journeyDate) : ""}
                  onClick={() => setShowCalendar(true)}
                  readOnly
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem",
                    cursor: "pointer"
                  }}
                />
                <i 
                  className={`bi bi-calendar3 position-absolute end-0 top-50 translate-middle-y me-3`}
                  style={{ 
                    fontSize: "1.2rem", 
                    opacity: "0.7", 
                    pointerEvents: "none",
                    color: props.darkMode ? "#fff" : "#000"
                  }}
                ></i>
              </div>
              
              {/* Custom Calendar Dropdown */}
              {showCalendar && (
                <div
                  ref={calendarRef}
                  style={{
                    ...(props.darkMode ? glassDarkStyle : glassLightStyle),
                    position: "absolute",
                    width: "340px",
                    marginTop: "10px",
                    borderRadius: "24px",
                    zIndex: 1000,
                    left: "50%",
                    transform: "translateX(-50%)",
                    animation: "slideDown 0.3s ease",
                    padding: "1rem"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center p-2 mb-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        fontSize: "1.3rem",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className="fw-semibold" style={{ color: props.darkMode ? "#fff" : "#000", fontSize: "1.1rem" }}>
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        fontSize: "1.3rem",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  <div className="row g-0 p-2 text-center">
                    {dayNames.map((day, index) => (
                      <div key={index} className="col" style={{ fontSize: "0.9rem" }}>
                        <span style={{ color: props.darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>{day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2">
                    {(() => {
                      const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
                      const days = [];
                      
                      for (let i = 0; i < startingDay; i++) {
                        days.push(<div key={`empty-${i}`} className="col p-1"></div>);
                      }
                      
                      for (let day = 1; day <= daysInMonth; day++) {
                        const isDisabled = isDateDisabled(day);
                        const isSelected = journeyDate === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
                        
                        days.push(
                          <div key={day} className="col p-1">
                            <button
                              type="button"
                              onClick={() => !isDisabled && handleDateSelect(day)}
                              disabled={isDisabled}
                              style={{
                                width: "100%",
                                padding: "8px 0",
                                borderRadius: "12px",
                                border: "none",
                                background: isSelected 
                                  ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                  : "transparent",
                                color: isSelected 
                                  ? "#fff" 
                                  : isDisabled
                                  ? props.darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                                  : props.darkMode ? "#fff" : "#000",
                                fontWeight: isSelected ? "600" : "400",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                                fontSize: "0.95rem"
                              }}
                              onMouseEnter={(e) => {
                                if (!isDisabled && !isSelected) {
                                  e.currentTarget.style.background = props.darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isDisabled && !isSelected) {
                                  e.currentTarget.style.background = "transparent";
                                }
                              }}
                            >
                              {day}
                            </button>
                          </div>
                        );
                      }
                      
                      const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
                      const remainingCells = totalCells - (startingDay + daysInMonth);
                      for (let i = 0; i < remainingCells; i++) {
                        days.push(<div key={`empty-end-${i}`} className="col p-1"></div>);
                      }
                      
                      const weeks = [];
                      for (let i = 0; i < days.length; i += 7) {
                        weeks.push(
                          <div key={`week-${i}`} className="row g-0">
                            {days.slice(i, i + 7)}
                          </div>
                        );
                      }
                      
                      return weeks;
                    })()}
                  </div>

                  <div className="text-center mt-3 pt-2" style={{
                    borderTop: props.darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        setJourneyDate(today.toISOString().split('T')[0]);
                        setShowCalendar(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        fontWeight: "600",
                        padding: "8px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="col-md-3">
              <button
                type="submit"
                className="btn w-100 search-button"
                style={{
                  height: "50px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  color: "#fff"
                }}
              >
                <i className="bi bi-search"></i>
                Search Buses
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mt-4 d-flex gap-2 justify-content-center flex-wrap">
            <span style={{ 
              color: props.darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
              fontSize: "0.9rem"
            }}>Popular routes:</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => {
                setSource("Jalpaiguri");
                setDestination("Gangtok");
              }}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Jalpaiguri → Gangtok
            </button>
            <span style={{ color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }}>•</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => {
                setSource("Gangtok");
                setDestination("Jalpaiguri");
              }}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Gangtok → Jalpaiguri
            </button>
            <span style={{ color: props.darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)" }}>•</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => {
                setSource("Kolkata");
                setDestination("Jalpaiguri");
              }}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Kolkata → Jalpaiguri
            </button>
          </div>
        </form>
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
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .search-title {
          animation: slideUp 0.8s ease;
        }
        
        .swap-icon:hover {
          transform: rotate(180deg) scale(1.1);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .search-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
        }
        
        .search-button:active {
          transform: translateY(-1px);
        }
        
        .form-control:focus {
          outline: none;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
        }
        
        /* Custom scrollbar for suggestions */
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: ${props.darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
          border-radius: 10px;
        }
        
        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: ${props.darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
        }
      `}</style>
    </div>
  );
}