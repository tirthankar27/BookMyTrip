import React, { useState } from "react";
import RegisterPlace from "./RegisterPlace";
import RegisterBus from "./RegisterBus";
import RegisterPackage from "./RegisterPackage";
import RegisterHotel from "./RegisterHotel";
import { FaMapMarkerAlt, FaBus, FaBoxOpen, FaHotel } from "react-icons/fa";

export default function AgencyPortal(props) {
  const [activeTab, setActiveTab] = useState("place");

  const containerClass = props.darkMode
    ? "glass-container-dark"
    : "glass-container-light";

  return (
    <div className="container py-5">
      <h1
        className="text-center fw-bold agency-title"
        style={{
          fontSize: "4rem",
          background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Agency Portal
      </h1>

      <p
        className="text-center mb-4 agency-subtitle"
        style={{
          color: "#6c757d",
          fontSize: "1.3rem",
        }}
      >
        Manage and register all your services in one place
      </p>

      {/* Segmented Control */}
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto 50px auto",
          background: props.darkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(15px)",
          borderRadius: "60px",
          overflow: "hidden",
          boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left:
              activeTab === "place"
                ? "0%"
                : activeTab === "bus"
                  ? "25%"
                  : activeTab === "package"
                    ? "50%"
                    : "75%",

            width: "25%",
            height: "100%",

            background: "linear-gradient(135deg,#3a7bd5,#00d2ff)",

            borderRadius: "60px",

            boxShadow: "0 12px 25px rgba(58,123,213,.35)",

            transition: "all .35s ease",
          }}
        />

        {[
          {
            key: "place",
            icon: <FaMapMarkerAlt />,
            label: "Place",
          },
          {
            key: "bus",
            icon: <FaBus />,
            label: "Bus",
          },
          {
            key: "package",
            icon: <FaBoxOpen />,
            label: "Package",
          },
          {
            key: "hotel",
            icon: <FaHotel />,
            label: "Hotel",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              height: "80px",
              border: "none",
              background: "transparent",

              position: "relative",
              zIndex: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",

              fontSize: "1.4rem",
              fontWeight: "600",

              color: activeTab === tab.key ? "white" : "#0d6efd",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div
        className={`${containerClass}
            rounded-5
            shadow-lg
            p-5`}
      >
        {activeTab === "place" && <RegisterPlace {...props} />}

        {activeTab === "bus" && <RegisterBus {...props} />}

        {activeTab === "package" && <RegisterPackage {...props} />}

        {activeTab === "hotel" && <RegisterHotel {...props} />}
      </div>
    </div>
  );
}
