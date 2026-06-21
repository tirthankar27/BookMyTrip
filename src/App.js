import React, { useState, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Searchbus from "./components/Searchbus";
import SearchHotel from "./components/SearchHotel";
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
import HotelResults from "./components/HotelResults";
import HotelDetails from "./components/HotelDetails";
import Passenger from "./components/Passenger";
import Payment from "./components/Payment";
import LoadingBar from "react-top-loading-bar";
import VantaBackground from "./components/VantaBackground";
import Confirmation from "./components/Confirmation";
import Tickets from "./components/Tickets";
import TicketDetails from "./components/TicketDetails";
import AdminDashboard from "./components/AdminDashboard";
import RegisterPackage from "./components/RegisterPackage";
import Packages from "./components/Packages";
import PackageDetails from "./components/PackageDetails";
import AgencyPortal from "./components/AgencyPortal";
import ChatAssistant from "./components/ChatAssistant";

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
  const cancelSeat = process.env.REACT_APP_CANCEL_SEAT;
  const placeName = process.env.REACT_APP_PLACENAME;
  const pendingPlaces = process.env.REACT_APP_PENDING_PLACES;
  const pendingBuses = process.env.REACT_APP_PENDING_BUSES;
  const approvePlace = process.env.REACT_APP_APPROVE_PLACE;
  const rejectPlace = process.env.REACT_APP_REJECT_PLACE;
  const approveBus = process.env.REACT_APP_APPROVE_BUS;
  const rejectBus = process.env.REACT_APP_REJECT_BUS;
  const packageEndpoint = process.env.REACT_APP_PACKAGE;
  const packagesEndpoint = process.env.REACT_APP_PACKAGES;
  const pendingPackages = process.env.REACT_APP_PENDING_PACKAGES;
  const approvePackage = process.env.REACT_APP_APPROVE_PACKAGE;
  const rejectPackage = process.env.REACT_APP_REJECT_PACKAGE;
  const packageDetailsEndpoint = process.env.REACT_APP_PACKAGE_DETAILS;
  const hotelEndpoint = process.env.REACT_APP_HOTEL;
  const hotelsEndpoint = process.env.REACT_APP_HOTELS;
  const hotelDetailsEndpoint = process.env.REACT_APP_HOTEL_DETAILS;
  const pendingHotels = process.env.REACT_APP_PENDING_HOTELS;
  const approveHotel = process.env.REACT_APP_APPROVE_HOTEL;
  const rejectHotel = process.env.REACT_APP_REJECT_HOTEL;
  const hotelBookingEndpoint=process.env.REACT_APP_HOTEL_BOOKING
  const aiChatEndpoint = process.env.REACT_APP_AI_CHAT;

  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const loadingRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));

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
            role={role}
            setRole={setRole}
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
                path="/admin"
                element={
                  <AdminDashboard
                    darkMode={darkMode}
                    showAlert={showAlert}
                    loadingRef={loadingRef}
                    pendingPlaces={pendingPlaces}
                    pendingBuses={pendingBuses}
                    approvePlace={approvePlace}
                    rejectPlace={rejectPlace}
                    approveBus={approveBus}
                    rejectBus={rejectBus}
                    pendingPackages={pendingPackages}
                    approvePackage={approvePackage}
                    rejectPackage={rejectPackage}
                    pendingHotels={pendingHotels}
                    approveHotel={approveHotel}
                    rejectHotel={rejectHotel}
                  />
                }
              />
              <Route
                path="/agency"
                element={
                  <AgencyPortal
                    darkMode={darkMode}
                    showAlert={showAlert}
                    placeendpoint={placeEndpoint}
                    placesendpoint={placesEndpoint}
                    busendpoint={busEndpoint}
                    routeendpoint={routeEndpoint}
                    packageEndpoint={packageEndpoint}
                    hotelEndpoint={hotelEndpoint}
                  />
                }
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
                path="/searchhotel"
                element={
                  <SearchHotel
                    darkMode={darkMode}
                    loadingRef={loadingRef}
                    showAlert={showAlert}
                    hotelsendpoint={hotelsEndpoint}
                    placesendpoint={placesEndpoint}

                  />
                }
              />
              <Route
                path="/hotelresults"
                element={
                  <HotelResults
                    darkMode={darkMode}
                    showAlert={showAlert}
                  />
                }
              />
              <Route
                path="/hotel/:id"
                element={
                  <HotelDetails
                    darkMode={darkMode}
                    showAlert={showAlert}
                    hotelBookingEndpoint={
                      process.env.REACT_APP_HOTEL_BOOKING
                    }
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
                    setRole={setRole}
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
                path="/registerpackage"
                element={
                  <RegisterPackage
                    darkMode={darkMode}
                    packageEndpoint={packageEndpoint}
                    placesendpoint={placesEndpoint}
                    showAlert={showAlert}
                  />
                }
              />

              <Route
                path="/packages"
                element={
                  <Packages
                    darkMode={darkMode}
                    packagesEndpoint={packagesEndpoint}
                  />
                }
              />
              <Route
                path="/package/:id"
                element={
                  <PackageDetails
                    darkMode={darkMode}
                    packageDetailsEndpoint={packageDetailsEndpoint}
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
                    deleteselectedseat={cancelSeat}
                    loadingRef={loadingRef}
                    placename={placeName}
                    showAlert={showAlert}
                  />
                }
              />
              <Route
                path="/ticket-details/:id"
                element={<TicketDetails darkMode={darkMode} />}
              />
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
          <ChatAssistant chatEndpoint={aiChatEndpoint} />
          <Footer />
        </div>
      </VantaBackground>
    </BrowserRouter>
  );
}

export default App;
