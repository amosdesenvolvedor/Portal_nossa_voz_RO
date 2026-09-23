const REQUIRED_PRODUCTION_ENV = [
  "AUTH_SECRET",
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export function getMissingRequiredProductionEnv(): string[] {
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  return REQUIRED_PRODUCTION_ENV.filter((name) => {
    const value = process.env[name];
    return !value || !value.trim();
  });
}
