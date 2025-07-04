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
  return (
    <div>
      <h1>About BookMyTrip</h1>
      <p className="fs-5">
        At BookMyTrip, we’re redefining the way you travel. Whether you're
        planning a spontaneous getaway, a business trip, or heading home for the
        holidays, we make bus booking easy, fast, and reliable.
      </p>
      <h2>Why Choose Us?</h2>
      <ul className="fs-5">
        <li>Wide Network: Book buses from trusted operators across India.</li>
        <li>
          Real-Time Availability: Know exactly which seats are free — no
          surprises.
        </li>
        <li>
          Secure Payments: Pay with confidence using our encrypted gateway.
        </li>
        <li>
          User-Friendly Interface: Designed for comfort on desktop and mobile.
        </li>
        <li>24/7 Customer Support: We're here to help, anytime you need us.</li>
      </ul>
      <h2>Our Mission</h2>
      <p className="fs-5">
        To make intercity bus travel affordable, accessible, and hassle-free for
        everyone. With just a few clicks, you can book your ride and enjoy the
        journey ahead.
      </p>
      <h2>Our Vision</h2>
      <p className="fs-5">
        We aim to be India’s most trusted bus booking platform, connecting
        millions of travelers with seamless transportation solutions — one trip
        at a time.
      </p>
    </div>
  );
}
