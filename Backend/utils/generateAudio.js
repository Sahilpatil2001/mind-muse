// // utils/generateAudio.js

const fs = require("fs");
require("dotenv").config();

// ! NEw
exports.generateAudio = async (
  text,
  outputPath,
  voiceId,
  previousText = null,
  nextText = null
) => {
  const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ ElevenLabs error response:", errorText);
    throw new Error("Failed to generate audio from ElevenLabs");
  }

  const requestId = response.headers.get("request-id");

  if (!requestId) {
    console.warn("⚠️ No request-id found in response headers");
    console.log("Available headers:", [...response.headers.entries()]);
  } else {
    console.log("✅ request-id found:", requestId);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  // Return both requestId and saved audio file path
  return { requestId, outputPath };
};
