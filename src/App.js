import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Searchbus from "./components/Searchbus";
import PromoCarousel from "./components/PromoCarousel";
import Footer from "./components/Footer";
import Alert from "./components/Alert";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  let myStyle = {};
  return (
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
      <Alert darkMode={darkMode}/>
      <Searchbus darkMode={darkMode} />
      <PromoCarousel />
      <Footer />
    </div>
  );
}

export default App;
