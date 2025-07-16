const express = require("express");
const router = express.Router();
const { submitForm } = require("../controllers/formController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/submit", verifyToken, submitForm);

module.exports = router;
