const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    answers: {
      type: [Object], // ✅ now accepts an array of step objects
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
