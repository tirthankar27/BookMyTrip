import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faCalendarPlus,
  faCalendarCheck,
  faTimes,
  faCalendarWeek,
  faUser,
  faMinus,
  faPlus,
  faBed,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function SearchHotel(props) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeCalendar, setActiveCalendar] = useState(null); // 'checkIn' or 'checkOut'
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const destRef = useRef(null);
  const destSuggestionsRef = useRef(null);
  const calendarRef = useRef(null);
  const guestsRef = useRef(null);

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
      if (
        destSuggestionsRef.current &&
        !destSuggestionsRef.current.contains(event.target) &&
        destRef.current &&
        !destRef.current.contains(event.target)
      ) {
        setShowDestSuggestions(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCheckInCalendar(false);
        setShowCheckOutCalendar(false);
        setActiveCalendar(null);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.trim()) {
      const filtered = places
        .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredDestinations(filtered);
      setShowDestSuggestions(true);
    } else {
      setFilteredDestinations([]);
      setShowDestSuggestions(false);
    }
  };

  const handleDestinationSelect = (place) => {
    setDestination(place.name);
    setShowDestSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const destinationPlace = places.find(
      (p) => p.name.toLowerCase() === destination.trim().toLowerCase(),
    );

    if (!destinationPlace || !checkIn || !checkOut) {
      props.showAlert(
        "Please select destination, check-in and check-out dates",
        "warning",
      );
      return;
    }

    const destinationId = destinationPlace._id;

    if (new Date(checkOut) <= new Date(checkIn)) {
      props.showAlert("Check-out date must be after check-in date", "warning");
      return;
    }

    try {
      const result = await axios.get(props.hotelsendpoint, {
        params: {
          destination: destinationId,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: guests,
        },
      });
      if (result.status === 200) {
        navigate("/hotelresults", {
          state: {
            hotels: result.data.hotels,
            checkIn,
            checkOut,
            guests,
            destination,
          },
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/searchresults", {
          state: { hotels: [], checkIn, checkOut, guests, destination },
        });
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const formattedDate =
      selectedDate.getFullYear() +
      "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(selectedDate.getDate()).padStart(2, "0");

    if (activeCalendar === "checkIn") {
      setCheckIn(formattedDate);
      // If check-out date is before new check-in, reset it
      if (checkOut && new Date(checkOut) <= new Date(formattedDate)) {
        setCheckOut("");
      }
    } else if (activeCalendar === "checkOut") {
      if (checkIn && new Date(formattedDate) <= new Date(checkIn)) {
        props.showAlert("Check-out must be after check-in date", "warning");
        return;
      }
      setCheckOut(formattedDate);
    }

    setShowCheckInCalendar(false);
    setShowCheckOutCalendar(false);
    setActiveCalendar(null);
  };

  const isDateDisabled = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (activeCalendar === "checkOut" && checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      return date <= checkInDate || date < today;
    }

    return date < today;
  };

  const handleGuestsChange = (delta) => {
    setGuests((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const glassDarkStyle = {
    background: "rgba(17, 25, 40, 0.85)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  };

  const glassLightStyle = {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
  };

  const inputDarkStyle = {
    backgroundColor: "rgba(17, 25, 40, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#fff",
    transition: "all 0.3s ease",
  };

  const inputLightStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    color: "#000",
    transition: "all 0.3s ease",
  };

  const renderCalendar = (type) => {
    return (
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
          padding: "1rem",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-2 mb-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{
              background: props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: "#3b82f6",
              fontSize: "1.1rem",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)";
              e.currentTarget.style.color = "#3b82f6";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <span
            className="fw-semibold"
            style={{
              color: props.darkMode ? "#fff" : "#000",
              fontSize: "1.1rem",
              background: props.darkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              padding: "8px 20px",
              borderRadius: "20px",
            }}
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              background: props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: "#3b82f6",
              fontSize: "1.1rem",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)";
              e.currentTarget.style.color = "#3b82f6";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Quick month navigation buttons */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              const date = new Date();
              setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
            }}
            style={{
              background: "transparent",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: props.darkMode ? "#fff" : "#000",
              fontSize: "0.8rem",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FontAwesomeIcon icon={faCalendarWeek} size="sm" />
            Current
          </button>

          <button
            type="button"
            onClick={() => {
              const date = new Date();
              setCurrentMonth(
                new Date(date.getFullYear(), date.getMonth() + 1, 1),
              );
            }}
            style={{
              background: "transparent",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: props.darkMode ? "#fff" : "#000",
              fontSize: "0.8rem",
              padding: "6px 14px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FontAwesomeIcon icon={faCalendarPlus} size="sm" />
            Next
          </button>
        </div>

        <div className="row g-0 p-2 text-center">
          {dayNames.map((day, index) => (
            <div key={index} className="col" style={{ fontSize: "0.9rem" }}>
              <span
                style={{
                  color: props.darkMode
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.6)",
                  fontWeight: "600",
                }}
              >
                {day}
              </span>
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
              const currentDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
              )
                .toISOString()
                .split("T")[0];
              const isSelected =
                (type === "checkIn" && checkIn === currentDate) ||
                (type === "checkOut" && checkOut === currentDate);
              const isInRange =
                checkIn &&
                checkOut &&
                currentDate > checkIn &&
                currentDate < checkOut;

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
                      border: isSelected
                        ? "none"
                        : props.darkMode
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.1)",
                      background: isSelected
                        ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                        : isInRange
                          ? props.darkMode
                            ? "rgba(59, 130, 246, 0.15)"
                            : "rgba(59, 130, 246, 0.08)"
                          : "transparent",
                      color: isSelected
                        ? "#fff"
                        : isDisabled
                          ? props.darkMode
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)"
                          : props.darkMode
                            ? "#fff"
                            : "#000",
                      fontWeight: isSelected ? "600" : "400",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      fontSize: "0.95rem",
                      boxShadow: isSelected
                        ? "0 4px 10px rgba(59, 130, 246, 0.3)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled && !isSelected) {
                        e.currentTarget.style.background = props.darkMode
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(59, 130, 246, 0.1)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDisabled && !isSelected) {
                        e.currentTarget.style.background = isInRange
                          ? props.darkMode
                            ? "rgba(59, 130, 246, 0.15)"
                            : "rgba(59, 130, 246, 0.08)"
                          : "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    {day}
                  </button>
                </div>,
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
                </div>,
              );
            }

            return weeks;
          })()}
        </div>

        <div
          className="d-flex justify-content-between align-items-center mt-3 pt-2"
          style={{
            borderTop: props.darkMode
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const formattedToday = today.toISOString().split("T")[0];
              if (type === "checkIn") {
                setCheckIn(formattedToday);
              } else {
                // For check-out, set to tomorrow
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                setCheckOut(tomorrow.toISOString().split("T")[0]);
              }
              setShowCheckInCalendar(false);
              setShowCheckOutCalendar(false);
              setActiveCalendar(null);
            }}
            style={{
              background: props.darkMode
                ? "rgba(40, 167, 69, 0.2)"
                : "rgba(40, 167, 69, 0.1)",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: "#28a745",
              fontWeight: "600",
              padding: "8px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#28a745";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(40, 167, 69, 0.2)"
                : "rgba(40, 167, 69, 0.1)";
              e.currentTarget.style.color = "#28a745";
            }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            {type === "checkIn" ? "Today" : "Tomorrow"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowCheckInCalendar(false);
              setShowCheckOutCalendar(false);
              setActiveCalendar(null);
            }}
            style={{
              background: props.darkMode
                ? "rgba(220, 53, 69, 0.2)"
                : "rgba(220, 53, 69, 0.1)",
              border: props.darkMode
                ? "1px solid rgba(255,255,255,0.125)"
                : "1px solid rgba(0,0,0,0.1)",
              color: "#dc3545",
              fontWeight: "600",
              padding: "8px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc3545";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = props.darkMode
                ? "rgba(220, 53, 69, 0.2)"
                : "rgba(220, 53, 69, 0.1)";
              e.currentTarget.style.color = "#dc3545";
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >

      <div
        className="container d-flex flex-column align-items-center pt-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        <h1
          className="mb-4 text-center search-title"
          style={{
            color: props.darkMode ? "#fff" : "#000",
            textShadow: props.darkMode
              ? "0 4px 8px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "3rem",
            fontWeight: "800",
          }}
        >
          Find Your Perfect Stay <br />
          <span
            style={{
              background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Luxury Hotels • Resorts • Homestays
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            ...(props.darkMode ? glassDarkStyle : glassLightStyle),
            width: "95%",
            maxWidth: "1000px",
            padding: "2.5rem",
            borderRadius: "32px",
            animation: "slideUp 0.6s ease",
          }}
        >
          <div className="row g-4 align-items-end">
            {/* Destination Field */}
            <div className="col-md-3 position-relative">
              <label
                className="form-label fw-semibold mb-2"
                style={{ color: props.darkMode ? "#fff" : "#000" }}
              >
                Destination
              </label>
              <div className="position-relative">
                <input
                  ref={destRef}
                  type="text"
                  className="form-control"
                  placeholder="Where to?"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => destination && setShowDestSuggestions(true)}
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem",
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
                    <i
                      className={`bi bi-x-circle-fill`}
                      style={{
                        color: props.darkMode
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.3)",
                        fontSize: "16px",
                        transition: "all 0.2s",
                      }}
                    ></i>
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
                    animation: "slideDown 0.3s ease",
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
                        borderBottom: props.darkMode
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "1px solid rgba(0,0,0,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = props.darkMode
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(245, 158, 11, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <i
                        className="bi bi-geo-alt me-2"
                        style={{ color: "#3b82f6" }}
                      ></i>
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Check-In Date Field */}
            <div className="col-md-2 position-relative">
              <label
                className="form-label fw-semibold mb-2"
                style={{ color: props.darkMode ? "#fff" : "#000" }}
              >
                Check In
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Check-in"
                  value={checkIn ? formatDate(checkIn) : ""}
                  onClick={() => {
                    setActiveCalendar("checkIn");
                    setShowCheckInCalendar(true);
                    setShowCheckOutCalendar(false);
                    setCurrentMonth(new Date());
                  }}
                  readOnly
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.7",
                    pointerEvents: "none",
                    color: props.darkMode ? "#fff" : "#000",
                  }}
                />
              </div>

              {showCheckInCalendar &&
                activeCalendar === "checkIn" &&
                renderCalendar("checkIn")}
            </div>

            {/* Check-Out Date Field */}
            <div className="col-md-2 position-relative">
              <label
                className="form-label fw-semibold mb-2"
                style={{ color: props.darkMode ? "#fff" : "#000" }}
              >
                Check Out
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Check-out"
                  value={checkOut ? formatDate(checkOut) : ""}
                  onClick={() => {
                    setActiveCalendar("checkOut");
                    setShowCheckOutCalendar(true);
                    setShowCheckInCalendar(false);
                    setCurrentMonth(checkIn ? new Date(checkIn) : new Date());
                  }}
                  readOnly
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.7",
                    pointerEvents: "none",
                    color: props.darkMode ? "#fff" : "#000",
                  }}
                />
              </div>

              {showCheckOutCalendar &&
                activeCalendar === "checkOut" &&
                renderCalendar("checkOut")}
            </div>

            {/* Guests Field */}
            <div className="col-md-2 position-relative">
              <label
                className="form-label fw-semibold mb-2"
                style={{ color: props.darkMode ? "#fff" : "#000" }}
              >
                Guests
              </label>
              <div
                ref={guestsRef}
                className="position-relative"
                onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="form-control d-flex align-items-center justify-content-between"
                  style={{
                    ...(props.darkMode ? inputDarkStyle : inputLightStyle),
                    height: "50px",
                    borderRadius: "16px",
                    paddingLeft: "20px",
                    paddingRight: "10px",
                    fontSize: "1rem",
                  }}
                >
                  <span>
                    {guests} {guests === 1 ? "Guest" : "Guests"}
                  </span>
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      fontSize: "1rem",
                      opacity: "0.7",
                      color: props.darkMode ? "#fff" : "#000",
                    }}
                  />
                </div>

                {showGuestsDropdown && (
                  <div
                    style={{
                      ...(props.darkMode ? glassDarkStyle : glassLightStyle),
                      position: "absolute",
                      width: "260px",
                      right: 0,
                      marginTop: "8px",
                      borderRadius: "16px",
                      zIndex: 1000,
                      animation: "slideDown 0.3s ease",
                      padding: "1rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ color: props.darkMode ? "#fff" : "#000" }}>
                        Guests
                      </span>
                      <div className="d-flex align-items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuestsChange(-1);
                          }}
                          disabled={guests <= 1}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border: props.darkMode
                              ? "1px solid rgba(255,255,255,0.2)"
                              : "1px solid rgba(0,0,0,0.1)",
                            background: props.darkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.05)",
                            color: props.darkMode ? "#fff" : "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: guests <= 1 ? "not-allowed" : "pointer",
                            opacity: guests <= 1 ? 0.5 : 1,
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} size="sm" />
                        </button>
                        <span
                          style={{
                            color: props.darkMode ? "#fff" : "#000",
                            fontWeight: "600",
                            minWidth: "20px",
                            textAlign: "center",
                          }}
                        >
                          {guests}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuestsChange(1);
                          }}
                          disabled={guests >= 10}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            border: props.darkMode
                              ? "1px solid rgba(255,255,255,0.2)"
                              : "1px solid rgba(0,0,0,0.1)",
                            background: "#3b82f6",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: guests >= 10 ? "not-allowed" : "pointer",
                            opacity: guests >= 10 ? 0.5 : 1,
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} size="sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="col-md-3">
              <button
                type="submit"
                className="btn w-100 search-button"
                style={{
                  height: "50px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
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
                  color: "#fff",
                }}
              >
                <FontAwesomeIcon icon={faBed} />
                Search Hotels
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mt-4 d-flex gap-2 justify-content-center flex-wrap">
            <span
              style={{
                color: props.darkMode
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(0,0,0,0.7)",
                fontSize: "0.9rem",
              }}
            >
              Popular destinations:
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => setDestination("Gangtok")}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Gangtok
            </button>
            <span
              style={{
                color: props.darkMode
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(0,0,0,0.3)",
              }}
            >
              •
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => setDestination("Darjeeling")}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Darjeeling
            </button>
            <span
              style={{
                color: props.darkMode
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(0,0,0,0.3)",
              }}
            >
              •
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={() => setDestination("Kalimpong")}
              style={{ color: "#3b82f6", fontSize: "0.9rem" }}
            >
              Kalimpong
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, 30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-30px, -30px) rotate(-120deg);
          }
          66% {
            transform: translate(20px, -20px) rotate(-240deg);
          }
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

        .search-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4);
        }

        .search-button:active {
          transform: translateY(-1px);
        }

        .form-control:focus {
          outline: none;
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2) !important;
        }

        /* Custom scrollbar for suggestions */
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: transparent;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: ${props.darkMode
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)"};
          border-radius: 10px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: ${props.darkMode
            ? "rgba(255,255,255,0.3)"
            : "rgba(0,0,0,0.3)"};
        }
      `}</style>
    </div>
  );
}
