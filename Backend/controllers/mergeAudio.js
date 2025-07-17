const fs = require("fs");
const path = require("path");
const { execFileSync, execFile } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const { generateAudio } = require("../utils/generateAudio");

const audiosDir = path.join(__dirname, "../audios");
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir);

exports.mergeDynamicAudio = async (req, res) => {
  try {
    const { voiceId, text } = req.body;

    if (!voiceId || !text || typeof text !== "string") {
      return res.status(400).json({ error: "voiceId and text are required" });
    }

    // ✅ Parse text into segments
    const rawLines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const sentenceChunks = rawLines.map((line, index, arr) => {
      const pauseMatch = line.match(/\((\d+)s-pause\)/i);
      const pause = pauseMatch ? parseInt(pauseMatch[1], 10) : null; // null = no pause
      const sentence = line.replace(/\(\d+s-pause\)/i, "").trim();

      return {
        sentence,
        pause,
        previousText:
          index > 0
            ? arr[index - 1].replace(/\(\d+s-pause\)/i, "").trim()
            : null,
        nextText:
          index < arr.length - 1
            ? arr[index + 1].replace(/\(\d+s-pause\)/i, "").trim()
            : null,
      };
    });

    // ✅ Prepare silence files only if pause is specified
    const silenceFiles = {};
    for (const { pause } of sentenceChunks) {
      if (pause && !silenceFiles[pause]) {
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

    const audioFiles = [];

    for (let i = 0; i < sentenceChunks.length; i++) {
      const { sentence, pause, previousText, nextText } = sentenceChunks[i];

      const sentencePath = path.join(
        audiosDir,
        `temp_sentence_${Date.now()}_${i}.mp3`
      );

      // ✅ Generate audio for sentence
      await generateAudio(
        sentence,
        sentencePath,
        voiceId,
        previousText,
        nextText
      );

      audioFiles.push(sentencePath);

      // ✅ Insert pause (only if pause was explicitly given and not the last line)
      if (pause && i < sentenceChunks.length - 1) {
        audioFiles.push(silenceFiles[pause]);
      }
    }

    // ✅ Ensure all audio files exist
    for (const file of audioFiles) {
      if (!fs.existsSync(file)) {
        console.error("Missing audio file:", file);
        return res.status(500).json({ error: `Audio file not found: ${file}` });
      }
    }

    // ✅ Write concat list
    const concatTxt = audioFiles
      .map((filePath) => `file '${filePath.replace(/\\/g, "/")}'`)
      .join("\n");

    const concatFilePath = path.join(audiosDir, `concat_${Date.now()}.txt`);
    fs.writeFileSync(concatFilePath, concatTxt);

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
        try {
          if (err) {
            console.error("FFmpeg merge error:", err);
            return res.status(500).json({ error: "Failed to merge audio." });
          }

          const audioBuffer = fs.readFileSync(outputPath);

          // ✅ Cleanup
          audioFiles.forEach((file) => {
            if (file.includes("temp_sentence_") && fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
          if (fs.existsSync(concatFilePath)) fs.unlinkSync(concatFilePath);

          // Optionally delete merged file after sending
          // fs.unlinkSync(outputPath);

          res.setHeader("Content-Type", "audio/mpeg");
          res.send(audioBuffer);
        } catch (cleanupErr) {
          console.error("Cleanup/send error:", cleanupErr);
          res.status(500).json({ error: "Error processing audio response." });
        }
      }
    );
  } catch (error) {
    console.error("Error in mergeDynamicAudio:", error);
    res.status(500).json({ error: "Server error" });
  }
};
