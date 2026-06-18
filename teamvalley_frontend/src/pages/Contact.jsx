import React, { useState } from "react";
import "../styles/Contact.css";
import { Alert } from "react-bootstrap";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        formData.fullName.trim() === "" ||
        formData.email.trim() === "" ||
        formData.subject.trim() === "" ||
        formData.message.trim() === ""
      ) {
        setErrorMessage("Ju lutemi plotësoni të gjitha fushat.");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);

        return;
      }

      await axios.post("http://localhost:5000/api/contact", formData);

      setSuccessMessage("Mesazhi u dërgua me sukses.");

      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Dështoi të dërgohet mesazhi."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <main className="jv-contact-page jv-contact-page-animation">
      <section className="jv-contact-hero">
        <div className="jv-contact-left">
          <span className="jv-contact-label">Contact Us</span>

          <h1>We're Here to Help</h1>

          <p>
            Have a question or need assistance? Our team is ready to support you
            and help you with anything related to JobValley.
          </p>

          <div className="jv-contact-info">
            <h2>Get in Touch</h2>

            <div className="jv-contact-info-item">
              <div className="jv-contact-icon">✉</div>
              <div>
                <h3>Email Us</h3>
                <p>info@jobvalley.com</p>
              </div>
            </div>

            <div className="jv-contact-info-item">
              <div className="jv-contact-icon">☎</div>
              <div>
                <h3>Call Us</h3>
                <p>+355 69 123 4567</p>
              </div>
            </div>

            <div className="jv-contact-info-item">
              <div className="jv-contact-icon">⏱</div>
              <div>
                <h3>Working Hours</h3>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="jv-contact-info-item">
              <div className="jv-contact-icon">⌖</div>
              <div>
                <h3>Location</h3>
                <p>Tirana Business Center, Albania</p>
              </div>
            </div>
          </div>
        </div>

        <div className="jv-contact-right">
          <form className="jv-contact-form" onSubmit={handleSubmit}>
            <h2>Send Us a Message</h2>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div className="jv-contact-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="jv-contact-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="jv-contact-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>

            <div className="jv-contact-group">
              <label>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="jv-contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;