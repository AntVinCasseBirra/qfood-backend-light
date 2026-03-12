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
import { createOperator } from "../action/operator";

export default function NewOperatorComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inputPinCode = document.querySelector("#input-pin") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputPinCode.value = object['pinCode'] ?? "";

            setId(object['_id']);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Operatori" breadThree="Nuovo operatore" active="/new-pos-operator" breadTwoAction={'/operators'}> 
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
                <Field data-invalid={errorFields.includes('pin')}>
                    <FieldLabel htmlFor="input-position">Codice pin*</FieldLabel>
                    <Input id="input-pin" type="number" placeholder="Pin" aria-invalid={errorFields.includes('pin')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "pin");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <div className="flex justify-end mt-[10px]">
                    <Button className="w-[100px]" onClick={async () => {

                        setErrorsFields([]);

                        const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
                        const inputPin = document.querySelector("#input-pin") as HTMLInputElement;
                        const title = inputTitle.value.trim();
                        const pin = Number(inputPin.value.trim());

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(!pin || Number.isNaN(pin) || !Number.isInteger(pin) || pin < 0){
                            errors.push('pin');
                        }
                        
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "pinCode": pin.toString()
                        };

                        setIsLoading(true);
                        const isCreated = await createOperator(payload);
                        setIsLoading(false);
                        
                        if(isCreated){
                            router.push("/operators");
                        }else{
                            toast.error("Errore durante la creazione dell'operatore. Controllare che il PIN risulti duplicato.", {position: "top-right"});
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