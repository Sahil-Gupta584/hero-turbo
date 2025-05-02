"use client";
import { login } from "@/lib/authActions";
import { AuthPage } from "@repo/ui";

export default function Page() {
  return (
    <AuthPage
      role="CREATOR"
      onClick={async () => {
        await login(`/videos`);
      }}
    />
  );
}
