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
import LoadingBar from "react-top-loading-bar";
import VantaBackground from "./components/VantaBackground";

function App() {
  const apiKey = process.env.REACT_APP_BOOK_MY_TRIP_API;
  const signupEndpoint = process.env.REACT_APP_SIGN_UP;
  const loginEndpoint = process.env.REACT_APP_LOGIN;
  const placeEndpoint = process.env.REACT_APP_PLACE;
  const placesEndpoint = process.env.REACT_APP_PLACES;
  const routeEndpoint = process.env.REACT_APP_ROUTES;
  const busEndpoint = process.env.REACT_APP_BUSES;
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
                element={<About loadingRef={loadingRef} />}
              />
              <Route
                exact
                path="/weather"
                element={<Weather apiKey={apiKey} loadingRef={loadingRef} />}
              />
              <Route
                exact
                path="/"
                element={<Home showAlert={showAlert} loadingRef={loadingRef} />}
              />
              <Route
                exact
                path="/searchbus"
                element={
                  <Searchbus
                    darkMode={darkMode}
                    loadingRef={loadingRef}
                    showAlert={showAlert}
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
              <Route path="/registerbus" element={<RegisterBus placesendpoint={placesEndpoint} busendpoint={busEndpoint} routeendpoint={routeEndpoint} showAlert={showAlert}/>} />
              <Route path="/registerplace" element={<RegisterPlace placeendpoint={placeEndpoint} />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </VantaBackground>
    </BrowserRouter>
  );
}

export default App;
