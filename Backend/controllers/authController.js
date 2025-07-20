// controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../Models/userModel");

// Endpoint for Register
const register = async (req, res) => {
  try {
    const user = req.body;

    user.password = await bcrypt.hash(user.password, 10);

    await userModel.create(user);
    res.status(201).send({ message: "Registration Successful" });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).send({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).send({ message: "Email already exists" });
    }
    res.status(500).send({ message: "Some problem while registration" });
  }
};

// Endpoint for Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password);

  try {
    const user = await userModel.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    // ✅ Step: Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    // ✅ Step: Send token with response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // ⬅️ Include JWT token in response
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

const getUser = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { _id, firstName, email } = req.user;
  res.json({ id: _id, firstName, email });
};

module.exports = {
  register,
  loginUser,
  getUser,
};
