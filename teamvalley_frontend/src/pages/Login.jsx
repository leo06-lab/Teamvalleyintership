import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInlineMessage } from "../hooks/useInlineMessage";
import "../styles/Auth.css";
import InlineMessage from "../components/InlineMessage";

function Login() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/auth";
  const { message, showMessage } = useInlineMessage();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [foundAccount, setFoundAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      showMessage("Please enter your email address.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (!response.ok || !result.exists) {
        showMessage(result.message || "No account found with this email.", "error");
        setLoading(false);
        return;
      }

      setFoundAccount(result.data);
      setStep("password");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running.", "error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.trim() === "") {
      showMessage("Please enter your password.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Invalid email or password.", "error");
        setLoading(false);
        return;
      }

      const loggedUser = {
        ...result.data,
        isLoggedIn: true,
      };

      localStorage.setItem("jobvalleyUser", JSON.stringify(loggedUser));
      localStorage.setItem("jobvalleyToken", result.data.token);

      setLoading(false);

      if (loggedUser.role === "company") {
        navigate("/company-dashboard");
        return;
      }

      if (loggedUser.role === "candidate") {
        navigate("/candidate/dashboard");
        return;
      }

      navigate("/");
    } catch (error) {
      setLoading(false);
      showMessage("Backend is not running.", "error");
    }
  };

  return (
    <main className="auth-mongo-page auth-page-animation">
      <section className="auth-mongo-left">
        <div className="auth-mongo-brand">
          <span className="auth-mongo-logo-icon">✓</span>
          <h2>JobValley</h2>
        </div>

        <InlineMessage message={message} />

        <div className="auth-mongo-box">
          <h1>Log in to your account</h1>
          <p className="auth-mongo-signup">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className="auth-mongo-divider">
            <span></span>
            <p>Or with email and password</p>
            <span></span>
          </div>

          {step === "email" && (
            <form className="auth-mongo-form" onSubmit={handleNext}>
              <div className="auth-mongo-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="auth-mongo-next-btn"
                disabled={loading}
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form className="auth-mongo-form" onSubmit={handleLogin}>
              <div className="auth-mongo-selected-email">
                <div>
                  <p>{email}</p>
                  {foundAccount && (
                    <small>
                      {foundAccount.role === "company"
                        ? foundAccount.companyName
                        : foundAccount.role}
                    </small>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                    setFoundAccount(null);
                  }}
                >
                  Change
                </button>
              </div>

              <div className="auth-mongo-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="auth-mongo-next-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="auth-mongo-right">
        <div className="auth-mongo-right-content">
          <h2>Build your career and hiring workspace with JobValley</h2>
          <p>
            Connect candidates with companies, publish job opportunities and
            manage applications from one platform.
          </p>
          <Link to="/jobs">Browse jobs →</Link>
        </div>

        <div className="auth-mongo-shape auth-mongo-shape-one"></div>
        <div className="auth-mongo-shape auth-mongo-shape-two"></div>
        <div className="auth-mongo-star">✦</div>
      </section>
    </main>
  );
}

export default Login;
