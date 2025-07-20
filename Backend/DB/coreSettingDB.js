const mongoose = require("mongoose");

const coreSettingsConnection = mongoose.createConnection(
  "mongodb://localhost:27017/core-settingsDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

coreSettingsConnection.on("connected", () => {
  console.log("✅ Connected to core-settingsDB");
});

coreSettingsConnection.on("error", (err) => {
  console.error("❌ core-settingsDB connection error:", err);
});

module.exports = coreSettingsConnection;
