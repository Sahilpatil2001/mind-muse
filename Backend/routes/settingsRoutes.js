const express = require("express");
const router = express.Router();
const { updateSettings } = require("../controllers/settingsController");

// PUT /api/admin/settings
router.put("/admin/settings", updateSettings);

module.exports = router;
