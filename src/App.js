import React, { useState, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Searchbus from "./components/Searchbus";
import PromoCarousel from "./components/PromoCarousel";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import About from "./components/About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Weather from "./components/Weather";
import LoadingBar from "react-top-loading-bar";

function App() {
  const apiKey = process.env.REACT_APP_BOOK_MY_TRIP_API;
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const loadingRef = useRef(null)
  return (
    <BrowserRouter basename="/BookMyTrip">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: darkMode ? "#212529" : "#f8f9fa",
          color: darkMode ? "white" : "black",
          minHeight: "100vh",
        }}
      >
        <Navbar
          title="BookMyTrip"
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
       <LoadingBar color="#76B947" ref={loadingRef} />
        <Alert darkMode={darkMode} />
        <div className="container my-3" style={{ flex: 1 }}>
          <Routes>
            <Route exact path="/about" element={<About loadingRef={loadingRef} />}/>
            <Route exact path="/weather" element={<Weather apiKey={apiKey} loadingRef={loadingRef}/>}/>
            <Route exact path="/" element={<><Searchbus darkMode={darkMode} loadingRef={loadingRef}/> <PromoCarousel /></>}/>
            <Route exact path='/login' element={<Login darkMode={darkMode} loadingRef={loadingRef}/>}/>
            <Route exact path='/signup' element={<SignUp darkMode={darkMode} loadingRef={loadingRef}/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
