export interface ElevenLabsSettings {
  model_id: string;
  stability: number;
  speed: number;
  style: number;
  voiceTags: string;
}

export interface AdminSettingsPayload {
  elevenLabsSettings: ElevenLabsSettings;
  gptScriptStageOne: string;
  gptScriptStageTwo: string;
  demoAudioScript: string;
}
