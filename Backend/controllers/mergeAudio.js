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

    const rawLines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const sentenceChunks = rawLines.map((line, index, arr) => {
      const pauseMatch = line.match(/\((\d+)s-pause\)/i);
      const pause = pauseMatch ? parseInt(pauseMatch[1], 10) : null;
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
    const requestIds = [];

    for (let i = 0; i < sentenceChunks.length; i++) {
      const { sentence, pause, previousText, nextText } = sentenceChunks[i];

      const sentencePath = path.join(
        audiosDir,
        `temp_sentence_${Date.now()}_${i}.mp3`
      );

      const { requestId: resRequestId, outputPath: savedPath } =
        await generateAudio(
          sentence,
          sentencePath,
          voiceId,
          previousText,
          nextText
        );

      if (resRequestId) {
        requestIds.push(resRequestId);
      } else {
        console.warn("⚠️ No request-id returned for:", sentence);
      }

      audioFiles.push(savedPath);

      if (pause && i < sentenceChunks.length - 1) {
        audioFiles.push(silenceFiles[pause]);
      }
    }

    // Validate audio files
    for (const file of audioFiles) {
      if (!fs.existsSync(file)) {
        console.error("Missing audio file:", file);
        return res.status(500).json({ error: `Audio file not found: ${file}` });
      }
    }

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

          // Cleanup temp files
          audioFiles.forEach((file) => {
            if (file.includes("temp_sentence_") && fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          });
          if (fs.existsSync(concatFilePath)) fs.unlinkSync(concatFilePath);

          // ✅ Set only the last 3 request IDs
          if (requestIds.length > 0) {
            const lastThree = requestIds.slice(-3).join(",");
            res.setHeader("request-id", lastThree);
            res.setHeader("Access-Control-Expose-Headers", "request-id");
          }

          res.status(200).send(audioBuffer);
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
