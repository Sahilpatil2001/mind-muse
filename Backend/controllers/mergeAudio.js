const fs = require("fs");
const path = require("path");
const { execFileSync, execFile } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const { generateAudio } = require("../utils/generateAudio");

const audiosDir = path.join(__dirname, "../audios");
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir);

exports.mergeDynamicAudio = async (req, res) => {
  const { inputText, voiceId } = req.body;
  console.log("🧠 Backend input:", req.body);

  if (!inputText || !voiceId) {
    return res
      .status(400)
      .json({ error: "inputText and voiceId are required" });
  }

  try {
    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const sentenceChunks = lines.map((line) => {
      const pauseMatch = line.match(/\((\d+)s-pause\)/i);
      const pause = pauseMatch ? parseInt(pauseMatch[1], 10) : 2;
      const sentence = line.replace(/\s*\(\d+s-pause\)/i, "").trim();
      return { sentence, pause };
    });

    const audioFiles = [];
    const silenceFiles = {};

    // Generate silence files only once per duration
    for (const { pause } of sentenceChunks) {
      if (!silenceFiles[pause]) {
        const silencePath = path.join(audiosDir, `silence_${pause}s.mp3`);
        if (!fs.existsSync(silencePath)) {
          execFileSync(ffmpegPath, [
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=44100:cl=mono",
            "-t",
            String(pause),
            "-q:a",
            "9",
            "-acodec",
            "libmp3lame",
            silencePath,
          ]);
        }
        silenceFiles[pause] = silencePath;
      }
    }

    // Generate sentence audios temporarily
    for (let i = 0; i < sentenceChunks.length; i++) {
      const { sentence, pause } = sentenceChunks[i];
      const sentencePath = path.join(audiosDir, `temp_sentence_${i}.mp3`);
      await generateAudio(sentence, sentencePath, voiceId);
      audioFiles.push(sentencePath);

      if (i < sentenceChunks.length - 1) {
        audioFiles.push(silenceFiles[pause]);
      }
    }

    // Create concat.txt
    const concatTxt = audioFiles
      .map((f) => `file '${f.replace(/\\/g, "/")}'`)
      .join("\n");
    const concatFilePath = path.join(audiosDir, `concat_${Date.now()}.txt`);
    fs.writeFileSync(concatFilePath, concatTxt);

    // Merge into final output
    const outputPath = path.join(audiosDir, `Audio_${Date.now()}.mp3`);
    execFile(
      ffmpegPath,
      [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatFilePath,
        "-c",
        "copy",
        outputPath,
      ],
      (err) => {
        if (err) {
          console.error("FFmpeg merge error:", err);
          return res.status(500).json({ error: "Failed to merge audio." });
        }

        // Clean up temp sentence files and concat.txt
        audioFiles.forEach((file) => {
          if (file.includes("temp_sentence_") && fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
        fs.unlinkSync(concatFilePath);

        const buffer = fs.readFileSync(outputPath);
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(buffer);
      }
    );
  } catch (err) {
    console.error("Error in mergeDynamicAudio:", err);
    res.status(500).json({ error: "Server error" });
  }
};
