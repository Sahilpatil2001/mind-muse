// routes/voiceRoutes.js
const express = require("express");
const router = express.Router();
const audioController = require("../controllers/audioController");
const { mergeDynamicAudio } = require("../controllers/mergeAudio");

router.get("/voices", audioController.getVoices);
router.post("/merge-audio", mergeDynamicAudio);
router.get("/generated", audioController.getGeneratedAudios);

module.exports = router;
