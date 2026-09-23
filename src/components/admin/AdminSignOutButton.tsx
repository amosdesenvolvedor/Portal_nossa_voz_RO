"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function AdminSignOutButton() {
  return (
    <Button variant="outline" size="sm" className="h-11 px-4" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      Sair
    </Button>
  );
}
