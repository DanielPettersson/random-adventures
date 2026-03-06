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

const addWavHeader = (pcmData: Uint8Array, sampleRate: number): Blob => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmData.length, true); // file length
  view.setUint32(8, 0x57415645, false); // "WAVE"
  
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // format chunk length
  view.setUint16(20, 1, true); // sample format (PCM)
  view.setUint16(22, 1, true); // channel count (Mono)
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate (sample rate * block align)
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcmData.length, true); // data chunk length
  
  return new Blob([header, pcmData], { type: 'audio/wav' });
};

export const playAudio = (base64Data: string, mimeType: string) => {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  let blob: Blob;
  if (mimeType.includes('audio/L16')) {
    const rateMatch = mimeType.match(/rate=(\d+)/);
    const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
    blob = addWavHeader(bytes, sampleRate);
  } else {
    blob = new Blob([bytes], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play().catch(err => console.error("Error playing audio:", err));
  
  // Clean up the URL after playback
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };
};
