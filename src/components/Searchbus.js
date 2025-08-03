import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchbus(props) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

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

  // Dark mode classes with glass morphism effect
  const inputClass = props.darkMode
    ? "form-control text-white border-light glass-dark"
    : "form-control bg-light glass-light";

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  const textClass = props.darkMode ? "text-white" : "text-dark";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="searchbus-overlay"></div>

      <div className="container d-flex flex-column align-items-center pt-5">
        <h1
          className={`${textClass} mb-4 text-center`}
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          Our Journey Begins Here <br />
          <span className="text-primary">Find Your Perfect Bus!</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`${containerClass} p-4 rounded-3 shadow-lg`}
          style={{ width: "90%", maxWidth: "800px" }}
        >
          <div className="row g-3">
            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>From</label>
              <input
                type="text"
                className={`${inputClass}`}
                placeholder="Departure city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{ height: "38px" }}
              />
            </div>

            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>To</label>
              <input
                type="text"
                className={`${inputClass}`}
                placeholder="Destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{ height: "38px" }}
              />
            </div>

            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>Date</label>
              <input
                type="date"
                className={`${inputClass}`}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ height: "38px" }}
              />
            </div>

            <div className="col-md-3 d-flex flex-column">
              <label className={`form-label ${textClass} invisible`}>
                Search
              </label>
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{
                  height: "38px",
                  background:
                    "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  border: "none",
                  fontWeight: "600",
                  padding: "0.375rem 0.75rem",
                }}
              >
                Search Buses
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
