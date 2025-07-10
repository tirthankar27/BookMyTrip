import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchbus(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "warning");
    }
    if (props.loadingRef?.current) {
      props.loadingRef.current.continuousStart();
      setTimeout(() => {
        props.loadingRef.current.complete();
      }, 100);
    }
  }, [navigate, props.loadingRef]);

  // Dark mode classes with glass morphism effect
  const inputClass = props.darkMode
    ? "form-control bg-dark text-white border-light glass-dark"
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
        <h1 className={`${textClass} mb-4 text-center`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Our Journey Begins Here <br />
          <span className="text-primary">Find Your Perfect Bus!</span>
        </h1>
        
        <div className={`${containerClass} p-4 rounded-3 shadow-lg`} style={{ width: '90%', maxWidth: '800px' }}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>From</label>
              <input 
                type="text" 
                className={`${inputClass}`} 
                placeholder="Departure city" 
                style={{ height: '38px' }}
              />
            </div>
            
            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>To</label>
              <input 
                type="text" 
                className={`${inputClass}`} 
                placeholder="Destination city" 
                style={{ height: '38px' }}
              />
            </div>
            
            <div className="col-md-3">
              <label className={`form-label ${textClass}`}>Date</label>
              <input 
                type="date" 
                className={`${inputClass}`} 
                style={{ height: '38px' }}
              />
            </div>
            
            <div className="col-md-3 d-flex flex-column">
              <label className={`form-label ${textClass} invisible`}>Search</label>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                style={{
                  height: '38px',
                  background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                  border: 'none',
                  fontWeight: '600',
                  padding: '0.375rem 0.75rem' // Standard Bootstrap button padding
                }}
              >
                Search Buses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}