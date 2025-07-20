import type { FC } from "react";
import { useEffect, useState } from "react";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import type { AdminSettingsPayload } from "../../types/AdminSettings";
import { showSuccessToast } from "../../utils/toastHelper";

const AdminSettings: FC = () => {
  const [models, setModels] = useState<{ model_id: string; name: string }[]>(
    []
  );
  const [modelId, setModelId] = useState("");
  const [stability, setStability] = useState<number>(0.5);
  const [speed, setSpeed] = useState<number>(1);
  const [style, setStyle] = useState<number>(1);
  const [voiceTags, setVoiceTags] = useState("");

  const [gptScriptStageOne, setGptScriptStageOne] = useState("");
  const [gptScriptStageTwo, setGptScriptStageTwo] = useState("");
  const [demoAudioScript, setDemoAudioScript] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("https://api.elevenlabs.io/v1/models", {
          headers: {
            "xi-api-key": import.meta.env.VITE_ELEVEN_API_KEY,

            "Content-Type": "application/json",
          },
        });
        // console.log("API KEY:", import.meta.env.ELEVEN_API_KEY);

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data = await res.json();

        // Check if it's an array or object with models key
        const modelsList = Array.isArray(data) ? data : data.models;
        setModels(modelsList);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        setModels([]); // Avoid crash
      }
    };

    fetchModels();
  }, []);

  const handleUpdate = async () => {
    const payload: AdminSettingsPayload = {
      elevenLabsSettings: {
        model_id: modelId,
        stability,
        speed,
        style,
        voiceTags,
      },
      gptScriptStageOne,
      gptScriptStageTwo,
      demoAudioScript,
    };

    try {
      const res = await fetch("http://localhost:8000/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      showSuccessToast("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating settings");
    }
  };

  return (
    <div className="mx-auto my-10">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 tracking-wider">
          Eleven Labs Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Model Dropdown */}
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full p-2 border rounded outline-none border-slate-800 "
          >
            <option className="bg-slate-950" value="">
              Select Model
            </option>
            {models.map((model) => (
              <option
                className="bg-slate-950"
                key={model.model_id}
                value={model.model_id}
              >
                {model.name}
              </option>
            ))}
          </select>

          <FormInput
            type="number"
            step={0.1}
            placeholder="Stability (e.g., 0.5)"
            value={stability}
            onChange={(e) => setStability(parseFloat(e.target.value))}
            className="w-full p-2 border rounded border-slate-800"
          />
          <FormInput
            type="number"
            step={0.1}
            placeholder="Speed (e.g., 1)"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full p-2 border rounded border-slate-800"
          />
          <FormInput
            type="number"
            step={0.1}
            placeholder="Style (e.g., 1)"
            value={style}
            onChange={(e) => setStyle(parseFloat(e.target.value))}
            className="w-full p-2 border rounded border-slate-800"
          />
          <FormInput
            type="text"
            placeholder="Voice Tags (comma-separated)"
            value={voiceTags}
            onChange={(e) => setVoiceTags(e.target.value)}
            className="w-full p-2 border rounded border-slate-800 col-span-full"
          />
        </div>
      </div>

      {/* Script Settings */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">GPT Scripts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            rows={4}
            placeholder="GPT Script Stage One"
            value={gptScriptStageOne}
            onChange={(e) => setGptScriptStageOne(e.target.value)}
            className="w-full p-4 border rounded-[10px] border-slate-800 outline-none indent-1 "
          />
          <textarea
            rows={4}
            placeholder="GPT Script Stage Two"
            value={gptScriptStageTwo}
            onChange={(e) => setGptScriptStageTwo(e.target.value)}
            className="w-full p-4 border rounded-[10px] border-slate-800 outline-none indent-1 "
          />
          <textarea
            rows={4}
            placeholder="Demo Audio Script"
            value={demoAudioScript}
            onChange={(e) => setDemoAudioScript(e.target.value)}
            className="w-full p-4 border rounded-[10px] border-slate-800 col-span-full outline-none indent-1 "
          />
        </div>
      </div>

      {/* Update Button */}
      <Button
        onClick={handleUpdate}
        className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 transition curso"
      >
        Update Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
