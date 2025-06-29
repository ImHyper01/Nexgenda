// src/components/forms/SignUpForm.tsx

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { registerUserAction } from "@/data/actions/auth-actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/custom/zodErrors";
import { StrapiErrors } from "@/components/custom/strapieErrors";
import { SubmitButton } from "@/components/custom/submitButton";

// 1) User-interface
interface User {
  id: number;
  username: string;
  email: string;
}

// 2) State van het form, we houden alleen de message uit Strapi
interface SignUpFormState {
  zodErrors: Record<string, string[]> | null;
  strapiErrors: { message: string }[] | null;
  data: { jwt: string; user: User } | null;
  message: string | null;
}

// 3) Initial state: alle velden aanwezig
const INITIAL_STATE: SignUpFormState = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SignUpForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );

  // Na succesvolle registratie: token en user opslaan, dan doorsturen
  useEffect(() => {
    if (formState.data?.jwt) {
      localStorage.setItem("jwt", formState.data.jwt);
      localStorage.setItem("user", JSON.stringify(formState.data.user));
      router.push("/dashboard");
    }
  }, [formState.data, router]);

  // Mappen naar de props die StrapiErrors echt nodig heeft (status als string!)
  const errorProps =
    formState.strapiErrors && formState.strapiErrors.length > 0
      ? {
          name: "StrapiError",                   // vul aan naar wens
          status: "400",                          // status als string
          message: formState.strapiErrors[0].message,
        }
      : null;

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Gebruikersnaam */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                required
              />
              <ZodErrors error={formState.zodErrors?.username ?? []} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
              <ZodErrors error={formState.zodErrors?.email ?? []} />
            </div>

            {/* Wachtwoord */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                required
              />
              <ZodErrors error={formState.zodErrors?.password ?? []} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <SubmitButton
              className="w-full"
              text="Sign Up"
              loadingText="Loading..."
            />

            {formState.message && (
              <p className="text-green-600">{formState.message}</p>
            )}

            {errorProps && <StrapiErrors error={errorProps} />}
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm">
          Heb je al een account?
          <Link className="underline ml-2" href="/signIn">
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
