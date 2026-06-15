const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware per te verifikuar tokenin dhe per te siguruar qe useri eshte i autorizuar
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Nuk je i autorizuar" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Useri nuk u gjet" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token i pavlefshëm" });
  }
};

module.exports = authMiddleware;