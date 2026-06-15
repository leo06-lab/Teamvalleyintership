import React, { useState } from "react"; // Importon React dhe useState
import { useNavigate } from "react-router-dom"; // Importon navigate për redirect
import "../styles/Auth.css"; // Importon CSS-in e auth

function Login() {
  // Krijon faqen Login
  const navigate = useNavigate(); // Krijon navigimin

  const [role, setRole] = useState("candidate"); // Mban rolin aktiv

  const [candidateData, setCandidateData] = useState({
    // Të dhënat për kandidat
    firstName: "",
    lastName: "",
    password: "",
  });

  const [companyData, setCompanyData] = useState({
    // Të dhënat për kompani
    nipt: "",
    companyName: "",
    password: "",
  });

  const [adminData, setAdminData] = useState({
    // Të dhënat për admin
    email: "",
    password: "",
  });

  const handleCandidateChange = (e) => {
    // Ndryshon inputet e kandidatit
    setCandidateData({
      ...candidateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanyChange = (e) => {
    // Ndryshon inputet e kompanisë
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminChange = (e) => {
    // Ndryshon inputet e adminit
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    // Kur klikohet Login
    e.preventDefault(); // Ndalon refresh-in e faqes

    let loggedUser = null; // Krijon user bosh

    if (role === "candidate") {
      // Nëse është kandidat
      loggedUser = {
        role: "candidate",
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        fullName: `${candidateData.firstName} ${candidateData.lastName}`,
        isLoggedIn: true,
      };
    }

    if (role === "company") {
      // Nëse është kompani
      loggedUser = {
        role: "company",
        nipt: companyData.nipt,
        companyName: companyData.companyName,
        isLoggedIn: true,
      };
    }

    if (role === "admin") {
      // Nëse është admin
      loggedUser = {
        role: "admin",
        email: adminData.email,
        isLoggedIn: true,
      };
    }

    localStorage.setItem("jobvalleyUser", JSON.stringify(loggedUser)); // Ruan user-in për momentin në localStorage

    alert(`Logged in as ${role}`); // Mesazh testues
    if (role === "candidate") navigate("/candidate/dashboard"); // Për momentin e çon te dashboardi i kandidatit
  };

  return (
    // Kthen pamjen
    <main className="auth-page">
      {" "}
      {/* Faqja kryesore auth */}
      <section className="auth-card">
        {" "}
        {/* Karta kryesore */}
        <div className="auth-left">
          {" "}
          {/* Ana e majtë */}
          <span className="auth-label">Welcome Back</span> {/* Label */}
          <h1>Login to your JobValley account</h1> {/* Titulli */}
          <p>
            Select your role and continue with the correct login method.
            Candidates login with name and surname, companies login with NIPT
            and company name.
          </p>
          <div className="auth-info-box">
            {" "}
            {/* Box informues */}
            <h3>Login methods</h3>
            {role === "candidate" && (
              <p>Candidate login uses First Name, Last Name and Password.</p>
            )}
            {role === "company" && (
              <p>
                Company login uses Business NIPT, Company Name and Password.
              </p>
            )}
            {role === "admin" && (
              <p>Admin login is internal and uses Email and Password.</p>
            )}
          </div>
        </div>
        <div className="auth-right">
          {" "}
          {/* Ana e djathtë */}
          <h2>Sign in</h2> {/* Titulli i formës */}
          <div className="role-tabs">
            {" "}
            {/* Butonat dinamik të roleve */}
            <button
              type="button"
              className={role === "candidate" ? "role-tab active" : "role-tab"}
              onClick={() => setRole("candidate")}
            >
              Candidate
            </button>
            <button
              type="button"
              className={role === "company" ? "role-tab active" : "role-tab"}
              onClick={() => setRole("company")}
            >
              Company
            </button>
            <button
              type="button"
              className={role === "admin" ? "role-tab active" : "role-tab"}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            {" "}
            {/* Forma */}
            {role === "candidate" && ( // Forma për kandidat
              <>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={candidateData.firstName}
                    onChange={handleCandidateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={candidateData.lastName}
                    onChange={handleCandidateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={candidateData.password}
                    onChange={handleCandidateChange}
                    required
                  />
                </div>
              </>
            )}
            {role === "company" && ( // Forma për kompani
              <>
                <div className="form-group">
                  <label>Business NIPT</label>
                  <input
                    type="text"
                    name="nipt"
                    placeholder="Enter business NIPT"
                    value={companyData.nipt}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={companyData.companyName}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter company password"
                    value={companyData.password}
                    onChange={handleCompanyChange}
                    required
                  />
                </div>
              </>
            )}
            {role === "admin" && ( // Forma për admin
              <>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter admin email"
                    value={adminData.email}
                    onChange={handleAdminChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter admin password"
                    value={adminData.password}
                    onChange={handleAdminChange}
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" className="auth-submit-btn">
              {" "}
              {/* Butoni dinamik */}
              {role === "candidate" && "Login as Candidate"}
              {role === "company" && "Login as Company"}
              {role === "admin" && "Login as Admin"}
            </button>
          </form>
          <p className="auth-switch">
            {" "}
            {/* Kalim te register */}
            Don’t have an account?{" "}
            <button onClick={() => navigate("/register")}>Register now</button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
