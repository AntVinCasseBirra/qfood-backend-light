'use client'

import BaseLayout from "@/components/base-layout";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { now } from "../helper";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "../action/category";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createArticle } from "../action/product";
import { Spinner } from "@/components/ui/spinner";

export default function NewArticleComponent(){

    const router = useRouter();
    const search = useSearchParams();
    const [_id, setId]: [string | null, any] = useState(null);
    const [availableOnWebApp, setAvailableOnWebApp] = useState(false);
    const [availableOnPos, setAvailableOnPos] = useState(false);
    const [availableForWaiter, setAvailableForWaiter] = useState(false);
    const [errorFields, setErrorsFields]: [string[], any] = useState([]); 
    const [render, setRender] = useState(now());
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories]: [any[], any] = useState([]);
    const [idCategory, setIdCategory]: [any, any] = useState(null);
    const [isPreferred, setIsPreferred] = useState(false);

    useEffect(() => {

        // Ottieni tutte le categorie
        getCategories()
        .then((documents_) => {
            setCategories(documents_ ?? []);
        });

        if(search.has('object')){
            
            const queryObject = decodeURIComponent( search.get('object') as string );
            const object = JSON.parse(queryObject);
            
            const inputTitle = document.querySelector("#input-title") as HTMLInputElement;
            const inpuShortDescription = document.querySelector("#input-short-description") as HTMLTextAreaElement;
            const inputLongDescription = document.querySelector("#input-long-description") as HTMLTextAreaElement;
            const inputPrice = document.querySelector("#input-price") as HTMLInputElement;
            const inputRate = document.querySelector("#input-rate") as HTMLInputElement;
            const inputDepartmentNumber = document.querySelector("#input-department-number") as HTMLInputElement;
            const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inpuShortDescription.value = object['shortDescription'] ?? "";
            inputLongDescription.value = object['longDescription'] ?? "";
            inputPrice.value = object['price'].toString();
            inputRate.value = object['rate'].toString();
            inputDepartmentNumber.value = object['departmentNumber'].toString();
            inputPosition.value = object['position'] ? object['position'].toString() : '';

            setId(object['_id']);
            setIdCategory(object['idCategory']);
            setIsPreferred(object['preferred'] ?? false);
            setAvailableOnPos(object['availableOnPos'] ?? false);
            setAvailableOnWebApp(object['availableOnWebApp'] ?? false);
            setAvailableForWaiter(object['availableForWaiter'] ?? false);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Prodotti" breadThree="Nuovo prodotto" active="/new-product" breadTwoAction={'/products'}> 
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
                <div className="flex gap-[10px]">
                    <Field data-invalid={errorFields.includes('shortDescription')}>
                        <FieldLabel htmlFor="input-title">Descrizione breve</FieldLabel>
                        <Textarea id="input-short-description" placeholder="Descrizione breve" aria-invalid={errorFields.includes('shortDescription')} onChange={(e) => {
                            const index = errorFields.findIndex(e => e == "shortDescription");
                            if(index > -1){
                                errorFields.splice(index, 1);
                                setRender(now());
                            }
                        }}/>
                    </Field>
                    <Field data-invalid={errorFields.includes('longDescription')}>
                        <FieldLabel htmlFor="input-title">Descrizione lunga</FieldLabel>
                        <Textarea id="input-long-description" placeholder="Descrizione lunga" aria-invalid={errorFields.includes('longDescription')} onChange={(e) => {
                            const index = errorFields.findIndex(e => e == "longDescription");
                            if(index > -1){
                                errorFields.splice(index, 1);
                                setRender(now());
                            }
                        }}/>
                    </Field>
                </div>
                <div className="flex gap-[10px]">
                    <Field data-invalid={errorFields.includes('price')}>
                        <FieldLabel htmlFor="input-price">Prezzo*</FieldLabel>
                        <Input id="input-price" type="text" placeholder="Prezzo" aria-invalid={errorFields.includes('price')} onChange={(e) => {
                            const index = errorFields.findIndex(e => e == "price");
                            if(index > -1){
                                errorFields.splice(index, 1);
                                setRender(now());
                            }
                        }}/>
                    </Field>
                    <Field data-invalid={errorFields.includes('rate')}>
                        <FieldLabel htmlFor="input-rate">Aliquota*</FieldLabel>
                        <Input id="input-rate" type="text" placeholder="Aliquota" aria-invalid={errorFields.includes('rate')} onChange={(e) => {
                            const index = errorFields.findIndex(e => e == "rate");
                            if(index > -1){
                                errorFields.splice(index, 1);
                                setRender(now());
                            }
                        }}/>
                    </Field>
                </div>
                <Field data-invalid={errorFields.includes('departmentNumber')}>
                    <FieldLabel htmlFor="input-price">Numero di reparto*</FieldLabel>
                    <Input id="input-department-number" type="text" placeholder="Numero di reparto" aria-invalid={errorFields.includes('departmentNumber')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "departmentNumber");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <div className="flex flex-col gap-[5px]">
                    <div className="font-medium text-sm">Categoria*</div>
                    <Select value={idCategory} onValueChange={(e) => {
                        const index = errorFields.findIndex(e => e == "category");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                        setIdCategory(e);
                    }}>
                        <SelectTrigger className="w-full" aria-invalid={errorFields.includes('category')}>
                            <SelectValue placeholder="Seleziona una categoria">
                                {
                                    idCategory ? 
                                        categories.find(c => c._id == idCategory)?.title
                                    :
                                        <>Seleziona una categoria</>
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categorie</SelectLabel>
                                {
                                    categories.map((item: any, index) => 
                                        <SelectItem value={item._id}>{item.title}</SelectItem>
                                    )
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
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
                        setIsPreferred(e);
                    }} checked={isPreferred}></Checkbox>Preferito
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
                        const inputShort = document.querySelector("#input-short-description") as HTMLTextAreaElement;
                        const inputLong = document.querySelector("#input-long-description") as HTMLTextAreaElement;
                        const inputPrice = document.querySelector("#input-price") as HTMLInputElement;
                        const inputRate = document.querySelector("#input-rate") as HTMLInputElement;
                        const inputDepartment = document.querySelector("#input-department-number") as HTMLInputElement;
                        const inputPosition = document.querySelector("#input-position") as HTMLInputElement;

                        const title = inputTitle.value.trim();
                        const shortDescription = inputShort.value.trim();
                        const longDescription = inputLong.value.trim();
                        const price = Number(inputPrice.value.trim().split(",").join("."));
                        const rate = Number(inputRate.value.trim().split(",").join("."));
                        const department = Number(inputDepartment.value.trim());
                        const position = Number(inputPosition.value.trim());

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(!price || Number.isNaN(price) || price < 0){
                            errors.push('price');
                        }
                        if(!rate || Number.isNaN(rate) || rate <= 0){
                            errors.push('rate');
                        }
                        if(!department || Number.isNaN(department) || !Number.isInteger(department) || department < 0){
                            errors.push('departmentNumber');
                        }
                        if(!position || Number.isNaN(position) || !Number.isInteger(position) || position < 0){
                            errors.push('position');
                        }
                        if(!idCategory){
                            errors.push("category");
                        }
                        
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "shortDescription": shortDescription,
                            "longDescription": longDescription,
                            "price": price,
                            "rate": rate,
                            "departmentNumber": department,
                            "idCategory": idCategory,
                            "preferred": isPreferred,
                            "position": position,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos,
                            "availableForWaiter": availableForWaiter
                        };

                        setIsLoading(true);
                        const isCreated = await createArticle(payload);
                        setIsLoading(false);
                        if(isCreated){
                            router.push("/products");
                        }else{
                            toast.error('Errore durante la creazione del prodotto', {position: "top-right"});
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