// utils/generateAudio.js
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

exports.generateAudio = async (text, outputPath, voiceId) => {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVEN_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    fs.writeFileSync(outputPath, response.data);
  } catch (error) {
    console.error(
      "generateAudio error:",
      error.response?.data || error.message
    );
    throw new Error("Audio generation failed");
  }
};
