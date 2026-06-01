import React from "react"; // Importon React
import { Routes, Route } from "react-router-dom"; // Importon Routes
import NavbarComponent from "./components/NavbarComponent"; // Importon Navbar
import Footer from "./components/Footer"; // Importon Footer
import Home from "./pages/Home"; // Importon Home
import About from "./pages/About"; // Importon About
import Jobs from "./pages/Jobs"; // Importon Jobs
import JobDetails from "./pages/JobDetails"; // Importon Job Details
import Login from "./pages/Login"; // Importon Login
import Register from "./pages/Register"; // Importon Register
import NotFound from "./pages/NotFound"; // Importon NotFound
import "./styles/App.css"; // Importon CSS kryesor

function App() { // Krijon App
  return ( // Kthen pamjen
    <div className="App"> {/* Wrapper kryesor */}
      <NavbarComponent /> {/* Navbar */}

      <Routes> {/* Rrugët e aplikacionit */}
        <Route path="/" element={<Home />} /> {/* Home */}
        <Route path="/about" element={<About />} /> {/* About */}
        <Route path="/jobs" element={<Jobs />} /> {/* Find a Job */}
        <Route path="/jobs/:id" element={<JobDetails />} /> {/* Job Details */}
        <Route path="/login" element={<Login />} /> {/* Login */}
        <Route path="/register" element={<Register />} /> {/* Register */}

        <Route path="*" element={<NotFound />} /> {/* Çdo route gabim shkon te 404 */}
      </Routes>

      <Footer /> {/* Footer */}
    </div>
  ); // Mbyll return
} // Mbyll App

export default App; // Eksporton App