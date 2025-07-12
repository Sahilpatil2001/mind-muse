// src/components/MainSection.jsx
import { useState, useEffect } from "react";
import Button from "./Button";

const MainSection = ({ BASE_URL }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/voices`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0].voice_id);
        }
      } catch (error) {
        console.error("Failed to fetch voices:", error.message);
      }
    };

    fetchVoices();
  }, [BASE_URL]);

  const playAudio = async () => {
    if (!text.trim()) return alert("Please enter at least two sentences.");

    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch(`${BASE_URL}/api/merge-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: text, voiceId: selectedVoice }),
      });

      if (!res.ok) {
        const result = await res.text();
        console.error("Backend error:", result);
        alert("Failed to generate audio.");
        return;
      }

      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex">
      <aside className="w-[30%]  bg-[#0c0226] h-screen">Aside Content</aside>
      <main className="w-full py-10 px-10">
        <div className="w-[60%] rounded-xl shadow-lg px-10 space-y-10">
          <h1 className="text-4xl font-semibold text-start">
            Enter Script For Audio
          </h1>
          <textarea
            rows={10}
            className="w-full border border-[#ffffff6c] rounded-md p-3 outline-none"
            placeholder="Enter at least two sentences separated by periods."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select
            className="w-full border border-[#ffffff6c] rounded-md p-3"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices.map((voice) => (
              <option
                key={voice.voice_id}
                value={voice.voice_id}
                className="bg-black"
              >
                {voice.name}
              </option>
            ))}
          </select>

          <Button onClick={playAudio} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Get Audio"}
          </Button>

          {audioUrl && (
            <audio controls autoPlay src={audioUrl} className="w-full mt-4" />
          )}
        </div>
      </main>
    </div>
  );
};

export default MainSection;
