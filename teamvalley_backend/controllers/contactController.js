const ContactMessage = require("../models/ContactMessages");

// Funksioni per te krijuar nje mesazh kontakti
const createContactMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const newMessage = await ContactMessage.create({
      fullName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Your message has been sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createContactMessage,
};