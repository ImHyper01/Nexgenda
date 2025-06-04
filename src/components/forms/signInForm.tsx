// src/components/SigninForm.tsx

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { loginUserAction } from "@/data/actions/auth-actions";

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

interface SigninFormState {
  zodErrors: Record<string, string[]> | null;
  strapiErrors: Array<{ message: string }> | null;
  data: { jwt: string; user: any } | null;
  message: string | null;
}

const INITIAL_STATE: SigninFormState = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

export function SigninForm() {
  const router = useRouter();
  const [formState, formAction] = useActionState(loginUserAction, INITIAL_STATE);

  // Zodra we formState.data.jwt hebben, bewaren we dit in localStorage en navigeren we door
  useEffect(() => {
    if (formState.data?.jwt) {
      // 1) JWT in localStorage opslaan
      localStorage.setItem("jwt", formState.data.jwt);

      // 2) Eventueel user-gegevens opslaan
      localStorage.setItem("user", JSON.stringify(formState.data.user));

      // 3) Navigeren naar dashboard
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
              Vul je e-mail en wachtwoord in om in te loggen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email of gebruikersnaam</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="email@example.com"
                required
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
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
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <SubmitButton
              className="w-full"
              text="Sign In"
              loadingText="Bezig met inloggen..."
            />
            {formState.message && (
              <p className="text-green-600">{formState.message}</p>
            )}
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm">
          Nog geen account?
          <Link className="underline ml-2" href="/signup">
            Registreer hier
          </Link>
        </div>
      </form>
    </div>
  );
}
