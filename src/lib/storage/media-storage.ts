import { LocalMediaStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_CONFIG } from "@/lib/storage/config";
import type { MediaStorageAdapter } from "@/lib/storage/types";

let adapter: MediaStorageAdapter | null = null;

export function getMediaStorageAdapter(): MediaStorageAdapter {
  if (adapter) {
    return adapter;
  }

  if (STORAGE_CONFIG.driver === "local") {
    adapter = new LocalMediaStorageAdapter();
    return adapter;
  }

  throw new Error("UNSUPPORTED_STORAGE_DRIVER");
}
