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
import { createArea, getAreas } from "../action/area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStation } from "../action/stations";

export default function NewStationComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());
    const [availableForWaiter, setAvailableForWaiter] = useState(false);
    const [availableOnWebApp, setAvailableOnWebApp] = useState(false);
    const [areas, setAreas]: [any[], any] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [idArea, setIdArea]: [any, any] = useState(null);

    useEffect(() => {

        getAreas()
        .then((documents_) => {
            setAreas(documents_ ?? []);
        });

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputPosition.value = object['position'] ? object['position'].toString() : '';

            setId(object['_id']);
            setAvailableForWaiter(object['availableForWaiter'] ?? false);
            setAvailableOnWebApp(object['availableOnWebApp'] ?? false);
            setIdArea(object['idArea']);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Stazioni" breadThree="stazione" active="/new-station" breadTwoAction={'/stations'}> 
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
                <div className="flex flex-col gap-[5px]">
                    <div className="font-medium text-sm">Area*</div>
                    <Select value={idArea} onValueChange={(e) => {
                        const index = errorFields.findIndex(e => e == "area");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                        setIdArea(e);
                    }}>
                        <SelectTrigger className="w-full" aria-invalid={errorFields.includes('area')}>
                            <SelectValue placeholder="Seleziona un'area">
                                {
                                    idArea ? 
                                        areas.find(c => c._id == idArea)?.title
                                    :
                                        <>Seleziona un'area</>
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Aree</SelectLabel>
                                {
                                    areas.map((item: any, index) => 
                                        <SelectItem value={item._id}>{item.title}</SelectItem>
                                    )
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-[5px] mt-[10px] p-[10px] rounded-sm border">
                    <div className="font-bold">Disponibilità</div>
                    <div className="flex items-center gap-[5px]">
                        <Checkbox onCheckedChange={(e) => {
                            setAvailableOnWebApp(e);
                        }} checked={availableOnWebApp}></Checkbox>Disponibile per webapp
                    </div>
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
                        if(!idArea){
                            errors.push('area');
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
                            "idArea": idArea,
                            "availableForWaiter": availableForWaiter,
                            "availableOnWebApp": availableOnWebApp
                        };

                        setIsLoading(true);
                        const isCreated = await createStation(payload);
                        setIsLoading(false);
                        
                        if(isCreated){
                            router.push("/stations");
                        }else{
                            toast.error("Errore durante la creazione della stazione", {position: "top-right"});
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