import React from "react";
import img1 from "../assets/images1.png";
import img2 from "../assets/images2.png";
import img3 from "../assets/images3.png";
import img4 from "../assets/images4.png";

export default function PromoCarousel() {
  return (
    <div className="d-flex justify-content-center">
      <div className="container w-50">
        <div id="carouselExampleCaptions" className="carousel slide">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={img1} className="d-block w-100" alt="img1" style={{ height: "700px", objectFit: "cover" }}/>
              <div className="carousel-caption d-none d-md-block">
                <h5 style={{color: 'green'}}>Help Us Go Green</h5>
                <p style={{color: 'green'}}>
                  Keep your tickets online to go paper free.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img2} className="d-block w-100" alt="img2" style={{ height: "700px", objectFit: "cover" }}/>
            </div>
            <div className="carousel-item">
              <img src={img3} className="d-block w-100" alt="img3" style={{ height: "700px", objectFit: "cover" }}/>
              <div className="carousel-caption d-none d-md-block">
                <h5 style={{color: 'green'}}>Refer and earn*</h5>
                <p style={{color: 'green'}}>
                  Refer your friends and families and get upto 100 Rs. when they make their first booking.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={img4} className="d-block w-100" alt="img4" style={{ height: "700px", objectFit: "cover" }}/>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                padding: "10px",
              }}
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                padding: "10px",
              }}
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
