import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
    // Check for login
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "warning");
      return;
    }
    // Start loading animation
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
    }
    // Fetch places
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

  // Handle click outside to close suggestions and calendar
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

  // Filter destination suggestions
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

    if (!sourcePlace || !destinationPlace) {
      props.showAlert("Invalid source or destination", "warning");
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

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
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
    const formattedDate = selectedDate.toISOString().split('T')[0];
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Dark mode classes with glass morphism effect
  const inputClass = props.darkMode
    ? "form-control text-white bg-dark border-secondary search-input"
    : "form-control bg-light glass-light search-input";

  const containerClass = props.darkMode
    ? "glass-container-dark search-container"
    : "glass-container-light search-container";

  const calendarClass = props.darkMode
    ? "glass-container-dark custom-calendar"
    : "glass-container-light custom-calendar";

  const suggestionClass = props.darkMode
    ? "glass-container-dark suggestions-list"
    : "glass-container-light suggestions-list";

  const textClass = props.darkMode ? "text-white" : "text-dark";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="searchbus-overlay"></div>

      <div className="container d-flex flex-column align-items-center pt-5">
        <h1
          className={`${textClass} mb-4 text-center search-title`}
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          Our Journey Begins Here <br />
          <span className="text-primary">Find Your Perfect Bus!</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`${containerClass} p-5 rounded-4 shadow-lg`}
          style={{ width: "95%", maxWidth: "1000px" }}
        >
          <div className="row g-4 align-items-end">
            {/* From Field */}
            <div className="col-md-3 position-relative">
              <label className={`form-label ${textClass} fw-semibold mb-2`}>
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                From
              </label>
              <div className="position-relative">
                <input
                  ref={sourceRef}
                  type="text"
                  className={`${inputClass} ps-4`}
                  placeholder="Departure city"
                  value={source}
                  onChange={handleSourceChange}
                  onFocus={() => source && setShowSourceSuggestions(true)}
                  style={{ 
                    height: "45px", 
                    borderRadius: "12px",
                    color: props.darkMode ? "#fff" : "#000",
                    backgroundColor: props.darkMode ? "#2d2d2d" : "#fff"
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
                    <i className={`bi bi-x-circle-fill ${props.darkMode ? 'text-light' : 'text-secondary'}`} style={{ fontSize: "14px", opacity: "0.6" }}></i>
                  </button>
                )}
              </div>
              
              {/* Source Suggestions */}
              {showSourceSuggestions && filteredSources.length > 0 && (
                <div
                  ref={sourceSuggestionsRef}
                  className={`${suggestionClass} position-absolute w-100 mt-1 rounded-3 shadow-lg`}
                  style={{ 
                    zIndex: 1000, 
                    maxHeight: "200px", 
                    overflowY: "auto",
                    backgroundColor: props.darkMode ? "#2d2d2d" : "#fff"
                  }}
                >
                  {filteredSources.map((place) => (
                    <div
                      key={place._id}
                      className={`p-2 px-3 cursor-pointer ${props.darkMode ? 'hover-bg-dark' : 'hover-bg-light'}`}
                      onClick={() => handleSourceSelect(place)}
                      style={{ 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        color: props.darkMode ? "#fff" : "#000"
                      }}
                    >
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Icon */}
            <div className="col-md-1 d-flex justify-content-center">
              <div 
                className={`swap-icon ${props.darkMode ? 'bg-dark' : 'bg-light'}`}
                onClick={() => {
                  const temp = source;
                  setSource(destination);
                  setDestination(temp);
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginBottom: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.3s",
                  backgroundColor: props.darkMode ? "#404040" : "#f8f9fa"
                }}
              >
                <i className={`bi bi-arrow-left-right ${props.darkMode ? 'text-white' : 'text-primary'}`} style={{ fontSize: "1.2rem" }}></i>
              </div>
            </div>

            {/* To Field */}
            <div className="col-md-3 position-relative">
              <label className={`form-label ${textClass} fw-semibold mb-2`}>
                <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                To
              </label>
              <div className="position-relative">
                <input
                  ref={destRef}
                  type="text"
                  className={`${inputClass} ps-4`}
                  placeholder="Destination city"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => destination && setShowDestSuggestions(true)}
                  style={{ 
                    height: "45px", 
                    borderRadius: "12px",
                    color: props.darkMode ? "#fff" : "#000",
                    backgroundColor: props.darkMode ? "#2d2d2d" : "#fff"
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
                    <i className={`bi bi-x-circle-fill ${props.darkMode ? 'text-light' : 'text-secondary'}`} style={{ fontSize: "14px", opacity: "0.6" }}></i>
                  </button>
                )}
              </div>
              
              {/* Destination Suggestions */}
              {showDestSuggestions && filteredDestinations.length > 0 && (
                <div
                  ref={destSuggestionsRef}
                  className={`${suggestionClass} position-absolute w-100 mt-1 rounded-3 shadow-lg`}
                  style={{ 
                    zIndex: 1000, 
                    maxHeight: "200px", 
                    overflowY: "auto",
                    backgroundColor: props.darkMode ? "#2d2d2d" : "#fff"
                  }}
                >
                  {filteredDestinations.map((place) => (
                    <div
                      key={place._id}
                      className={`p-2 px-3 cursor-pointer ${props.darkMode ? 'hover-bg-dark' : 'hover-bg-light'}`}
                      onClick={() => handleDestinationSelect(place)}
                      style={{ 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        color: props.darkMode ? "#fff" : "#000"
                      }}
                    >
                      <i className="bi bi-geo-alt me-2 text-danger"></i>
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Field - Custom Calendar */}
            <div className="col-md-2 position-relative">
              <label className={`form-label ${textClass} fw-semibold mb-2`}>
                <i className="bi bi-calendar-date me-2 text-success"></i>
                Journey Date
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className={`${inputClass} ps-4`}
                  placeholder="Select date"
                  value={journeyDate ? formatDate(journeyDate) : ""}
                  onClick={() => setShowCalendar(true)}
                  readOnly
                  style={{ 
                    height: "45px", 
                    borderRadius: "12px",
                    color: props.darkMode ? "#fff" : "#000",
                    backgroundColor: props.darkMode ? "#2d2d2d" : "#fff",
                    cursor: "pointer"
                  }}
                />
                <i 
                  className={`bi bi-calendar3 position-absolute end-0 top-50 translate-middle-y me-3 ${textClass}`}
                  style={{ fontSize: "1.1rem", opacity: "0.7", pointerEvents: "none" }}
                ></i>
              </div>
              
              {/* Custom Calendar Dropdown */}
              {showCalendar && (
                <div
                  ref={calendarRef}
                  className={`${calendarClass} position-absolute w-100 mt-2 rounded-4 shadow-lg`}
                  style={{ 
                    zIndex: 1000,
                    minWidth: "320px",
                    left: "50%",
                    transform: "translateX(-50%)"
                  }}
                >
                  {/* Calendar Header */}
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="btn btn-sm btn-link text-primary"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className={`fw-semibold ${textClass}`}>
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="btn btn-sm btn-link text-primary"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  {/* Day Names */}
                  <div className="row g-0 p-2 text-center">
                    {dayNames.map((day, index) => (
                      <div key={index} className="col" style={{ fontSize: "0.8rem" }}>
                        <span className={textClass} style={{ opacity: "0.7" }}>{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="p-2">
                    {(() => {
                      const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
                      const days = [];
                      
                      // Add empty cells for days before month starts
                      for (let i = 0; i < startingDay; i++) {
                        days.push(<div key={`empty-${i}`} className="col p-1"></div>);
                      }
                      
                      // Add actual days
                      for (let day = 1; day <= daysInMonth; day++) {
                        const isDisabled = isDateDisabled(day);
                        const isSelected = journeyDate === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
                        
                        days.push(
                          <div key={day} className="col p-1">
                            <button
                              type="button"
                              onClick={() => !isDisabled && handleDateSelect(day)}
                              disabled={isDisabled}
                              className={`btn w-100 p-2 rounded-3 ${
                                isSelected 
                                  ? "btn-primary text-white" 
                                  : isDisabled
                                  ? `${textClass} opacity-50`
                                  : props.darkMode
                                  ? "text-white hover-bg-dark"
                                  : "text-dark hover-bg-light"
                              }`}
                              style={{
                                border: "none",
                                fontSize: "0.9rem",
                                transition: "all 0.2s",
                                backgroundColor: isSelected 
                                  ? "#3a7bd5" 
                                  : "transparent"
                              }}
                            >
                              {day}
                            </button>
                          </div>
                        );
                      }
                      
                      // Fill remaining cells to complete the grid
                      const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
                      const remainingCells = totalCells - (startingDay + daysInMonth);
                      for (let i = 0; i < remainingCells; i++) {
                        days.push(<div key={`empty-end-${i}`} className="col p-1"></div>);
                      }
                      
                      // Group days into weeks
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

                  {/* Footer with Today button */}
                  <div className="p-2 border-top text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        setJourneyDate(today.toISOString().split('T')[0]);
                        setShowCalendar(false);
                      }}
                      className="btn btn-sm btn-link text-primary"
                      style={{ textDecoration: "none" }}
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
                className="btn btn-primary w-100 search-button"
                style={{
                  height: "45px",
                  background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(58, 123, 213, 0.3)",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <i className="bi bi-search"></i>
                Search Buses
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
            <span className={`${textClass} small`} style={{ opacity: "0.8" }}>Popular routes:</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
              onClick={() => {
                setSource("New York");
                setDestination("Boston");
              }}
            >
              New York → Boston
            </button>
            <span className={textClass}>•</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
              onClick={() => {
                setSource("Los Angeles");
                setDestination("San Francisco");
              }}
            >
              LA → San Francisco
            </button>
            <span className={textClass}>•</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
              onClick={() => {
                setSource("Chicago");
                setDestination("Detroit");
              }}
            >
              Chicago → Detroit
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .search-input {
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        .search-input:focus {
          border-color: #3a7bd5;
          box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.25);
        }
        
        .search-container {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-container-dark {
          background: rgba(33, 37, 41, 0.85);
        }
        
        .glass-container-light {
          background: rgba(255, 255, 255, 0.9);
        }
        
        .custom-calendar {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideDown 0.3s ease;
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
        
        .suggestions-list {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hover-bg-dark:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .hover-bg-light:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .swap-icon:hover {
          transform: rotate(180deg);
        }
        
        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(58, 123, 213, 0.4);
        }
        
        .search-title {
          animation: fadeInDown 0.8s ease;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Dark mode specific input styles */
        .bg-dark {
          background-color: #2d2d2d !important;
        }
        
        .bg-dark::placeholder {
          color: #adb5bd !important;
        }
        
        /* Ensure text is visible in dark mode */
        .form-control.bg-dark {
          color: #fff !important;
          background-color: #2d2d2d !important;
        }
        
        .form-control.bg-dark:focus {
          background-color: #363636 !important;
          color: #fff !important;
        }
        
        /* Calendar button styles */
        .custom-calendar .btn-primary {
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          border: none;
        }
        
        .custom-calendar .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(58, 123, 213, 0.3);
        }
      `}</style>
    </div>
  );
}