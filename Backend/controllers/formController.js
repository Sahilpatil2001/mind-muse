// controllers/formController.js
const Submission = require("../models/Submission");

const submitForm = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing in token" });
    }

    const { responses } = req.body;

    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const submission = new Submission({
      userId,
      answers: responses, // ✅ storing question + answer per step
    });

    await submission.save();

    res
      .status(201)
      .json({ message: "Form submitted successfully", submission });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { submitForm };
