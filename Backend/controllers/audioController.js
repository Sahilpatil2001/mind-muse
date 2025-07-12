// controllers/Audio-Controller.js

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const audiosDir = path.join(__dirname, "../audios");
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir);

exports.getVoices = async (req, res) => {
  try {
    const response = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": process.env.ELEVEN_API_KEY },
    });

    // Safely check if voices exist
    const voices = response.data.voices || [];

    res.json({ voices }); // ✅ Send only what you need
  } catch (err) {
    console.error(
      "Error fetching ElevenLabs voices:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch voices" });
  }
};

// ! =========>> New Code For storing audios in database
// exports.mergeAudio = async (req, res) => {
//   const { sentences, voiceId } = req.body;

//   if (!sentences || !Array.isArray(sentences) || sentences.length < 2) {
//     return res
//       .status(400)
//       .json({ error: "Please send at least two sentences." });
//   }
//   if (!voiceId) {
//     return res.status(400).json({ error: "VoiceId are required." });
//   }

//   try {
//     // Clean old files

//     // fs.readdirSync(audiosDir).forEach((file) =>
//     //   fs.unlinkSync(path.join(audiosDir, file))

//     // Generate silence

//     const silencePath = path.join(audiosDir, "silence.mp3");
//     if (!fs.existsSync(silencePath)) {
//       execFileSync(ffmpegPath, [
//         "-f",
//         "lavfi",
//         "-i",
//         "anullsrc=r=44100:cl=mono",
//         "-t",
//         "5",
//         "-q:a",
//         "9",
//         "-acodec",
//         "libmp3lame",
//         silencePath,
//       ]);
//     }

//     // Generate audio from sentences
//     const audioFiles = [];
//     for (let i = 0; i < sentences.length; i++) {
//       const filePath = path.join(audiosDir, `sentence_${i}.mp3`);
//       await generateAudio(sentences[i], filePath, voiceId);
//       audioFiles.push(filePath);
//       if (i !== sentences.length - 1) {
//         audioFiles.push(silencePath);
//       }
//     }

//     // Create concat.txt for ffmpeg
//     const concatTxt = audioFiles
//       .map((f) => `file '${f.replace(/\\/g, "/")}'`)
//       .join("\n");
//     const concatFile = path.join(audiosDir, "concat.txt");
//     fs.writeFileSync(concatFile, concatTxt);

//     const outputPath = path.join(audiosDir, `output_${Date.now()}.mp3`);

//     // Merge audio using ffmpeg
//     execFile(
//       ffmpegPath,
//       [
//         "-y",
//         "-f",
//         "concat",
//         "-safe",
//         "0",
//         "-i",
//         concatFile,
//         "-c",
//         "copy",
//         outputPath,
//       ],
//       async (err) => {
//         if (err) {
//           console.error("FFmpeg merge error:", err);
//           return res.status(500).json({ error: "Failed to merge audio." });
//         }

//         try {
//           // Read the merged audio
//           const mergedBuffer = fs.readFileSync(outputPath);

//           // Save merged audio to MongoDB
//           const savedAudio = await Audio.create({
//             // userId,
//             sentence1: sentences[0],
//             sentence2: sentences[1],
//             audioData: mergedBuffer,
//             contentType: "audio/mpeg",
//           });

//           console.log("✅ Merged audio saved to DB:", savedAudio._id);

//           // Send back audio as response
//           res.setHeader("Content-Type", "audio/mpeg");
//           res.send(mergedBuffer);
//         } catch (dbErr) {
//           console.error("❌ Error saving to DB:", dbErr);
//           res.status(500).json({ error: "Merged but failed to save to DB." });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error in merge-audio:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.mergeAudio = async (req, res) => {
//   const { sentences, voiceId } = req.body;

//   if (!sentences || !Array.isArray(sentences) || sentences.length < 2) {
//     return res
//       .status(400)
//       .json({ error: "Please send at least two sentences." });
//   }

//   if (!voiceId) {
//     return res.status(400).json({ error: "VoiceId is required." });
//   }

//   try {
//     const audioFiles = [];

//     // Silence generation (if needed)
//     const silencePath = path.join(audiosDir, "silence.mp3");
//     if (!fs.existsSync(silencePath)) {
//       execFileSync(ffmpegPath, [
//         "-f",
//         "lavfi",
//         "-i",
//         "anullsrc=r=44100:cl=mono",
//         "-t",
//         "5",
//         "-q:a",
//         "9",
//         "-acodec",
//         "libmp3lame",
//         silencePath,
//       ]);
//     }

//     // Generate individual audios
//     for (let i = 0; i < sentences.length; i++) {
//       const filePath = path.join(audiosDir, `sentence_${i}_${Date.now()}.mp3`);
//       await generateAudio(sentences[i], filePath, voiceId);
//       audioFiles.push(filePath);
//       if (i < sentences.length - 1) {
//         audioFiles.push(silencePath);
//       }
//     }

//     const concatTxt = audioFiles
//       .map((f) => `file '${f.replace(/\\/g, "/")}'`)
//       .join("\n");
//     const concatFilePath = path.join(audiosDir, `concat_${Date.now()}.txt`);
//     fs.writeFileSync(concatFilePath, concatTxt);

//     const outputPath = path.join(audiosDir, `output_${Date.now()}.mp3`);

//     execFile(
//       ffmpegPath,
//       [
//         "-y",
//         "-f",
//         "concat",
//         "-safe",
//         "0",
//         "-i",
//         concatFilePath,
//         "-c",
//         "copy",
//         outputPath,
//       ],
//       async (err) => {
//         if (err) {
//           console.error("❌ FFmpeg merge error:", err);
//           return res.status(500).json({ error: "Failed to merge audio." });
//         }

//         try {
//           const mergedBuffer = fs.readFileSync(outputPath);

//           const savedAudio = await Audio.create({
//             sentence1: sentences[0],
//             sentence2: sentences[1],
//             audioData: mergedBuffer,
//             contentType: "audio/mpeg",
//           });

//           console.log("✅ Merged audio saved to DB:", savedAudio._id);
//           res.setHeader("Content-Type", "audio/mpeg");
//           res.send(mergedBuffer);
//         } catch (dbErr) {
//           console.error("❌ DB save error:", dbErr);
//           res.status(500).json({ error: "Merged but failed to save to DB." });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("❌ mergeAudio controller error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
// !  ====>> for showing audios inside audio folder at frontend
exports.getGeneratedAudios = async (req, res) => {
  const publicAudioDir = path.join(__dirname, "..", "audios");
  console.log(`Attempting to read directory: ${publicAudioDir}`);

  try {
    if (!fs.existsSync(publicAudioDir)) {
      console.log(`[Backend Debug] Directory ${publicAudioDir} does not exist`);
      return res.status(200).json({ audios: [] });
    }

    const files = await fs.promises.readdir(publicAudioDir);
    console.log(`Files found in directory:`, files);

    // Filter only output_*.mp3 files
    const audioFiles = files.filter(
      (file) => file.startsWith("Audio") && file.endsWith(".mp3")
    );

    console.log(`Filtered output audio files:`, audioFiles);

    const audios = audioFiles.map((file) => ({
      name: file,
      url: `/audios/${file}`,
    }));

    res.json({ audios });
  } catch (error) {
    console.error("Error fetching generated audios:", error);
    res.status(500).json({ error: "Failed to fetch generated audios" });
  }
};
