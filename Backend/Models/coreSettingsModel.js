const mongoose = require("mongoose");
const coreSettingsConnection = require("../DB/coreSettingDB");

const coreSettingsSchema = new mongoose.Schema({
  elevenLabsSettings: {
    model_id: { type: String, required: true },
    stability: { type: Number, required: true },
    speed: { type: Number, required: true },
    style: { type: Number, required: true },
    voiceTags: { type: String, required: true }, // Or [String] if array
  },
  gptScriptStageOne: { type: String, required: true },
  gptScriptStageTwo: { type: String, required: true },
  demoAudioScript: { type: String, required: true },
});

const CoreSettings = coreSettingsConnection.model(
  "elevenLabsSettings",
  coreSettingsSchema
);
module.exports = CoreSettings;
