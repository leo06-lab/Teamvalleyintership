import React from "react";
import "../styles/Contact.css";

import { Container, Form, Button } from "react-bootstrap";

function Contact() {
  return (
    <main className="contact-page">
      <Container className="contact-hero m-5 p-5 rounded-4 shadow">
        <section>
          <div className="contact-hero-left">
            {/* Ana e majtë me tekst */}
            <span className="contact-label">Contact Us</span>
            {/* Label i vogël */}
            <h1>We're Here to Help</h1> {/* Titulli kryesor */}
            <p className="">
              Have a question or need assistance? <br />
              Our team is ready to support you.
            </p>
            {/* Përshkrimi i platformës */}


            <div className="get-in-touch mt-5">
              <h3 className="fw-bold mb-5 d-flex flex-column align-items-start ">
                Get in Touch
              </h3>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-light p-3 rounded me-4">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <h6 className="fw-bold mb-1">Email Us</h6>
                  <p className="text-muted mb-0">info@jobvalley.com</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-light p-3 rounded me-4">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <h6 className="fw-bold mb-1">Call Us</h6>
                  <p className="text-muted mb-0">+355 69 123 4567</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-4">
                <div className="bg-light p-3 rounded me-4">
                  <i className="bi bi-clock-fill"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <h6 className="fw-bold mb-1">Working Hours</h6>
                  <p className="text-muted mb-0">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="bg-light p-3 rounded me-4">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <h6 className="fw-bold mb-1">Location</h6>
                  <p className="text-muted mb-0">
                    Tirana Business Center
                    <br />
                    Tirana, Albania
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="my-5 mx-5">
          {/* Right Side */}

          <div className="px-5 w-100 mx-auto">
            <h4 className="fw-bold mb-4">Send Us a Message</h4>

            <Form>
              <Form.Group className="mb-3 d-flex flex-column align-items-start">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex flex-column align-items-start">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex flex-column align-items-start">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group className="mb-3 d-flex flex-column align-items-start">
                <Form.Label>Your Message</Form.Label>
                <Form.Control as="textarea" rows={4} />
              </Form.Group>

              <Button variant="primary" className="w-100">
                <i className="bi bi-send-fill me-2"></i>
                Send Message
              </Button>
            </Form>
          </div>
        </section>
      </Container>
    </main>
  );
}

export default Contact;
