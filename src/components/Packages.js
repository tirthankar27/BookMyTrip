import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Packages(props) {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const destinationId = location.state?.destination;
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch(props.packagesEndpoint);
      const data = await res.json();

      if (data.success) {
        setPackages(data.packages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  const cardClass = props.darkMode
    ? "glass-dark text-white"
    : "glass-light text-dark";

  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg`}>
          <h2 className="text-center mb-5 fw-bold" style={gradientText}>
            Travel Packages
          </h2>

          {packages.length === 0 ? (
            <div className="text-center">
              <h4>No Packages Available</h4>
            </div>
          ) : (
            <div className="row">
              {packages
                .filter(
                  (pkg) =>
                    !destinationId || pkg.destination?._id === destinationId,
                )
                .map((pkg) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={pkg._id}>
                    <div
                      className={`card border-0 shadow-lg h-100 ${cardClass}`}
                    >
                      {pkg.image && (
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="card-img-top"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="card-body">
                        <h5 className="card-title fw-bold" style={gradientText}>
                          {pkg.title}
                        </h5>

                        <p>📍 {pkg.destination?.name}</p>

                        <p>⏳ {pkg.duration}</p>

                        <p>💰 ₹{pkg.price}</p>

                        <p
                          style={{
                            minHeight: "80px",
                          }}
                        >
                          {pkg.description}
                        </p>

                        <button
                          className="btn w-100"
                          style={{
                            background:
                              "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
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
                          onClick={() => navigate(`/package/${pkg._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
