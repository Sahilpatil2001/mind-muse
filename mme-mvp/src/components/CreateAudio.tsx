import type { FC, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Button from "./common/Button";

interface Voice {
  voice_id: string;
  name: string;
}

interface CreateAudioProps {
  BASE_URL: string;
}

const CreateAudio: FC<CreateAudioProps> = ({ BASE_URL }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const BASE_URL = "http://localhost:8000";
    const fetchVoices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/voices`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0].voice_id);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch voices:", error.message);
        } else {
          console.error("Unknown error occurred while fetching voices.");
        }
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
        body: JSON.stringify({
          voiceId: selectedVoice,
          text, // plain text with optional (3s-pause)
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate audio.");
      }

      // Read the request-id header after checking success
      const requestId = res.headers.get("request-id");
      // Convert Headers to an array and print

      if (requestId) {
        console.log("✅ ElevenLabs Request ID:", requestId);
      } else {
        console.warn("⚠️ No request-id found in response headers.");
      }

      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("ERROR:", error);
      alert("Failed to generate audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex">
      <main className="w-1/2 py-10 px-10">
        <div className="w-full rounded-xl shadow-lg px-10 space-y-10">
          <h1 className="text-4xl font-semibold text-start">
            Enter Script For Audio
          </h1>

          <textarea
            rows={10}
            className="w-full border border-[#ffffff6c] rounded-md p-3 outline-none"
            placeholder="Enter sentences separated by periods."
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
          />

          <select
            className="w-full border border-[#ffffff6c] rounded-md p-3"
            value={selectedVoice}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedVoice(e.target.value)
            }
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

export default CreateAudio;
