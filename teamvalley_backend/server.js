const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


const contactRoutes = require("./routes/contactRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("JobValley Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/candidate", applicationRoutes);
app.use("/api/candidate", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});