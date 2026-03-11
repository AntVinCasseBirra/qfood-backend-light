'use client'

import BaseLayout from "@/components/base-layout";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { now } from "../helper";
import { SketchPicker } from 'react-color';
import { Checkbox } from "@/components/ui/checkbox";
import { createCategory } from "../action/category";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewCategoryComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [color, setColor] = useState("#000000");
    const [availableOnWebApp, setAvailableOnWebApp] = useState(false);
    const [availableOnPos, setAvailableOnPos] = useState(false);
    const [availableForWaiter, setAvailableForWaiter] = useState(false);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());

    useEffect(() => {

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputPosition.value = object['position'] ? object['position'].toString() : '';

            setId(object['_id']);
            setColor(object['color'] ?? "#000000");
            setAvailableOnPos(object['availableOnPos'] ?? false);
            setAvailableOnWebApp(object['availableOnWebApp'] ?? false);
            setAvailableForWaiter(object['availableForWaiter'] ?? false);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Categorie" breadThree="Nuova categoria" active="/new-category" breadTwoAction={'/categories'}> 
            <div className="flex flex-col gap-[10px]">
                <Field data-invalid={errorFields.includes('title')}>
                    <FieldLabel htmlFor="input-title">Titolo</FieldLabel>
                    <Input id="input-title" type="text" placeholder="Titolo" aria-invalid={errorFields.includes('title')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "title");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                    <FieldDescription>
                        Identificativo categoria
                    </FieldDescription>
                </Field>
                <Field data-invalid={errorFields.includes('position')}>
                    <FieldLabel htmlFor="input-position">Posizione</FieldLabel>
                    <Input id="input-position" type="number" placeholder="Posizione" aria-invalid={errorFields.includes('position')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "position");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                    <FieldDescription>
                        Posizione generale
                    </FieldDescription>
                </Field>
                <div className="font-bold text-sm">Colore categoria</div>
                <SketchPicker color={color} onChange={(e) => {
                    setColor(e.hex);
                }}/>
                <div className="flex flex-col gap-[5px] mt-[10px] p-[10px] rounded-sm border">
                    <div className="font-bold">Disponibilità</div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableOnPos(e);
                        }} checked={availableOnPos}></Checkbox>Disponibile per POS
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableForWaiter(e);
                        }} checked={availableForWaiter}></Checkbox>Disponibile per cameriere
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
                        const title = inputTitle.value.trim();
                        const position = Number(inputPosition.value.trim());

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(!position || Number.isNaN(position) || !Number.isInteger(position)){
                            errors.push('position');
                        }
                        
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "color": color ?? "#000000",
                            "position": position,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos,
                            "availableForWaiter": availableForWaiter
                        };
                        const isCreated = await createCategory(payload);
                        if(isCreated){
                            router.push("/categories");
                        }else{
                            toast.error('Errore durante la creazione della categoria', {position: "top-right"});
                        }

                    }}>Salva</Button>
                </div>
            </div>
        </BaseLayout>
    );
}