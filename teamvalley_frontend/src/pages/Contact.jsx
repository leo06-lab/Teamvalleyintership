import React, { useState } from "react";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.fullName.trim() === "" ||
      formData.email.trim() === "" ||
      formData.subject.trim() === "" ||
      formData.message.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setSuccessMessage("Your message has been sent successfully.");

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <main className="jv-contact-page">
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

            {successMessage && (
              <div className="jv-contact-success">{successMessage}</div>
            )}

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