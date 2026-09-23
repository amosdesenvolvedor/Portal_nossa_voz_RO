export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSafeHttpUrlOrPath(value: string): boolean {
  if (value.startsWith("/")) {
    return true;
  }

  return isSafeHttpUrl(value);
}
