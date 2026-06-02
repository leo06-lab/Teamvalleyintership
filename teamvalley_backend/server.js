const express = require("express"); // Importon Express
const mongoose = require("mongoose"); // Importon Mongoose
const cors = require("cors"); // Importon CORS
const dotenv = require("dotenv"); // Importon dotenv

dotenv.config(); // Aktivizon .env

const app = express(); // Krijon aplikacionin Express

// Middleware
app.use(express.json()); // Lejon JSON nga frontend

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Lejon cookies/token nëse na duhen më vonë
  })
);

// Lidhja me MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("JobValley Backend is running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // Auth routes

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});