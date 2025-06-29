// src/components/forms/SignInForm.tsx

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
import { StrapiErrors} from "@/components/custom/strapieErrors";
import { SubmitButton } from "@/components/custom/submitButton";

// Interface voor de gebruiker
interface User {
  id: number;
  username: string;
  email: string;
}

// State-interface voor inlogformulier
interface SignInFormState {
  zodErrors: Record<string, string[]> | null;
  strapiErrors: { message: string }[] | null;
  data: { jwt: string; user: User } | null;
  message: string | null;
}

const INITIAL_STATE: SignInFormState = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SignInForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(
    registerUserAction,
    INITIAL_STATE
  );

  // Na succesvol inloggen: token + user opslaan en doorsturen
  useEffect(() => {
    if (formState.data?.jwt) {
      localStorage.setItem("jwt", formState.data.jwt);
      localStorage.setItem("user", JSON.stringify(formState.data.user));
      router.push("/dashboard");
    }
  }, [formState.data, router]);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Log in met je gebruikersnaam of e-mail en wachtwoord
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">E-mail of gebruikersnaam</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="gebruikersnaam of e-mail"
                required
              />
              <ZodErrors error={formState.zodErrors?.identifier ?? []} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="wachtwoord"
                required
              />
              <ZodErrors error={formState.zodErrors?.password ?? []} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <SubmitButton
              className="w-full"
              text="Inloggen"
              loadingText="Bezig met inloggen..."
            />

            {formState.message && (
              <p className="text-green-600">{formState.message}</p>
            )}

            {formState.strapiErrors && formState.strapiErrors.length > 0 && (
              <StrapiErrors
                error={{
                  // Vul hier de echte Strapi-waarden in als je ze hebt:
                  name: "StrapiError",  
                  status: '400',         
                  message: formState.strapiErrors[0].message,
                }}
              />
            )}
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm">
          Heb je nog geen account?
          <Link className="underline ml-2" href="/signUp">
            Maak er één aan
          </Link>
        </div>
      </form>
    </div>
  );
}
