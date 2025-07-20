import React, { useState } from "react";
import Button from "../components/common/Button";
import type { AudioItem } from "../types/AudioItem";

const MyAudios: React.FC = () => {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(
    "Click the button to load generated audios."
  );

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAndDisplayAudios = async () => {
    setLoading(true);
    setError(null);
    setAudios([]);
    setMessage("Loading audios...");

    try {
      const response = await fetch(`${BASE_URL}/api/audios/generated`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: { audios: AudioItem[] } = await response.json();

      if (data.audios.length === 0) {
        setMessage("No generated audios found yet.");
      } else {
        setAudios(data.audios);
        setMessage(null);
      }
    } catch (err: any) {
      console.error("Error fetching or displaying audios:", err);
      setError(`Failed to load audios: ${err.message}`);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = (index: number) => {
    const currentAudio = document.getElementById(
      `audio-${index}`
    ) as HTMLAudioElement | null;

    if (!currentAudio) return;

    if (playingIndex === index) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null) {
        const prevAudio = document.getElementById(
          `audio-${playingIndex}`
        ) as HTMLAudioElement | null;
        if (prevAudio) prevAudio.pause();
      }

      currentAudio.play();
      setPlayingIndex(index);

      currentAudio.onended = () => {
        setPlayingIndex(null);
      };
    }
  };

  return (
    <main className="w-full text-white flex flex-col py-30">
      <div className="">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          My Audio Files
        </h1>

        <Button
          onClick={fetchAndDisplayAudios}
          className="w-full sm:w-1/2 mx-auto block bg-blue-600 text-white hover:bg-blue-700 transition rounded py-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Generated Audios"}
        </Button>

        <div className="mt-8">
          {message && (
            <p className="text-gray-400 italic text-center">{message}</p>
          )}
          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          {audios.length > 0 && (
            <div>
              {audios.map((audio, index) => (
                <div
                  key={audio.name}
                  className="flex flex-col sm:flex-row items-center justify-between bg-[#03001419] border border-[#ffffff45] rounded-lg p-4 shadow-sm mt-4"
                >
                  <p className="font-medium text-white mb-2 sm:mb-0 sm:mr-4">
                    {audio.name}
                  </p>

                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <audio id={`audio-${index}`}>
                      <source
                        src={`${BASE_URL}${audio.url}`}
                        type="audio/mpeg"
                      />
                    </audio>

                    <button
                      onClick={() => handleTogglePlay(index)}
                      className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-[10px]"
                    >
                      {playingIndex === index ? "Pause" : "Play"}
                    </button>

                    <a
                      href={`${BASE_URL}${audio.url}`}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-[10px]"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyAudios;
