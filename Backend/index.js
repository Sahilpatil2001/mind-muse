require("dotenv").config(); // Must be at the top
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { getVoices } = require("./controllers/audioController");
const audioRoutes = require("./routes/audioRoutes");
const formRoutes = require("./routes/formRoutes");

const path = require("path");
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

//   Creating Database Connection
mongoose
  .connect("mongodb://localhost:27017/MindMuse")
  .then(() => {
    console.log("db connect ");
  })
  .catch((error) => {
    console.log(error);
  });

// ! ========>>  Creating the endpoints <<=========
// Routes
app.use("/api", require("./routes/authRoute"));
app.get("/api/voices", getVoices);
app.use("/api/audios", require("./routes/audioRoutes"));
app.use("/api", audioRoutes);

app.use("/audios", express.static(path.join(__dirname, "audios")));

// Route For Storing Answers in Backend
app.use("/api", formRoutes);

//   Creating the server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
