import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = (props) => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [buses, setBuses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      props.showAlert("Only administrators can access this page", "warning");
      navigate("/");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [placeRes, busRes, packageRes, hotelRes] = await Promise.all([
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
        fetch(props.pendingPackages, {
          headers: {
            "auth-token": token,
          },
        }),
        fetch(props.pendingHotels, {
          headers: {
            "auth-token": token,
          },
        }),
      ]);

      const placeData = await placeRes.json();
      const busData = await busRes.json();
      const packageData = await packageRes.json();
      const hotelData = await hotelRes.json();

      setPlaces(placeData.places || []);
      setBuses(busData.buses || []);
      setPackages(packageData.packages || []);
      setHotels(hotelData.hotels || []);
    } catch (err) {
      console.error(err);
      props.showAlert("Failed to load admin data", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePlace = async (id) => {
    try {
      const res = await fetch(`${props.approvePlace}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Place approved successfully", "success");

        setPlaces((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPlace = async (id) => {
    try {
      const res = await fetch(`${props.rejectPlace}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Place rejected", "warning");

        setPlaces((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveBus = async (id) => {
    try {
      const res = await fetch(`${props.approveBus}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Bus approved successfully", "success");

        setBuses((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectBus = async (id) => {
    try {
      const res = await fetch(`${props.rejectBus}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Bus rejected", "warning");

        setBuses((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePackage = async (id) => {
    try {
      const res = await fetch(`${props.approvePackage}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Package approved successfully", "success");

        setPackages((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPackage = async (id) => {
    try {
      const res = await fetch(`${props.rejectPackage}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Package rejected", "warning");

        setPackages((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveHotel = async (id) => {
    try {
      const res = await fetch(`${props.approveHotel}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Hotel approved successfully", "success");

        setHotels((prev) => prev.filter((h) => h._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectHotel = async (id) => {
    try {
      const res = await fetch(`${props.rejectHotel}/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        props.showAlert("Hotel rejected", "warning");

        setHotels((prev) => prev.filter((h) => h._id !== id));
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
        <div className={`${containerClass} p-4 rounded-4 shadow-lg`}>
          <h2
            className="text-center mb-5"
            style={{
              background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Admin Dashboard
          </h2>

          <h3 className="mb-4">Pending Place Requests</h3>

          {places.length === 0 ? (
            <p>No pending places</p>
          ) : (
            places.map((place) => (
              <div key={place._id} className="card mb-3">
                <div className="card-body">
                  <h5>{place.name}</h5>

                  <p>
                    <strong>Code:</strong> {place.code}
                  </p>

                  <p>
                    <strong>State:</strong> {place.state}
                  </p>

                  <p>
                    <strong>Agency:</strong> {place.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleApprovePlace(place._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejectPlace(place._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <hr className="my-5" />

          <h3 className="mb-4">Pending Bus Requests</h3>

          {buses.length === 0 ? (
            <p>No pending buses</p>
          ) : (
            buses.map((bus) => (
              <div key={bus._id} className="card mb-3">
                <div className="card-body">
                  <h5>{bus.name}</h5>

                  <p>
                    <strong>Route:</strong> {bus.source?.name} →{" "}
                    {bus.destination?.name}
                  </p>

                  <p>
                    <strong>Bus Type:</strong> {bus.busType}
                  </p>

                  <p>
                    <strong>Seats:</strong> {bus.totalSeats}
                  </p>

                  <p>
                    <strong>Agency:</strong> {bus.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleApproveBus(bus._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejectBus(bus._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <hr className="my-5" />

          <h3 className="mb-4">Pending Hotel Requests</h3>

          {hotels.length === 0 ? (
            <p>No pending hotels</p>
          ) : (
            hotels.map((hotel) => (
              <div key={hotel._id} className="card mb-3">
                <div className="card-body">
                  <h5>{hotel.name}</h5>

                  <p>
                    <strong>Destination:</strong> {hotel.destination?.name}
                  </p>

                  <p>
                    <strong>Address:</strong> {hotel.address}
                  </p>

                  <p>
                    <strong>Rooms:</strong> {hotel.roomTypes?.length}
                  </p>

                  <p>
                    <strong>Agency:</strong> {hotel.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleApproveHotel(hotel._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejectHotel(hotel._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <hr className="my-5" />

          <h3 className="mb-4">Pending Package Requests</h3>

          {packages.length === 0 ? (
            <p>No pending packages</p>
          ) : (
            packages.map((pkg) => (
              <div key={pkg._id} className="card mb-3">
                <div className="card-body">
                  <h5>{pkg.title}</h5>

                  <p>
                    <strong>Destination:</strong> {pkg.destination?.name}
                  </p>

                  <p>
                    <strong>Duration:</strong> {pkg.duration}
                  </p>

                  <p>
                    <strong>Price:</strong> ₹{pkg.price}
                  </p>

                  <p>
                    <strong>Description:</strong> {pkg.description}
                  </p>

                  <p>
                    <strong>Agency:</strong> {pkg.createdBy?.username}
                  </p>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleApprovePackage(pkg._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejectPackage(pkg._id)}
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