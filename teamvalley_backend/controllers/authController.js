const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerCandidate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, phone and password are required.",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const user = await User.create({
      role: "candidate",
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Candidate registered successfully.",
      data: {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      nipt,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (!companyName || !nipt || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Company name, NIPT, email, phone and password are required.",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const existingNipt = await User.findOne({
      nipt: nipt.toUpperCase(),
    });

    if (existingNipt) {
      return res.status(400).json({
        success: false,
        message: "This NIPT is already registered.",
      });
    }

    const user = await User.create({
      role: "company",
      companyName,
      nipt: nipt.toUpperCase(),
      email: email.toLowerCase(),
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      data: {
        id: user._id,
        role: user.role,
        companyName: user.companyName,
        nipt: user.nipt,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or NIPT already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkEmail = async (req, res) => {
  try {
    const email = req.body.email || req.params.email || req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        exists: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        exists: false,
        message: "No account found with this email.",
      });
    }

    res.status(200).json({
      success: true,
      exists: true,
      message: "Account found.",
      data: {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        nipt: user.nipt,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      exists: false,
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        nipt: user.nipt,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerCandidate,
  registerCompany,
  checkEmail,
  loginUser,
  getMe,
};