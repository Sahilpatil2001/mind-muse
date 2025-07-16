const fs = require("fs");
const path = require("path");
const { execFileSync, execFile } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const { generateAudio } = require("../utils/generateAudio");

const audiosDir = path.join(__dirname, "../audios");
if (!fs.existsSync(audiosDir)) fs.mkdirSync(audiosDir);

exports.mergeDynamicAudio = async (req, res) => {
  try {
    const { voiceId, segments } = req.body;

    if (
      !voiceId ||
      !segments ||
      !Array.isArray(segments) ||
      segments.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "voiceId and non-empty segments array are required" });
    }

    // Parse segments into { sentence, pause }
    const sentenceChunks = segments.map((item) => {
      const line = item.text || "";
      const pauseMatch = line.match(/\((\d+)s-pause\)/i);
      const pause = pauseMatch ? parseInt(pauseMatch[1], 10) : 2;
      const sentence = line.replace(/\s*\(\d+s-pause\)/i, "").trim();
      return { sentence, pause };
    });

    // Prepare silence files
    const silenceFiles = {};

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

    const audioFiles = [];
    // let lastRequestId = "";

    for (let i = 0; i < sentenceChunks.length; i++) {
      const { sentence, pause } = sentenceChunks[i];
      const previousText = i > 0 ? sentenceChunks[i - 1].sentence : null;
      const nextText =
        i < sentenceChunks.length - 1 ? sentenceChunks[i + 1].sentence : null;

      const sentencePath = path.join(
        audiosDir,
        `temp_sentence_${Date.now()}_${i}.mp3`
      );

      // ✅ Generate audio for this sentence
      const requestId = await generateAudio(
        sentence,
        sentencePath,
        voiceId,
        previousText,
        nextText
      );

      // if (requestId) lastRequestId = requestId;

      audioFiles.push(sentencePath);

      if (i < sentenceChunks.length - 1) {
        audioFiles.push(silenceFiles[pause]);
      }
    }

    // ✅ Check all files exist before merging
    for (const file of audioFiles) {
      if (!fs.existsSync(file)) {
        console.error("Missing audio file:", file);
        return res.status(500).json({ error: `Audio file not found: ${file}` });
      }
    }

    // ✅ Write concat file
    const concatTxt = audioFiles
      .map((filePath) => `file '${filePath.replace(/\\/g, "/")}'`)
      .join("\n");

    const concatFilePath = path.join(audiosDir, `concat_${Date.now()}.txt`);
    fs.writeFileSync(concatFilePath, concatTxt);

    // ✅ Merge using ffmpeg
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

          // ✅ Read merged audio
          const audioBuffer = fs.readFileSync(outputPath);

          // ✅ Cleanup temp files
          audioFiles.forEach((file) => {
            if (file.includes("temp_sentence_") && fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
          if (fs.existsSync(concatFilePath)) {
            fs.unlinkSync(concatFilePath);
          }
          // Optionally delete merged audio file after sending
          // fs.unlinkSync(outputPath);

          // res.setHeader("Content-Type", "audio/mpeg");
          // res.setHeader("x-request-id", lastRequestId || "unknown");
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
