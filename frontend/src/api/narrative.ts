import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { NarrativeService } from "../gen/narrative_connect";

const transport = createConnectTransport({
  baseUrl: "http://localhost:50051",
});

export const client = createPromiseClient(NarrativeService, transport);

export const generateNarrative = async (prompt: string, tone: string, history: string[], language: string) => {
  return await client.generateNarrative({
    prompt,
    tone,
    history,
    language,
  });
};

export const generateImage = async (prompt: string, playerPhoto?: string) => {
  // Strip the "data:image/png;base64," prefix if it's there
  const photo = playerPhoto?.startsWith("data:image") 
    ? playerPhoto.split(",")[1] 
    : playerPhoto;

  const response = await client.generateImage({
    prompt,
    playerPhoto: photo,
  });
  // Convert bytes to base64
  const base64 = btoa(
    new Uint8Array(response.imageData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return base64;
};

export const generateAudio = async (text: string, language: string) => {
  const response = await client.generateAudio({
    text,
    language,
  });

  // Convert bytes to base64
  const base64 = btoa(
    new Uint8Array(response.audioData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  
  return {
    audioData: base64,
    mimeType: response.mimeType,
  };
};

export const playAudio = (base64Data: string, mimeType: string) => {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play().catch(err => console.error("Error playing audio:", err));
  
  // Clean up the URL after playback
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };
};
