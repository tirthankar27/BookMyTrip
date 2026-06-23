import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PackageDetails(props) {
  const { id } = useParams();

  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    fetchPackage();
  }, []);

  const fetchPackage = async () => {
    try {
      const res = await fetch(`${props.packageDetailsEndpoint}/${id}`);

      const data = await res.json();

      if (data.success) {
        setPkg(data.package);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  if (!pkg) {
    return (
      <div className="container py-5">
        <h3>Loading Package...</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className={`${containerClass} p-4 rounded-4 shadow-lg`}>
          {pkg.image && (
            <img
              src={pkg.image}
              alt={pkg.title}
              className="img-fluid rounded mb-4"
              style={{
                width: "100%",
                maxHeight: "450px",
                objectFit: "cover",
              }}
            />
          )}

          <div className="row">
            <div className="col-lg-8">
              <h1
                className="fw-bold mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {pkg.title}
              </h1>

              <p
                className="fs-5 mt-3"
                style={{
                  lineHeight: "1.8",
                  textAlign: "justify",
                }}
              >
                {pkg.description}
              </p>

              <hr />

              <h4 className="mb-3">What's Included</h4>

              <div className="row">
                {pkg.inclusions?.map((item, idx) => (
                  <div key={idx} className="col-md-6 mb-2">
                    ✅ {item}
                  </div>
                ))}
              </div>

              <hr />

              <h4 className="mb-3">Not Included</h4>

              <div className="row">
                {pkg.exclusions?.map((item, idx) => (
                  <div key={idx} className="col-md-6 mb-2">
                    ❌ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4 mt-4 mt-lg-0">
              <div
                className={`${
                  props.darkMode
                    ? "glass-container-dark"
                    : "glass-container-light"
                } p-4 rounded-4 shadow-lg`}
                style={{
                  position: "sticky",
                  top: "120px",
                }}
              >
                <div className="card-body">
                  <h4>₹{pkg.price}</h4>

                  <hr />

                  <div className="mb-3">
                    <p className="mb-2">
                      📍 <strong>Destination</strong>
                    </p>
                    <p>{pkg.destination?.name}</p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2">
                      ⏳ <strong>Duration</strong>
                    </p>
                    <p>{pkg.duration}</p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2">
                      👤 <strong>Agency</strong>
                    </p>
                    <p>{pkg.createdBy?.username}</p>
                  </div>

                  <button
                    className="btn w-100 mt-3"
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
                  >
                    Book Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
