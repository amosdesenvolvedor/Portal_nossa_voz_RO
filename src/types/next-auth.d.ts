import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "EDITOR" | "AUTHOR";
    };
  }

  interface User {
    role: "ADMIN" | "EDITOR" | "AUTHOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "EDITOR" | "AUTHOR";
  }
}
