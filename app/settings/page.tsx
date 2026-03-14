'use client'

import BaseLayout from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { getSettings, storeSettings } from "../action/settings";
import { toast } from "sonner";

export default function Page(){

    const [isLoading, setIsLoading] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {

        getSettings()
        .then((document_) => {

            setLoadingSettings(false);

            const inputApiKeyFiskaly = document.querySelector("#input-api-key-fiskaly") as HTMLInputElement;
            const inputApiSecretFiskaly = document.querySelector("#input-api-secret-fiskaly") as HTMLInputElement;
            const inputCervedKey = document.querySelector("#input-cerved-key") as HTMLInputElement;

            if(document_){
                inputApiKeyFiskaly.value = document_.fiskalyApiKey ?? "";
                inputApiSecretFiskaly.value = document_.fiskalyApiSecret ?? "";
                inputCervedKey.value = document_.cervedKey ?? "";
            }

        });

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Impostazioni" active="/settings">
            {
                loadingSettings &&
                <div className="flex items-center gap-[5px] text-sm">
                    <Spinner/>
                    Caricamento...
                </div>
            }
            <div className="flex flex-col gap-[10px]">
                <Field>
                    <FieldLabel htmlFor="input-api-key-fiskaly">Api Key Fiskaly</FieldLabel>
                    <Input id="input-api-key-fiskaly" type="text" placeholder="Api Key Fiskaly"/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="input-api-secret-fiskaly">Api Secret Fiskaly</FieldLabel>
                    <Input id="input-api-secret-fiskaly" type="text" placeholder="Api Secret Fiskaly"/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="input-cerved-key">Cerved Key</FieldLabel>
                    <Input id="input-cerved-key" type="text" placeholder="Cerved Key"/>
                </Field>
                <div className="flex justify-end mt-[10px]">
                    <Button className="w-[100px]" onClick={async () => {

                        const inputApiKeyFiskaly = document.querySelector("#input-api-key-fiskaly") as HTMLInputElement;
                        const inputApiSecretFiskaly = document.querySelector("#input-api-secret-fiskaly") as HTMLInputElement;
                        const inputCervedKey = document.querySelector("#input-cerved-key") as HTMLInputElement;

                        const fiskalyApiKey = inputApiKeyFiskaly.value.trim();
                        const fiskalyApiSecret = inputApiSecretFiskaly.value.trim();
                        const cervedKey = inputCervedKey.value.trim();

                        setIsLoading(true);

                        const isCreated = 
                            await storeSettings(
                                { "fiskalyApiKey": fiskalyApiKey, "fiskalyApiSecret": fiskalyApiSecret, "cervedKey": cervedKey }
                            );
                        setIsLoading(false);
                        
                        if(isCreated){
                            toast.info("Impostazioni salvate", {position: "top-right"});
                        }else{
                            toast.error("Errore durante salvataggio impostazioni", {position: "top-right"});
                        }

                    }} disabled={isLoading || loadingSettings}>
                        Salva
                        {
                            (isLoading || loadingSettings) &&
                            <Spinner/>
                        }
                    </Button>
                </div>
            </div>
        </BaseLayout>
    );
}