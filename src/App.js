import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Searchbus from "./components/Searchbus";
import PromoCarousel from "./components/PromoCarousel";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import About from "./components/About";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  return (
    <BrowserRouter basename="/BookMyTrip">
      <div
        style={{
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
        <Alert darkMode={darkMode} />
        <div className="container my-3">
          <Routes>
            <Route exact path="/about" element={<About />}/>
            <Route exact path="/" element={<><Searchbus darkMode={darkMode} /> <PromoCarousel /></>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
