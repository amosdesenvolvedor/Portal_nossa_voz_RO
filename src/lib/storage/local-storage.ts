import fs from "node:fs/promises";
import path from "node:path";
import { STORAGE_CONFIG } from "@/lib/storage/config";
import type { MediaReadResult, MediaStorageAdapter, MediaWriteInput, MediaWriteResult } from "@/lib/storage/types";

function resolvePath(key: string) {
  return path.join(STORAGE_CONFIG.localRoot, key);
}

export class LocalMediaStorageAdapter implements MediaStorageAdapter {
  async write(input: MediaWriteInput): Promise<MediaWriteResult> {
    const targetPath = resolvePath(input.key);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, input.buffer);

    return {
      key: input.key,
      byteLength: input.buffer.byteLength,
    };
  }

  async read(key: string): Promise<MediaReadResult> {
    const targetPath = resolvePath(key);
    const buffer = await fs.readFile(targetPath);

    return {
      key,
      buffer,
    };
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(resolvePath(key));
      return true;
    } catch {
      return false;
    }
  }
}
