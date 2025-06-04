// src/data/actions/auth-actions.ts

"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { registerUserService, loginUserService } from "@/data/services/auth-service";

// Schema voor registratie (gebruiken we wel, ter illustratie)
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

export async function registerUserAction(prevState: any, formData: FormData) {
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const responseData = await registerUserService(validatedFields.data);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  // Óók bij registratie geef je de JWT aan de client terug (in data), mocht je dat willen:
  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    data: { jwt: responseData.jwt, user: responseData.user },
    message: "Registration succeeded!",
  };
}


// Schema voor login
const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .max(50, {
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must have at least 6 or more characters",
    })
    .max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  // 1) Valideer de invoer met Zod
  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      data: null,
      message: "Vul zowel e-mail/gebruikersnaam als wachtwoord correct in.",
    };
  }

  const { identifier, password } = validatedFields.data;

  // 2) Vraag loginUserService aan (die een POST naar Strapi /api/auth/local stuurt)
  const responseData = await loginUserService({ identifier, password });

  if (!responseData) {
    // Geen respons of network error
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      data: null,
      message: "Er ging iets mis. Probeer opnieuw.",
    };
  }

  if (responseData.error) {
    // Strapi gaf een foutmelding terug (bv. onjuiste inloggegevens)
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      data: null,
      message: null,
    };
  }

  // 3) Succes: Strapi gaf { jwt, user } terug
  // Return de JWT én user-spullen in data, zodat de client ze kan gebruiken
  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    data: { jwt: responseData.jwt, user: responseData.user },
    message: "Inloggen geslaagd!",
  };
}


// Optioneel: logoutAction laat je een lege JWT-teruggeve en redirect naar home
export async function logoutAction() {
  // Hier zou je op client‐niveau de JWT uit localStorage verwijderenen
  // Maar omdat dit een server‐action is, redirecten we gewoon naar "/"
  redirect("/");
}
