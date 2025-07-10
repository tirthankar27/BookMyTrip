import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = [
    { path: "/registerbus", text: "Register Bus" },
    { path: "/registerplace", text: "Register Place" },
    { path: "/about", text: "About Us" },
    { path: "/terms", text: "Terms of Service" },
    { path: "/privacy", text: "Privacy Policy" },
    { path: "/contact", text: "Contact Us" }
  ];

  return (
    <footer className="glass-container-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h5 className="text-gradient-blue mb-3">Quick Links</h5>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
              {footerLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.path}
                  className="text-white text-decoration-none hover-underline"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="col-md-6 text-center text-md-end">
            <h5 className="text-gradient-blue mb-3">Connect With Us</h5>
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://facebook.com" className="text-white">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="https://twitter.com" className="text-white">
                <i className="bi bi-twitter-x fs-4"></i>
              </a>
              <a href="https://instagram.com" className="text-white">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="mailto:tirthankarghosh4@gmail.com" className="text-white">
                <i className="bi bi-envelope fs-4"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        
        <div className="text-center">
          <p className="mb-1">
            &copy; 2025 BookMyTrip Inc. All rights reserved.
          </p>
          <small className="text-muted">
            Designed with ❤️ for hassle-free travel
          </small>
        </div>
      </div>
    </footer>
  );
}