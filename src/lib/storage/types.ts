export type MediaVariant = "original" | "display" | "thumbnail";

export type MediaWriteInput = {
  key: string;
  buffer: Buffer;
  contentType: string;
};

export type MediaWriteResult = {
  key: string;
  byteLength: number;
};

export type MediaReadResult = {
  key: string;
  buffer: Buffer;
};

export interface MediaStorageAdapter {
  write(input: MediaWriteInput): Promise<MediaWriteResult>;
  read(key: string): Promise<MediaReadResult>;
  exists(key: string): Promise<boolean>;
}
