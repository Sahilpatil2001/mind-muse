const Settings = require("../Models/coreSettingsModel");

exports.updateSettings = async (req, res) => {
  try {
    const payload = req.body;

    // Create a new settings document
    const newSettings = new Settings(payload);
    await newSettings.save();

    res.status(201).json({
      message: "New settings saved successfully",
      data: newSettings,
    });
  } catch (error) {
    console.error("Error saving new settings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
