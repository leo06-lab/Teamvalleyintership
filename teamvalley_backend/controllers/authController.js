const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Regjistrimi i perdorusit
const register = async (req, res) => {
  try {
    // Merr te dhenat nga request body
    const { fullName, email, phoneNumber, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password dhe confirm password nuk perputhen" });
    }

    // Kontrollojme nese perdoruesi me kete email ekziston
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Perdoruesi me kete email ekziston" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // krijon perdoruesin e ri me te dhenat e marra dhe password e hashuar
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // ruan perdoruesin ne database
    await user.save();

    res.status(201).json({
      success: true,
      message: "Perdoruesi u regjistrua me sukses",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Gabim ne server" });
  }
};

// Login i perdoruesit

const login = async (req, res) => {
  try {
    // Merr te dhenat nga request body
    const { email, password } = req.body;

    // Kontrollojme nese perdoruesi me kete email ekziston
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email eshte invalid" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password eshte invalid" });
    }

    // Nëse është valid, gjeneron një JWT token me jwt.sign
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ message: "Gabim ne server" });
  }
};

// Eksporto controllerat
module.exports = {
    register,
    login,
}