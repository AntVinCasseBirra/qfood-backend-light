'use client';

import BaseLayout from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { now } from "../helper";
import { createCompany } from "../action/company";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {

    const [errorFields, setErrorFields]: [string[], any] = useState([]);
    const [render, setRender]: [number, any] = useState(now());
    const [isLoading, setIsLoading] = useState(false);
    const [activeModules, setActiveModules]: [any[], any] = useState([]);
    const [isReseller, setIsReseller]: [boolean, any] = useState(false);
    const router = useRouter();

    return (
        <BaseLayout breadOne="Dashboard" breadTwo="Aziende" breadThree="Nuova azienda" breadTwoAction={"/companies"} active="/new-company">
            <div className="flex flex-col gap-[10px]">
                <Field data-invalid={errorFields.includes('title')}>
                    <FieldLabel htmlFor="input-title">Titolo*</FieldLabel>
                    <Input id="input-title" type="text" placeholder="Titolo" aria-invalid={errorFields.includes('title')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "title");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('email')}>
                    <FieldLabel htmlFor="input-email">Email*</FieldLabel>
                    <Input id="input-email" type="text" aria-invalid={errorFields.includes('email')} placeholder="info@example.com" onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "email");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('password')}>
                    <FieldLabel htmlFor="input-password">Password*</FieldLabel>
                    <Input id="input-password" type="text" placeholder="Password cliente" aria-invalid={errorFields.includes('password')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "password");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <div className="flex items-center gap-[5px]">
                    <Checkbox onCheckedChange={(e) => setIsReseller(e)}></Checkbox>È un rivenditore
                </div>
                <div className="flex flex-col gap-[5px] mt-[10px] p-[10px] rounded-sm border">
                    <div className="font-bold">Moduli attivi</div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            if(e){
                                activeModules.push('waiter');
                            }else{
                                const index = activeModules.findIndex(a => a == "waiter");
                                if(index > -1){
                                    activeModules.splice(index);
                                }
                            }
                        }}></Checkbox>Cameriere
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            if(e){
                                activeModules.push('self_order');
                            }else{
                                const index = activeModules.findIndex(a => a == "self_order");
                                if(index > -1){
                                    activeModules.splice(index);
                                }
                            }
                        }}></Checkbox>Ordine al tavolo
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            if(e){
                                activeModules.push('digital_menu');
                            }else{
                                const index = activeModules.findIndex(a => a == "digital_menu");
                                if(index > -1){
                                    activeModules.splice(index);
                                }
                            }
                        }}></Checkbox>Menù digitale
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            if(e){
                                activeModules.push('aruba');
                            }else{
                                const index = activeModules.findIndex(a => a == "aruba");
                                if(index > -1){
                                    activeModules.splice(index);
                                }
                            }
                        }}></Checkbox>Aruba
                    </div>
                </div>
                <div className="flex justify-end mt-[10px]">
                    <Button className="w-[100px]" onClick={async () => {

                        setErrorFields([]);

                        const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
                        const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
                        const inputPassw = document.querySelector("#input-password") as HTMLInputElement;

                        const title = inputTitle.value.trim();
                        const email = inputEmail.value.trim();
                        const passw = inputPassw.value.trim();

                        const errors = [];
                        if(!title){
                            errors.push('title');
                        }
                        if(!email){
                            errors.push('email');
                        }
                        if(!passw){
                            errors.push('password');
                        }
                        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
                            errors.push('email');
                        }
                        if(errors.length > 0){
                            setErrorFields(errors);
                            return;
                        }

                        setIsLoading(true);

                        const payload = 
                            {
                                "title": title,
                                "email": email,
                                "password": passw,
                                "isReseller": isReseller,
                                "activeModules": activeModules
                            };

                        const isCreated = await createCompany(payload);
                        setIsLoading(false);
                        if(isCreated){
                            router.push("/companies");
                        }else{
                            toast.error("Si è verificato un errore durante la creazione dell'azienda");
                        }

                    }} disabled={isLoading}>
                        Salva
                        {
                            isLoading &&
                            <Spinner/>
                        }
                    </Button>
                </div>
            </div>
        </BaseLayout>
    );
}
