'use client'

import BaseLayout from "@/components/base-layout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { now } from "../helper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { createArea } from "../action/area";

export default function NewAreaComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());
    const [availableForWaiter, setAvailableForWaiter] = useState(false);
     const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputPosition.value = object['position'] ? object['position'].toString() : '';

            setId(object['_id']);
            setAvailableForWaiter(object['availableForWaiter'] ?? false);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Aree" breadThree="Nuova area" active="/new-area" breadTwoAction={'/areas'}> 
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
                <Field data-invalid={errorFields.includes('position')}>
                    <FieldLabel htmlFor="input-position">Posizione*</FieldLabel>
                    <Input id="input-position" type="number" placeholder="Posizione" aria-invalid={errorFields.includes('position')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "position");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <div className="flex flex-col gap-[5px] mt-[10px] p-[10px] rounded-sm border">
                    <div className="font-bold">Disponibilità</div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableForWaiter(e);
                        }} checked={availableForWaiter}></Checkbox>Disponibile per cameriere
                    </div>
                </div>
                <div className="flex justify-end mt-[10px]">
                    <Button className="w-[100px]" onClick={async () => {

                        setErrorsFields([]);

                        const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
                        const inputPosition = document.querySelector("#input-position") as HTMLInputElement;
                        const title = inputTitle.value.trim();
                        const position = Number(inputPosition.value.trim());

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(!position || Number.isNaN(position) || !Number.isInteger(position) || position < 0){
                            errors.push('position');
                        }
                        
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "position": position,
                            "availableForWaiter": availableForWaiter
                        };

                        setIsLoading(true);
                        const isCreated = await createArea(payload);
                        setIsLoading(false);
                        
                        if(isCreated){
                            router.push("/areas");
                        }else{
                            toast.error("Errore durante la creazione dell'area", {position: "top-right"});
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