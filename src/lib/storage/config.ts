import path from "node:path";

const DEFAULT_ROOT = path.join(process.cwd(), ".local_storage", "editorial-media");

export const STORAGE_CONFIG = {
  driver: process.env.MEDIA_STORAGE_DRIVER?.trim() || "local",
  localRoot: process.env.MEDIA_STORAGE_LOCAL_ROOT?.trim() || DEFAULT_ROOT,
};
