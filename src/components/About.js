import React, { useEffect } from "react";

export default function About(props) {
  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }
  }, [props.loadingRef]);

  // Dark mode classes with glass morphism effect
  const containerClass = props.darkMode 
    ? "glass-container-dark"
    : "glass-container-light";

  const textClass = props.darkMode 
    ? "text-white" 
    : "text-dark";

  const gradientText = {
    background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Background overlay */}
      <div className="about-overlay"></div>

      <div className="container py-5">
        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg mb-5`}>
          <h1 className="display-4 mb-4" style={gradientText}>
            About BookMyTrip
          </h1>
          <p className={`fs-4 mb-4 ${textClass}`}>
            At BookMyTrip, we're redefining the way you travel. Whether you're
            planning a spontaneous getaway, a business trip, or heading home for the
            holidays, we make bus booking easy, fast, and reliable.
          </p>
        </div>

        <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg mb-5`}>
          <h2 className="mb-4" style={gradientText}>Why Choose Us?</h2>
          <ul className={`fs-5 ${textClass}`}>
            <li className="mb-2">Wide Network: Book buses from trusted operators across India.</li>
            <li className="mb-2">
              Real-Time Availability: Know exactly which seats are free — no
              surprises.
            </li>
            <li className="mb-2">
              Secure Payments: Pay with confidence using our encrypted gateway.
            </li>
            <li className="mb-2">
              User-Friendly Interface: Designed for comfort on desktop and mobile.
            </li>
            <li>24/7 Customer Support: We're here to help, anytime you need us.</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg h-100`}>
              <h2 className="mb-4" style={gradientText}>Our Mission</h2>
              <p className={`fs-5 ${textClass}`}>
                To make intercity bus travel affordable, accessible, and hassle-free for
                everyone. With just a few clicks, you can book your ride and enjoy the
                journey ahead.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`${containerClass} p-4 p-md-5 rounded-4 shadow-lg h-100`}>
              <h2 className="mb-4" style={gradientText}>Our Vision</h2>
              <p className={`fs-5 ${textClass}`}>
                We aim to be India's most trusted bus booking platform, connecting
                millions of travelers with seamless transportation solutions — one trip
                at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}