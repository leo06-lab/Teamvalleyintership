import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInlineMessage } from "../hooks/useInlineMessage";
import "../styles/Auth.css";
import InlineMessage from "../components/InlineMessage";

function Register() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/auth";

  const [activeRole, setActiveRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const { message, showMessage } = useInlineMessage();

  const [candidateData, setCandidateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    nipt: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleCandidateChange = (e) => {
    setCandidateData({
      ...candidateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanyChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCandidateRegister = async (e) => {
    e.preventDefault();

    if (
      candidateData.firstName.trim() === "" ||
      candidateData.lastName.trim() === "" ||
      candidateData.email.trim() === "" ||
      candidateData.phone.trim() === "" ||
      candidateData.password.trim() === "" ||
      candidateData.confirmPassword.trim() === ""
    ) {
      showMessage("Please fill all candidate fields.", "error");
      return;
    }

    if (candidateData.password !== candidateData.confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register/candidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Candidate registration failed.", "error");
        setLoading(false);
        return;
      }

      setLoading(false);
      showMessage("Candidate registered successfully.", "success");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running.", "error");
    }
  };

  const handleCompanyRegister = async (e) => {
    e.preventDefault();

    if (
      companyData.companyName.trim() === "" ||
      companyData.nipt.trim() === "" ||
      companyData.email.trim() === "" ||
      companyData.phone.trim() === "" ||
      companyData.password.trim() === "" ||
      companyData.confirmPassword.trim() === ""
    ) {
      showMessage("Please fill all company fields.", "error");
      return;
    }

    if (companyData.password !== companyData.confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Company registration failed.", "error");
        setLoading(false);
        return;
      }

      setLoading(false);
      showMessage("Company registered successfully.", "success");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running.", "error");
    }
  };

  return (
    <main className="auth-mongo-page">
      <section className="auth-mongo-left">
        <div className="auth-mongo-brand">
          <span className="auth-mongo-logo-icon">✓</span>
          <h2>JobValley</h2>
        </div>
        <InlineMessage message={message} />

        <div className="auth-mongo-box auth-register-mongo-box">
          <h1>Create your account</h1>
          <p className="auth-mongo-signup">
            Already have an account? <Link to="/login">Log In</Link>
          </p>

          <div className="auth-register-role-tabs">
            <button
              type="button"
              className={activeRole === "candidate" ? "active-register-role" : ""}
              onClick={() => setActiveRole("candidate")}
            >
              Candidate
            </button>
            <button
              type="button"
              className={activeRole === "company" ? "active-register-role" : ""}
              onClick={() => setActiveRole("company")}
            >
              Company
            </button>
          </div>

          {activeRole === "candidate" && (
            <form className="auth-mongo-form" onSubmit={handleCandidateRegister}>
              <div className="auth-register-row">
                <div className="auth-mongo-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={candidateData.firstName}
                    onChange={handleCandidateChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="auth-mongo-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={candidateData.lastName}
                    onChange={handleCandidateChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="auth-mongo-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={candidateData.email}
                  onChange={handleCandidateChange}
                  placeholder="candidate@email.com"
                />
              </div>

              <div className="auth-mongo-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={candidateData.phone}
                  onChange={handleCandidateChange}
                  placeholder="+355 69 123 4567"
                />
              </div>

              <div className="auth-register-row">
                <div className="auth-mongo-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={candidateData.password}
                    onChange={handleCandidateChange}
                    placeholder="Enter password"
                  />
                </div>

                <div className="auth-mongo-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={candidateData.confirmPassword}
                    onChange={handleCandidateChange}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-mongo-next-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up as Candidate"}
              </button>
            </form>
          )}

          {activeRole === "company" && (
            <form className="auth-mongo-form" onSubmit={handleCompanyRegister}>
              <div className="auth-mongo-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleCompanyChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="auth-register-row">
                <div className="auth-mongo-group">
                  <label>NIPT</label>
                  <input
                    type="text"
                    name="nipt"
                    value={companyData.nipt}
                    onChange={handleCompanyChange}
                    placeholder="L12345678A"
                  />
                </div>

                <div className="auth-mongo-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyChange}
                    placeholder="+355 69 123 4567"
                  />
                </div>
              </div>

              <div className="auth-mongo-group">
                <label>Company Email</label>
                <input
                  type="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleCompanyChange}
                  placeholder="company@email.com"
                />
              </div>

              <div className="auth-register-row">
                <div className="auth-mongo-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={companyData.password}
                    onChange={handleCompanyChange}
                    placeholder="Enter password"
                  />
                </div>

                <div className="auth-mongo-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={companyData.confirmPassword}
                    onChange={handleCompanyChange}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-mongo-next-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up as Company"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="auth-mongo-right">
        <div className="auth-mongo-right-content">
          <h2>Start your journey with JobValley</h2>
          <p>
            Create an account as a candidate to apply for jobs, or register your
            company to publish opportunities and manage applications.
          </p>
          <Link to="/login">Already registered? Log in →</Link>
        </div>

        <div className="auth-mongo-shape auth-mongo-shape-one"></div>
        <div className="auth-mongo-shape auth-mongo-shape-two"></div>
        <div className="auth-mongo-star">✦</div>
      </section>
    </main>
  );
}

export default Register;
