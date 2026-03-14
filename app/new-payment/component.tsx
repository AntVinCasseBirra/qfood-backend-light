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
import { createPayment } from "../action/payment";

export default function NewPaymentComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());
    const [availableOnPos, setAvailableOnPos] = useState(false);
    const [availableOnWebApp, setAvailableOnWebApp] = useState(false);
    const [cashPayment, setCashPayment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inputTend = document.querySelector("#input-tend") as HTMLInputElement;
            const inputSubTend = document.querySelector("#input-sub-tend") as HTMLInputElement;
            const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputPosition.value = object['position'] ? object['position'].toString() : '';

            setId(object['_id']);
            setAvailableOnPos(object['availableOnPos'] ?? false);
            setAvailableOnWebApp(object['availableOnWebApp'] ?? false);
            setCashPayment(object['cashPayment'] ?? false);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Pagamenti" breadThree="Nuovo pagamento" active="/new-payment" breadTwoAction={'/payments'}> 
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
                <Field data-invalid={errorFields.includes('tend')}>
                    <FieldLabel htmlFor="input-tend">Tend stampante</FieldLabel>
                    <Input id="input-tend" type="number" placeholder="Tend" aria-invalid={errorFields.includes('tend')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "tend");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('subtend')}>
                    <FieldLabel htmlFor="input-subtend">Subtend stampante</FieldLabel>
                    <Input id="input-subtend" type="number" placeholder="Subtend" aria-invalid={errorFields.includes('subtend')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "subtend");
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
                <div className="flex items-center gap-[5px]">
                    <Checkbox onCheckedChange={(e) => {
                        setCashPayment(e);
                    }} checked={cashPayment}></Checkbox>È un pagamento contante
                </div>
                <div className="flex flex-col gap-[5px] mt-[10px] p-[10px] rounded-sm border">
                    <div className="font-bold">Disponibilità</div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableOnPos(e);
                        }} checked={availableOnPos}></Checkbox>Disponibile per POS
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableOnWebApp(e);
                        }} checked={availableOnWebApp}></Checkbox>Disponibile per webapp
                    </div>
                </div>
                <div className="flex justify-end mt-[10px]">
                    <Button className="w-[100px]" onClick={async () => {

                        setErrorsFields([]);

                        const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
                        const inputPosition = document.querySelector("#input-position") as HTMLInputElement;
                        const inputTend = document.querySelector("#input-tend") as HTMLInputElement;
                        const inputSubTend = document.querySelector("#input-subtend") as HTMLInputElement;
                        const title = inputTitle.value.trim();
                        const position = Number(inputPosition.value.trim());
                        let tend = null;
                        let subTend = null;

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(!position || Number.isNaN(position) || !Number.isInteger(position) || position < 0){
                            errors.push('position');
                        }
                        if(inputTend.value.trim().length > 0){
                            tend = Number(inputTend.value.trim());
                        }
                        if(inputSubTend.value.trim().length > 0){
                            subTend = Number(inputSubTend.value.trim());
                        }
                        
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "position": position,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos,
                            "cashPayment": cashPayment,
                            "printerTend": tend ? tend.toString() : null,
                            "printerSubTend": subTend ? subTend.toString() : null
                        };

                        setIsLoading(true);
                        const isCreated = await createPayment(payload);
                        setIsLoading(false);
                        
                        if(isCreated){
                            router.push("/payments");
                        }else{
                            toast.error("Errore durante la creazione del pagamento", {position: "top-right"});
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