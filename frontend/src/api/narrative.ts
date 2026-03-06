import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { NarrativeService } from "../gen/narrative_connect";

const transport = createConnectTransport({
  baseUrl: "http://localhost:50051",
});

export const client = createPromiseClient(NarrativeService, transport);

export const generateNarrative = async (prompt: string, tone: string, history: string[]) => {
  return await client.generateNarrative({
    prompt,
    tone,
    history,
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
