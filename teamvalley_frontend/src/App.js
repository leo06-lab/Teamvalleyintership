import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import CandidateLayout from "./dashboards/candidate/CandidateLayout";
import CandidateDashboard from "./dashboards/candidate/CandidateDashboard";
import CandidateProfile from "./dashboards/candidate/CandidateProfile";
import MySavedJobs from "./dashboards/candidate/MySavedJobs";
import UploadCV from "./dashboards/candidate/UploadCV";
import MyApplications from "./dashboards/candidate/MyApplications";

import CompanyDashboard from "./dashboards/company/CompanyDashboard";
import AdminDashboard from "./dashboards/admin/AdminDashboard";

import RoleRoute from "./components/RoleRoute";

function App() {
  const location = useLocation();

  const hideFooterRoutes = [
    "/admin-dashboard",
    "/company-dashboard",
    "/candidate/dashboard",
    "/candidate/profile",
    "/candidate/saved-jobs",
    "/candidate/upload-cv",
    "/candidate/applications",
  ];

  const hideFooter = hideFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/candidate/*" element={<CandidateLayout />}>
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="saved-jobs" element={<MySavedJobs />} />
          <Route path="upload-cv" element={<UploadCV />} />
          <Route path="applications" element={<MyApplications />} />
        </Route>

        <Route
          path="/company-dashboard"
          element={
            <RoleRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
