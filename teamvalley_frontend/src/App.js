import React from "react"; // Importon React
import { Routes, Route } from "react-router-dom"; // Importon Routes dhe Route
import NavbarComponent from "./components/NavbarComponent"; // Importon Navbar
import Home from "./pages/Home"; // Importon Home page
import About from "./pages/About"; // Importon About page
import "./styles/App.css"; // Importon CSS-in kryesor

function App() { // Krijon komponentin App
  return ( // Kthen pamjen kryesore
    <div className="App"> {/* Mbështjell gjithë aplikacionin */}
      <NavbarComponent /> {/* Shfaq navbar-in në çdo faqe */}

      <Routes> {/* Krijon rrugët e faqeve */}
        <Route path="/" element={<Home />} /> {/* Kur jemi te / shfaq Home */}
        <Route path="/about" element={<About />} /> {/* Kur jemi te /about shfaq About */}
      </Routes>
    </div>
  ); // Mbyll return
} // Mbyll App

export default App; // Eksporton App