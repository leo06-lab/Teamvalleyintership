import React, { useState } from "react"; // Importon React dhe useState
import { useNavigate } from "react-router-dom"; // Importon navigate
import "../styles/Auth.css"; // Importon CSS-in
import axios from "axios";
import { Alert } from "react-bootstrap";

function Register() {
  // Krijon faqen Register
  const navigate = useNavigate(); // Krijon navigimin
  const [role, setRole] = useState("candidate");
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: role,
      });

      setSuccessMessage("Registered successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-left">
          <span className="auth-label">Create Account</span>

          <h1>Join JobValley and start your journey</h1>

          <p>
            Register as a candidate to apply for jobs or as a company to publish
            opportunities.
          </p>

          <div className="auth-info-box">
            <h3>Register roles</h3>

            {role === "candidate" && (
              <p>
                Candidate registration requires full name, email, phone and
                password.
              </p>
            )}

            {role === "company" && (
              <p>
                Company registration requires company name, business NIPT,
                email, phone and password.
              </p>
            )}
          </div>
        </div>

        <div className="auth-right">
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <h2>Create account</h2>

          <div className="role-tabs two-tabs">
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
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {role === "candidate" && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {role === "company" && (
              <>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Business NIPT</label>
                  <input
                    type="text"
                    name="nipt"
                    placeholder="Enter business NIPT"
                    value={formData.nipt}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              {role === "candidate" && "Register as Candidate"}
              {role === "company" && "Register as Company"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Login here</button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
