import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import CandidateDashboard from "./dashboards/candidate/CandidateDashboard";
import CandidateProfile from "./dashboards/candidate/CandidateProfile";
import UploadCV from "./dashboards/candidate/UploadCV";
import MyApplications from "./dashboards/candidate/MyApplications";
import MySavedJobs from "./dashboards/candidate/MySavedJobs";
import CandidateLayout from "./dashboards/candidate/CandidateLayout";
import NotFound from "./pages/NotFound";

import "./styles/App.css";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/candidate/*" element={<CandidateLayout />}>
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="saved-jobs" element={<MySavedJobs />} />
          <Route path="upload-cv" element={<UploadCV />} />
          <Route path="applications" element={<MyApplications />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!location.pathname.startsWith("/candidate") && <Footer />}
    </div>
  );
}

export default App;
