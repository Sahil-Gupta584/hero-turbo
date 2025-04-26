"use server";

import { signIn } from "@/auth";

export async function login(redirectTo: string = "/") {
  await signIn("google", { redirectTo });
}
