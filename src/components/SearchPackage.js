import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPackage = (props) => {
  const [places, setPlaces] = useState([]);
  const [destination, setDestination] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(props.placesendpoint);

      if (res.data.success) {
        setPlaces(res.data.places);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDestinationChange = (e) => {
    const value = e.target.value;

    setDestination(value);

    if (value.trim()) {
      const filtered = places
        .filter((place) =>
          place.name.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5);

      setFilteredDestinations(filtered);

      setShowSuggestions(true);
    } else {
      setFilteredDestinations([]);

      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    const selectedPlace = places.find(
      (place) => place.name.toLowerCase() === destination.toLowerCase(),
    );

    if (!selectedPlace) {
      props.showAlert("Please select a valid destination", "warning");
      return;
    }

    navigate("/packages", {
      state: {
        destination: selectedPlace._id,
      },
    });
  };

  const inputDarkStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    backdropFilter: "blur(10px)",
  };

  const inputLightStyle = {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(0,0,0,0.08)",
    color: "#111827",
    backdropFilter: "blur(10px)",
  };

  return (
    <div className="container py-5">
      <h1
          className="mb-4 text-center search-title"
          style={{
            color: props.darkMode ? "#fff" : "#000",
            textShadow: props.darkMode ? "0 4px 8px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "3rem",
            fontWeight: "800"
          }}
        >
          Explore More, Worry Less <br />
          <span style={{
            background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}>Find Your Perfect Travel Package!</span>
        </h1>
      <div
        className={`${
          props.darkMode ? "glass-container-dark" : "glass-container-light"
        } p-5 rounded-5 shadow-lg`}
      >

        <div className="row align-items-end">
          <div className="col-md-9">
            <label
              className="form-label fw-semibold mb-2"
              style={{ color: props.darkMode ? "#fff" : "#000" }}
            >
              <i
                className="bi bi-geo-alt-fill me-2"
                style={{ color: "#3b82f6" }}
              ></i>
              Destination
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search destination"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => destination && setShowSuggestions(true)}
                style={{
                  ...(props.darkMode ? inputDarkStyle : inputLightStyle),

                  height: "50px",
                  borderRadius: "16px",
                  paddingLeft: "20px",
                  fontSize: "1rem",
                }}
                autoComplete="off"
              />

              {showSuggestions && filteredDestinations.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    background: props.darkMode ? "#1f2937" : "#fff",
                    borderRadius: "16px",
                    marginTop: "8px",
                    zIndex: 1000,
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,.15)",
                  }}
                >
                  {filteredDestinations.map((place) => (
                    <div
                      key={place._id}
                      onClick={() => {
                        setDestination(place.name);

                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        color: props.darkMode ? "#fff" : "#000",
                      }}
                    >
                      <FaMapMarkerAlt
                        style={{
                          marginRight: "10px",
                        }}
                      />
                      {place.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100"
              onClick={handleSearch}
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
                color: "#fff",
              }}
            >
              <FaSearch
                style={{
                  marginRight: "8px",
                }}
              />
              Search Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPackage;
