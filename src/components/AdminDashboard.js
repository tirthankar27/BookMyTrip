import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = (props) => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      props.showAlert(
        "Only administrators can access this page",
        "warning"
      );
      navigate("/");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [placeRes, busRes] = await Promise.all([
        fetch(props.pendingPlaces, {
          headers: {
            "auth-token": token,
          },
        }),
        fetch(props.pendingBuses, {
          headers: {
            "auth-token": token,
          },
        }),
      ]);

      const placeData = await placeRes.json();
      const busData = await busRes.json();

      setPlaces(placeData.places || []);
      setBuses(busData.buses || []);
    } catch (err) {
      console.error(err);
      props.showAlert(
        "Failed to load admin data",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePlace = async (id) => {
    try {
      const res = await fetch(
        `${props.approvePlace}/${id}`,
        {
          method: "PUT",
          headers: {
            "auth-token":
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        props.showAlert(
          "Place approved successfully",
          "success"
        );

        setPlaces((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPlace = async (id) => {
    try {
      const res = await fetch(
        `${props.rejectPlace}/${id}`,
        {
          method: "PUT",
          headers: {
            "auth-token":
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        props.showAlert(
          "Place rejected",
          "warning"
        );

        setPlaces((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveBus = async (id) => {
    try {
      const res = await fetch(
        `${props.approveBus}/${id}`,
        {
          method: "PUT",
          headers: {
            "auth-token":
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        props.showAlert(
          "Bus approved successfully",
          "success"
        );

        setBuses((prev) =>
          prev.filter((b) => b._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectBus = async (id) => {
    try {
      const res = await fetch(
        `${props.rejectBus}/${id}`,
        {
          method: "PUT",
          headers: {
            "auth-token":
              localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        props.showAlert(
          "Bus rejected",
          "warning"
        );

        setBuses((prev) =>
          prev.filter((b) => b._id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="register-overlay"></div>

      <div className="container py-5">
        <div
          className={`${containerClass} p-4 rounded-4 shadow-lg`}
        >
          <h2
            className="text-center mb-5"
            style={{
              background:
                "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Admin Dashboard
          </h2>

          <h3 className="mb-4">
            Pending Place Requests
          </h3>

          {places.length === 0 ? (
            <p>No pending places</p>
          ) : (
            places.map((place) => (
              <div
                key={place._id}
                className="card mb-3"
              >
                <div className="card-body">
                  <h5>{place.name}</h5>

                  <p>
                    <strong>Code:</strong>{" "}
                    {place.code}
                  </p>

                  <p>
                    <strong>State:</strong>{" "}
                    {place.state}
                  </p>

                  <p>
                    <strong>Agency:</strong>{" "}
                    {place.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-success me-2"
                    onClick={() =>
                      handleApprovePlace(
                        place._id
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleRejectPlace(
                        place._id
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <hr className="my-5" />

          <h3 className="mb-4">
            Pending Bus Requests
          </h3>

          {buses.length === 0 ? (
            <p>No pending buses</p>
          ) : (
            buses.map((bus) => (
              <div
                key={bus._id}
                className="card mb-3"
              >
                <div className="card-body">
                  <h5>{bus.name}</h5>

                  <p>
                    <strong>Route:</strong>{" "}
                    {bus.source?.name} →{" "}
                    {bus.destination?.name}
                  </p>

                  <p>
                    <strong>Bus Type:</strong>{" "}
                    {bus.busType}
                  </p>

                  <p>
                    <strong>Seats:</strong>{" "}
                    {bus.totalSeats}
                  </p>

                  <p>
                    <strong>Agency:</strong>{" "}
                    {bus.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-success me-2"
                    onClick={() =>
                      handleApproveBus(
                        bus._id
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleRejectBus(
                        bus._id
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;