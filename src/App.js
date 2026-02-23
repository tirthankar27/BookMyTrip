import React, { useState, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Searchbus from "./components/Searchbus";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import About from "./components/About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Weather from "./components/Weather";
import RegisterBus from "./components/RegisterBus";
import RegisterPlace from "./components/RegisterPlace";
import BusResult from "./components/BusResult";
import Passenger from "./components/Passenger";
import Payment from "./components/Payment";
import LoadingBar from "react-top-loading-bar";
import VantaBackground from "./components/VantaBackground";
import Confirmation from "./components/Confirmation";
import Tickets from "./components/Tickets";
import TicketDetails from "./components/TicketDetails";

function App() {
  const apiKey = process.env.REACT_APP_BOOK_MY_TRIP_API;
  const signupEndpoint = process.env.REACT_APP_SIGN_UP;
  const loginEndpoint = process.env.REACT_APP_LOGIN;
  const placeEndpoint = process.env.REACT_APP_PLACE;
  const placesEndpoint = process.env.REACT_APP_PLACES;
  const routeEndpoint = process.env.REACT_APP_ROUTES;
  const busEndpoint = process.env.REACT_APP_BUS;
  const busesEndpoint = process.env.REACT_APP_BUSES;
  const bus = process.env.REACT_APP_FETCH_BUS;
  const seatEndPoint = process.env.REACT_APP_SEATS;
  const bookingEndPoint = process.env.REACT_APP_BOOKING;
  const fetchBooking = process.env.REACT_APP_FETCH;
  const deleteBooking = process.env.REACT_APP_DELETE;
  const placeName = process.env.REACT_APP_PLACENAME;
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const loadingRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <BrowserRouter basename="/BookMyTrip">
      {/* VantaBackground now wraps everything */}
      <VantaBackground darkMode={darkMode}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            color: darkMode ? "white" : "black",
          }}
        >
          <Navbar
            title="BookMyTrip"
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            username={username}
            setUsername={setUsername}
          />
          <LoadingBar color="#76B947" ref={loadingRef} />
          <Alert darkMode={darkMode} alert={alert} />

          <div
            className="container my-3"
            style={{ flex: 1, paddingTop: "120px" }}
          >
            <Routes>
              <Route
                exact
                path="/about"
                element={<About darkMode={darkMode} loadingRef={loadingRef} />}
              />
              <Route
                exact
                path="/weather"
                element={<Weather apiKey={apiKey} loadingRef={loadingRef} />}
              />
              <Route
                exact
                path="/"
                element={
                  <Home
                    showAlert={showAlert}
                    darkMode={darkMode}
                    loadingRef={loadingRef}
                  />
                }
              />
              <Route
                exact
                path="/searchbus"
                element={
                  <Searchbus
                    darkMode={darkMode}
                    loadingRef={loadingRef}
                    showAlert={showAlert}
                    busesendpoint={busesEndpoint}
                    placesendpoint={placesEndpoint}
                  />
                }
              />
              <Route
                exact
                path="/login"
                element={
                  <Login
                    darkMode={darkMode}
                    loginendpoint={loginEndpoint}
                    loadingRef={loadingRef}
                    showAlert={showAlert}
                    setUsername={setUsername}
                  />
                }
              />
              <Route
                exact
                path="/signup"
                element={
                  <SignUp
                    darkMode={darkMode}
                    signupendpoint={signupEndpoint}
                    loadingRef={loadingRef}
                    showAlert={showAlert}
                  />
                }
              />
              <Route
                path="/registerbus"
                element={
                  <RegisterBus
                    darkMode={darkMode}
                    placesendpoint={placesEndpoint}
                    busendpoint={busEndpoint}
                    routeendpoint={routeEndpoint}
                    showAlert={showAlert}
                  />
                }
              />
              <Route
                path="/registerplace"
                element={
                  <RegisterPlace
                    darkMode={darkMode}
                    placeendpoint={placeEndpoint}
                    showAlert={showAlert}
                  />
                }
              />
              <Route
                path="/searchresults"
                element={
                  <BusResult
                    darkMode={darkMode}
                    busesendpoint={busesEndpoint}
                    placesendpoint={placesEndpoint}
                  />
                }
              />
              <Route
                path="/enterdetails"
                element={
                  <Passenger darkMode={darkMode} seatsendpoint={seatEndPoint} />
                }
              />
              <Route
                path="/ticket"
                element={
                  <Tickets
                    darkMode={darkMode}
                    getbus={bus}
                    fetchBooking={fetchBooking}
                    deletebooking={deleteBooking}
                    loadingRef={loadingRef}
                    placename={placeName}
                    showAlert={showAlert}
                  />
                }
              />
              <Route path="/ticket-details/:id" element={<TicketDetails darkMode={darkMode} />} />
              <Route
                path="/payment"
                element={
                  <Payment
                    darkMode={darkMode}
                    bookingendpoint={bookingEndPoint}
                    placename={placeName}
                  />
                }
              />
              <Route
                path="/confirmation"
                element={
                  <Confirmation darkMode={darkMode} placename={placeName} />
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </VantaBackground>
    </BrowserRouter>
  );
}

export default App;
