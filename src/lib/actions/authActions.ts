"use server";

import { logIn } from "@/lib/auth";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await logIn(formData);
  } catch (error: any) {
    if (error) {
      switch (error.type) {
        case "CredentialsError":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
