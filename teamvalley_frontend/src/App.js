import React from "react"; // Importon React
import { Routes, Route } from "react-router-dom"; // Importon Routes
import NavbarComponent from "./components/NavbarComponent"; // Importon Navbar
import Footer from "./components/Footer"; // Importon Footer
import About from "./pages/About"; // Importon About page
import "./styles/App.css"; // Importon CSS-in kryesor

function App() { // Krijon App
  return ( // Kthen pamjen
    <div className="App"> {/* Wrapper kryesor */}
      <NavbarComponent /> {/* Navbar */}

      <Routes> {/* Krijon rrugët e faqeve */}
        <Route path="/" element={<Home />} /> {/* Kur jemi te / shfaq Home */}
        <Route path="/about" element={<About />} /> {/* Kur jemi te /about shfaq About */}
      </Routes>\
       <Footer /> {/* Footer në çdo faqe */}
    </div>
  ); // Mbyll return
} // Mbyll App

export default App; // Eksporton App