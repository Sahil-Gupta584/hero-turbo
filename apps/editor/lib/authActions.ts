"use server";

import { signIn, signOut } from "@/auth";

export async function login(redirectTo: string = "/") {
  await signIn("google", { redirectTo });
}

export async function logOut(redirectTo: string = "/") {
  await signOut({ redirectTo });
}
