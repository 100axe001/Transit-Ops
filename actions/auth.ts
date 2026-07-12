"use server";

import { authService } from "@/lib/services";
import { redirect } from "next/navigation";

export async function loginAction(formData: { email: string; password: string }) {
  try {
    await authService.login(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" };
  }
  redirect("/dashboard");
}

export async function registerAction(formData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    await authService.register(formData);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Registration failed" };
  }
  redirect("/dashboard");
}

export async function logoutAction() {
  await authService.logout();
  redirect("/login");
}
