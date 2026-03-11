'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { logIn } from "@/app/action/auth";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [isLoading, setIsLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Benvenuto</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Inserire email e password per accedere
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="input-email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <InputGroup>
            <InputGroupInput id="input-password" type={showPassword ? "text" : "password"} required/>
            <InputGroupAddon align="inline-end" onClick={() => {
              setShowPassword(!showPassword);
            }} className="cursor-pointer">
              {
                !showPassword ? 
                  <EyeIcon />
                :
                  <EyeClosedIcon/>
              }
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button type="submit" onClick={async (e) => {

            e.preventDefault();
            setIsLoading(true);
            setLoginFailed(false);

            const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
            const inputPassword = document.querySelector("#input-password") as HTMLInputElement;

            const email = inputEmail.value.trim();
            const password = inputPassword.value;

            if(email.length > 0 && password.length > 0){
              const loginResult = await logIn({email, password});
              if(loginResult.isLogged){
                window.location.href = "/dashboard";
              }else{
                setLoginFailed(true);
              }
            }

            setIsLoading(false);

          }} disabled={isLoading} size={"lg"}>
            Login
            {
              isLoading &&
                <Spinner/>
            }
          </Button>
          {
            loginFailed &&
              <div className="mt-[10px] text-red-700">Login fallito, riprova</div>
          }
        </Field>
      </FieldGroup>
    </form>
  )
}
