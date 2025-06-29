// src/data/actions/auth-actions.ts

"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { registerUserService, loginUserService } from "@/data/services/auth-service";

// Typing van de state voor registratie en login
interface AuthErrors {
  zodErrors: Record<string, string[]> | null;
  strapiErrors: Array<{ message: string }> | null;
  message: string | null;
}

interface AuthData<UserType> {
  jwt: string;
  user: UserType;
}

interface AuthState<UserType> extends AuthErrors {
  data: AuthData<UserType> | null;
}

// Voorbeeld gebruikersinterface, pas aan naar gelang jouw backend
interface User {
  id: number;
  username: string;
  email: string;
}


// Schema voor registratie (illustratie)
const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function registerUserAction(
  prevState: AuthState<User>,
  formData: FormData
): Promise<AuthState<User>> {
  const parsed = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: parsed.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const response = await registerUserService(parsed.data);

  if (!response) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
      data: null,
    };
  }

  if (response.error) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: response.error,
      message: "Failed to Register.",
      data: null,
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    data: { jwt: response.jwt, user: response.user },
    message: "Registration succeeded!",
  };
}

// Schema voor login
type Credentials = {
  identifier: string;
  password: string;
};

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier must have at least 3 or more characters" })
    .max(50, { message: "Please enter a valid username or email address" }),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 or more characters" })
    .max(100, { message: "Password must be between 6 and 100 characters" }),
});

export async function loginUserAction(
  prevState: AuthState<User>,
  formData: FormData
): Promise<AuthState<User>> {
  const parsed = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      zodErrors: parsed.error.flatten().fieldErrors,
      strapiErrors: null,
      data: null,
      message: "Vul zowel e-mail/gebruikersnaam als wachtwoord correct in.",
    };
  }

  const creds: Credentials = parsed.data;
  const response = await loginUserService(creds);

  if (!response) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      data: null,
      message: "Er ging iets mis. Probeer opnieuw.",
    };
  }

  if (response.error) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: response.error,
      data: null,
      message: null,
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    data: { jwt: response.jwt, user: response.user },
    message: "Inloggen geslaagd!",
  };
}

// Optioneel: logoutAction laat je een lege JWT teruggeven en redirect naar home
export async function logoutAction(): Promise<void> {
  redirect("/");
}
