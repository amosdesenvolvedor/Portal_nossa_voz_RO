export function getAiImageProviderStatus() {
  const provider = process.env.AI_IMAGE_PROVIDER?.trim() || "none";
  const model = process.env.AI_IMAGE_MODEL?.trim() || "";

  return {
    provider,
    model,
    available: false,
  };
}
