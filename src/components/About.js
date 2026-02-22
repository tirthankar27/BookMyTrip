import React, { useEffect, useState } from "react";

export default function About(props) {
  const [animatedStats, setAnimatedStats] = useState({
    routes: 0,
    customers: 0,
    cities: 0,
    operators: 0
  });

  useEffect(() => {
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 10);
    }

    // Animate stats on load
    const targets = {
      routes: 5000,
      customers: 2.5,
      cities: 500,
      operators: 250
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        routes: Math.floor(progress * targets.routes),
        customers: (progress * targets.customers).toFixed(1),
        cities: Math.floor(progress * targets.cities),
        operators: Math.floor(progress * targets.operators)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
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

  const cardGradient = {
    background: props.darkMode
      ? "linear-gradient(145deg, rgba(33,37,41,0.9) 0%, rgba(45,50,55,0.9) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background overlay */}
      <div className="about-overlay"></div>

      {/* Animated background elements */}
      <div className="animated-bg-elements">
        <div className="floating-bus"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle-2"></div>
      </div>

      <div className="container py-5 position-relative">
        {/* Hero Section */}
        <div className="text-center mb-5 animate__animated animate__fadeInDown">
          <h1 className="display-3 fw-bold mb-3" style={gradientText}>
            About BookMyTrip
          </h1>
          <div className={`${containerClass} p-4 rounded-4 shadow-lg d-inline-block mx-auto`} style={{ maxWidth: "800px" }}>
            <p className={`fs-4 mb-0 ${textClass}`}>
              Your journey, our passion. We're here to make every trip memorable, 
              comfortable, and hassle-free.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row g-4 mb-5">
          <div className="col-md-3 col-6">
            <div className={`${containerClass} p-4 rounded-4 shadow-lg text-center stat-card`}>
              <div className="stat-icon mb-3">
                <i className="bi bi-signpost-split fs-1 text-primary"></i>
              </div>
              <h3 className={`fw-bold ${textClass} mb-2`}>{animatedStats.routes}+</h3>
              <p className={`${textClass} mb-0 opacity-75`}>Routes</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className={`${containerClass} p-4 rounded-4 shadow-lg text-center stat-card`}>
              <div className="stat-icon mb-3">
                <i className="bi bi-people-fill fs-1 text-success"></i>
              </div>
              <h3 className={`fw-bold ${textClass} mb-2`}>{animatedStats.customers}M+</h3>
              <p className={`${textClass} mb-0 opacity-75`}>Happy Customers</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className={`${containerClass} p-4 rounded-4 shadow-lg text-center stat-card`}>
              <div className="stat-icon mb-3">
                <i className="bi bi-building fs-1 text-warning"></i>
              </div>
              <h3 className={`fw-bold ${textClass} mb-2`}>{animatedStats.cities}+</h3>
              <p className={`${textClass} mb-0 opacity-75`}>Cities</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className={`${containerClass} p-4 rounded-4 shadow-lg text-center stat-card`}>
              <div className="stat-icon mb-3">
                <i className="bi bi-truck-front fs-1 text-info"></i>
              </div>
              <h3 className={`fw-bold ${textClass} mb-2`}>{animatedStats.operators}+</h3>
              <p className={`${textClass} mb-0 opacity-75`}>Operators</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us - Enhanced */}
        <div className={`${containerClass} p-5 rounded-4 shadow-lg mb-5 feature-section`}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 mb-4" style={gradientText}>Why Choose Us?</h2>
              <div className="feature-list">
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3">
                    <i className="bi bi-diagram-3 fs-3 text-primary"></i>
                  </div>
                  <div>
                    <h4 className={`${textClass} mb-2`}>Wide Network</h4>
                    <p className={`${textClass} opacity-75 mb-0`}>
                      Book buses from trusted operators across India with our extensive network.
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3">
                    <i className="bi bi-clock-history fs-3 text-success"></i>
                  </div>
                  <div>
                    <h4 className={`${textClass} mb-2`}>Real-Time Availability</h4>
                    <p className={`${textClass} opacity-75 mb-0`}>
                      Know exactly which seats are free — no surprises, instant confirmation.
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3">
                    <i className="bi bi-shield-lock fs-3 text-warning"></i>
                  </div>
                  <div>
                    <h4 className={`${textClass} mb-2`}>Secure Payments</h4>
                    <p className={`${textClass} opacity-75 mb-0`}>
                      Pay with confidence using our encrypted payment gateway.
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon me-3">
                    <i className="bi bi-phone fs-3 text-info"></i>
                  </div>
                  <div>
                    <h4 className={`${textClass} mb-2`}>User-Friendly Interface</h4>
                    <p className={`${textClass} opacity-75 mb-0`}>
                      Designed for comfort on desktop and mobile devices.
                    </p>
                  </div>
                </div>
                <div className="feature-item d-flex align-items-start">
                  <div className="feature-icon me-3">
                    <i className="bi bi-headset fs-3 text-danger"></i>
                  </div>
                  <div>
                    <h4 className={`${textClass} mb-2`}>24/7 Customer Support</h4>
                    <p className={`${textClass} opacity-75 mb-0`}>
                      We're here to help, anytime you need us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="feature-showcase p-4 rounded-4" style={cardGradient}>
                <img 
                  src="https://via.placeholder.com/500x400/3a7bd5/ffffff?text=BookMyTrip+App" 
                  alt="BookMyTrip App Preview"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className={`${containerClass} p-5 rounded-4 shadow-lg h-100 mission-card`}>
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3">
                  <i className="bi bi-rocket fs-2 text-primary"></i>
                </div>
                <h2 className="mb-0" style={gradientText}>Our Mission</h2>
              </div>
              <p className={`fs-5 ${textClass} mb-4`}>
                To make intercity bus travel affordable, accessible, and hassle-free for
                everyone. With just a few clicks, you can book your ride and enjoy the
                journey ahead.
              </p>
              <div className="mission-stats">
                <div className="d-flex justify-content-between mb-2">
                  <span className={textClass}>Coverage</span>
                  <span className="text-primary">95%</span>
                </div>
                <div className="progress mb-3" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: "95%",
                      background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)"
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className={textClass}>Satisfaction</span>
                  <span className="text-success">98%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className={`${containerClass} p-5 rounded-4 shadow-lg h-100 vision-card`}>
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3">
                  <i className="bi bi-eye fs-2 text-info"></i>
                </div>
                <h2 className="mb-0" style={gradientText}>Our Vision</h2>
              </div>
              <p className={`fs-5 ${textClass} mb-4`}>
                We aim to be India's most trusted bus booking platform, connecting
                millions of travelers with seamless transportation solutions — one trip
                at a time.
              </p>
              <div className="vision-timeline">
                <div className="timeline-item d-flex align-items-center mb-3">
                  <div className="timeline-dot me-3"></div>
                  <span className={textClass}>2024: 500+ Cities</span>
                </div>
                <div className="timeline-item d-flex align-items-center mb-3">
                  <div className="timeline-dot me-3"></div>
                  <span className={textClass}>2025: 1000+ Routes</span>
                </div>
                <div className="timeline-item d-flex align-items-center mb-3">
                  <div className="timeline-dot me-3"></div>
                  <span className={textClass}>2026: International Expansion</span>
                </div>
                <div className="timeline-item d-flex align-items-center">
                  <div className="timeline-dot me-3"></div>
                  <span className={textClass}>2027: 10M+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={`${containerClass} p-5 rounded-4 shadow-lg mb-5`}>
          <h2 className="display-5 mb-5 text-center" style={gradientText}>Our Leadership Team</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="team-card text-center">
                <div className="team-image mb-3">
                  <img 
                    src="https://via.placeholder.com/150/3a7bd5/ffffff?text=CEO" 
                    alt="CEO"
                    className="rounded-circle shadow-lg"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </div>
                <h4 className={textClass}>John Doe</h4>
                <p className="text-primary mb-2">CEO & Founder</p>
                <div className="social-links">
                  <a href="#" className="text-primary me-2"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-primary me-2"><i className="bi bi-twitter-x"></i></a>
                  <a href="#" className="text-primary"><i className="bi bi-envelope"></i></a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="team-card text-center">
                <div className="team-image mb-3">
                  <img 
                    src="https://via.placeholder.com/150/00d2ff/ffffff?text=CTO" 
                    alt="CTO"
                    className="rounded-circle shadow-lg"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </div>
                <h4 className={textClass}>Jane Smith</h4>
                <p className="text-primary mb-2">CTO</p>
                <div className="social-links">
                  <a href="#" className="text-primary me-2"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-primary me-2"><i className="bi bi-twitter-x"></i></a>
                  <a href="#" className="text-primary"><i className="bi bi-envelope"></i></a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="team-card text-center">
                <div className="team-image mb-3">
                  <img 
                    src="https://via.placeholder.com/150/3a7bd5/ffffff?text=COO" 
                    alt="COO"
                    className="rounded-circle shadow-lg"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </div>
                <h4 className={textClass}>Mike Johnson</h4>
                <p className="text-primary mb-2">COO</p>
                <div className="social-links">
                  <a href="#" className="text-primary me-2"><i className="bi bi-linkedin"></i></a>
                  <a href="#" className="text-primary me-2"><i className="bi bi-twitter-x"></i></a>
                  <a href="#" className="text-primary"><i className="bi bi-envelope"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className={`${containerClass} p-5 rounded-4 shadow-lg`}>
          <h2 className="display-5 mb-5 text-center" style={gradientText}>What Our Customers Say</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="testimonial-card p-4 rounded-4" style={cardGradient}>
                <div className="stars mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className={`${textClass} mb-3`}>
                  "BookMyTrip made my journey so easy! Found the perfect bus in seconds and the booking was seamless."
                </p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://via.placeholder.com/50/3a7bd5/ffffff?text=R" 
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className={`${textClass} mb-0`">Rahul Sharma</h6>
                    <small className="text-primary">Mumbai</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card p-4 rounded-4" style={cardGradient}>
                <div className="stars mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className={`${textClass} mb-3`}>
                  "Great service! The real-time seat availability saved me from last-minute hassles."
                </p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://via.placeholder.com/50/00d2ff/ffffff?text=P" 
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className={`${textClass} mb-0`}>Priya Patel</h6>
                    <small className="text-primary">Delhi</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card p-4 rounded-4" style={cardGradient}>
                <div className="stars mb-3">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>
                <p className={`${textClass} mb-3`}>
                  "The customer support is outstanding! They helped me rebook when my plans changed."
                </p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://via.placeholder.com/50/3a7bd5/ffffff?text=A" 
                    alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className={`${textClass} mb-0`}>Arun Kumar</h6>
                    <small className="text-primary">Bangalore</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${props.darkMode 
            ? "radial-gradient(circle at 10% 20%, rgba(58, 123, 213, 0.1) 0%, rgba(0, 0, 0, 0.9) 90%)"
            : "radial-gradient(circle at 10% 20%, rgba(58, 123, 213, 0.1) 0%, rgba(255, 255, 255, 0.9) 90%)"};
          z-index: -1;
        }

        .animated-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .floating-bus {
          position: absolute;
          top: 10%;
          right: 5%;
          width: 100px;
          height: 100px;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233a7bd5" opacity="0.1"><path d="M4 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2H4zm13.5-2c.83 0 1.5-.67 1.5-1.5V9c0-.69-.42-1.29-1-1.58V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h13.5zM18 9h-2V7h2v2z"/></svg>') no-repeat center;
          background-size: contain;
          animation: float 20s infinite linear;
        }

        .floating-circle {
          position: absolute;
          bottom: 20%;
          left: 10%;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          opacity: 0.1;
          animation: pulse 4s ease-in-out infinite;
        }

        .floating-circle-2 {
          position: absolute;
          top: 30%;
          left: 20%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          opacity: 0.05;
          animation: pulse 6s ease-in-out infinite reverse;
        }

        @keyframes float {
          from { transform: translateX(0) rotate(0deg); }
          to { transform: translateX(-100vw) rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.15; }
        }

        .stat-card {
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(58, 123, 213, 0.3) !important;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          color: white;
        }

        .feature-item {
          transition: transform 0.2s ease;
        }

        .feature-item:hover {
          transform: translateX(10px);
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          position: relative;
        }

        .timeline-dot::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: inherit;
          opacity: 0.3;
          top: -4px;
          left: -4px;
          animation: ripple 2s infinite;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .team-card {
          transition: all 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-5px);
        }

        .team-image img {
          transition: all 0.3s ease;
          border: 3px solid transparent;
          background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          padding: 3px;
        }

        .team-card:hover img {
          transform: scale(1.05);
        }

        .testimonial-card {
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(58, 123, 213, 0.2) !important;
        }

        .social-links a {
          transition: all 0.2s ease;
          opacity: 0.7;
        }

        .social-links a:hover {
          opacity: 1;
          transform: scale(1.2);
        }

        .progress {
          background-color: ${props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-bar {
          transition: width 1s ease;
        }

        /* Animations */
        .animate__fadeInDown {
          animation: fadeInDown 1s ease;
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
      `}</style>
    </div>
  );
}