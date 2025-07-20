// ! ==========>> New Code <<==========

import type { FC, ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import Button from "./common/Button";
import type { Voice, CreateAudioProps } from "../types/CreateAudioTypes";

const CreateAudio: FC<CreateAudioProps> = ({ BASE_URL }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/voices`);
        const data = await res.json();
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0]);
        }
      } catch (error) {
        console.error("Failed to fetch voices:", error);
      }
    };
    fetchVoices();
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const playAudio = async (voiceId: string) => {
    if (!text.trim()) return alert("Please enter at least two sentences.");

    // Split text into array of sentences
    const sentences = text
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setLoading(true);
    setAudioUrl(null);

    try {
      console.log("👉 Sending to /merge-audio:", { voiceId, sentences });

      const res = await fetch(`${BASE_URL}/api/merge-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceId: selectedVoice?.voiceId, // ✅ make sure this exists
          sentences: sentences,
        }), // ✅ FIXED
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Merge error: ${res.status} - ${errorText}`);
      }

      const requestId = res.headers.get("request-id");
      if (requestId) console.log("✅ ElevenLabs Request ID:", requestId);

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
    <div className="">
      <main className="w-[40%] py-20">
        <div className="rounded-xl shadow-lg space-y-10">
          <h1 className="text-4xl font-semibold text-start">
            Enter Script For Audio
          </h1>

          <textarea
            rows={8}
            className="w-full border border-[#ffffff6c] rounded-md p-3 outline-none"
            placeholder="Enter sentences separated by periods."
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
          />

          {/* Custom dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="border border-[#ffffff6c] rounded-md p-3 bg-transparent cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedVoice ? selectedVoice.name : "Select Voice"}
            </div>

            {dropdownOpen && (
              <ul className="absolute w-full mt-2 border border-[#ffffff6c] rounded-md bg-[#00000027] max-h-60 overflow-y-auto z-10">
                {voices.map((voice) => (
                  <li
                    key={voice.voice_id}
                    className="flex justify-between items-center px-4 py-2 group cursor-pointer"
                    onClick={() => {
                      setSelectedVoice(voice);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{voice.name}</span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent voice select when clicking play
                        playAudio(voice.voice_id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800 cursor-pointer"
                    >
                      ▶
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            onClick={() => selectedVoice && playAudio(selectedVoice.voice_id)}
            disabled={loading}
            className="w-full"
          >
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
