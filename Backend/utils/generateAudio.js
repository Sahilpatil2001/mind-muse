// utils/generateAudio.js
// const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

exports.generateAudio = async (
  text,
  outputPath,
  voiceId,
  previousText = null,
  nextText = null
) => {
  const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        previous_text: previousText,
        next_text: nextText,
      }),
    }
  );

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  return "requestId";
};
