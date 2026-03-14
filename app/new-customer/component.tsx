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
import { createCustomer } from "../action/customer";

export default function NewCustomerComponent(){

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
            const inputFirstname = document.querySelector("#input-firstname") as HTMLInputElement;
            const inputLastname = document.querySelector("#input-lastname") as HTMLInputElement;
            const inputVatNumber = document.querySelector("#input-vat-number") as HTMLInputElement;
            const inputFiscalCode = document.querySelector("#input-fiscal-code") as HTMLInputElement;
            const inputBusinessName = document.querySelector("#input-business-name") as HTMLInputElement;
            const inputAddress = document.querySelector("#input-address") as HTMLInputElement;
            const inputCity = document.querySelector("#input-city") as HTMLInputElement;
            const inputZipCode = document.querySelector("#input-zip-code") as HTMLInputElement;
            const inputProvince = document.querySelector("#input-province") as HTMLInputElement;
            const inputCountry = document.querySelector("#input-country") as HTMLInputElement;
            const inputPhone = document.querySelector("#input-phone") as HTMLInputElement;
            const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
            const inputSdiCode = document.querySelector("#input-sdi-code") as HTMLInputElement;
            const inputPec = document.querySelector("#input-pec") as HTMLInputElement;

            inputTitle.value = object['title'] ?? "";
            inputFirstname.value = object['firstname'] ?? "";
            inputLastname.value = object['lastname'] ?? "";
            inputVatNumber.value = object['vatNumber'] ?? "";
            inputBusinessName.value = object['businessName'] ?? "";
            inputAddress.value = object['address'] ?? "";
            inputCity.value = object['city'] ?? "";
            inputZipCode.value = object['zipCode'] ?? "";
            inputProvince.value = object['province'] ?? "";
            inputCountry.value = object['country'] ?? "";
            inputPhone.value = object['phone'] ?? "";
            inputEmail.value = object['email'] ?? "";
            inputSdiCode.value = object['sdiCode'] ?? "";
            inputPec.value = object['pec'] ?? "";
            inputFiscalCode.value = object['fiscalCode'] ?? "";

            setId(object['_id']);

        }

    }, []);

    return (
        <BaseLayout breadOne="Piattaforma" breadTwo="Clienti" breadThree="Nuovo cliente" active="/new-customer" breadTwoAction={'/customers'}> 
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
                <Field data-invalid={errorFields.includes('businessName')}>
                    <FieldLabel htmlFor="input-business-name">Ragione sociale</FieldLabel>
                    <Input id="input-business-name" type="text" placeholder="Ragione sociale" aria-invalid={errorFields.includes('businessName')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "businessName");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('vatNumber')}>
                    <FieldLabel htmlFor="input-vat-number">Partita IVA</FieldLabel>
                    <Input id="input-vat-number" type="text" placeholder="Partita IVA" aria-invalid={errorFields.includes('vatNumber')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "vatNumber");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('fiscalCode')}>
                    <FieldLabel htmlFor="input-fiscal-code">Codice fiscale</FieldLabel>
                    <Input id="input-fiscal-code" type="text" placeholder="Codice fiscale" aria-invalid={errorFields.includes('fiscalCode')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "fiscalCode");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('firstname')}>
                    <FieldLabel htmlFor="input-firstname">Nome</FieldLabel>
                    <Input id="input-firstname" type="text" placeholder="Nome" aria-invalid={errorFields.includes('firstname')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "firstname");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('lastname')}>
                    <FieldLabel htmlFor="input-lastname">Cognome</FieldLabel>
                    <Input id="input-lastname" type="text" placeholder="Cognome" aria-invalid={errorFields.includes('lastname')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "lastname");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('address')}>
                    <FieldLabel htmlFor="input-address">Indirizzo</FieldLabel>
                    <Input id="input-address" type="text" placeholder="Indirizzo" aria-invalid={errorFields.includes('address')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "address");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('city')}>
                    <FieldLabel htmlFor="input-city">Città</FieldLabel>
                    <Input id="input-city" type="text" placeholder="Indirizzo" aria-invalid={errorFields.includes('city')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "city");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('zipCode')}>
                    <FieldLabel htmlFor="input-zip-code">CAP</FieldLabel>
                    <Input id="input-zip-code" type="text" placeholder="Indirizzo" aria-invalid={errorFields.includes('zipCode')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "zipCode");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('province')}>
                    <FieldLabel htmlFor="input-province">Codice provincia</FieldLabel>
                    <Input id="input-province" type="text" placeholder="Provincia" aria-invalid={errorFields.includes('province')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "province");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('country')}>
                    <FieldLabel htmlFor="input-country">Codice paese</FieldLabel>
                    <Input id="input-country" type="text" placeholder="Paese" aria-invalid={errorFields.includes('country')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "country");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('sdiCode')}>
                    <FieldLabel htmlFor="input-sdi-code">Codice SDI</FieldLabel>
                    <Input id="input-sdi-code" type="text" placeholder="Paese" aria-invalid={errorFields.includes('sdiCode')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "sdiCode");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('phone')}>
                    <FieldLabel htmlFor="input-phone">Telefono</FieldLabel>
                    <Input id="input-phone" type="text" placeholder="Telefono" aria-invalid={errorFields.includes('phone')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "phone");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('email')}>
                    <FieldLabel htmlFor="input-email">Email</FieldLabel>
                    <Input id="input-email" type="email" placeholder="Email" aria-invalid={errorFields.includes('email')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "email");
                        if(index > -1){
                            errorFields.splice(index, 1);
                            setRender(now());
                        }
                    }}/>
                </Field>
                <Field data-invalid={errorFields.includes('pec')}>
                    <FieldLabel htmlFor="input-pec">PEC</FieldLabel>
                    <Input id="input-pec" type="email" placeholder="PEC" aria-invalid={errorFields.includes('pec')} onChange={(e) => {
                        const index = errorFields.findIndex(e => e == "pec");
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
                        const inputFirstname = document.querySelector("#input-firstname") as HTMLInputElement;
                        const inputLastname = document.querySelector("#input-lastname") as HTMLInputElement;
                        const inputVatNumber = document.querySelector("#input-vat-number") as HTMLInputElement;
                        const inputFiscalCode = document.querySelector("#input-fiscal-code") as HTMLInputElement;
                        const inputBusinessName = document.querySelector("#input-business-name") as HTMLInputElement;
                        const inputAddress = document.querySelector("#input-address") as HTMLInputElement;
                        const inputCity = document.querySelector("#input-city") as HTMLInputElement;
                        const inputZipCode = document.querySelector("#input-zip-code") as HTMLInputElement;
                        const inputProvince = document.querySelector("#input-province") as HTMLInputElement;
                        const inputCountry = document.querySelector("#input-country") as HTMLInputElement;
                        const inputPhone = document.querySelector("#input-phone") as HTMLInputElement;
                        const inputEmail = document.querySelector("#input-email") as HTMLInputElement;
                        const inputSdiCode = document.querySelector("#input-sdi-code") as HTMLInputElement;
                        const inputPec = document.querySelector("#input-pec") as HTMLInputElement;
                        
                        const title = inputTitle.value.trim();
                        const firstname = inputFirstname.value.trim();
                        const lastname = inputLastname.value.trim();
                        const vatNumber = inputVatNumber.value.trim();
                        const fiscalCode = inputFiscalCode.value.trim();
                        const businessName = inputBusinessName.value.trim();
                        const address = inputAddress.value.trim();
                        const city = inputCity.value.trim();
                        const zipCode = inputZipCode.value.trim();
                        const province = inputProvince.value.trim();
                        const country = inputCountry.value.trim();
                        const phone = inputPhone.value.trim();
                        const email = inputEmail.value.trim();
                        const sdiCode = inputSdiCode.value.trim();
                        const pec = inputPec.value.trim();

                        let errors = [];
                        if(title.length == 0){
                            errors.push('title');
                        }
                        if(vatNumber.length > 0){
                            if(vatNumber.length != 11){
                                errors.push("vatNumber");
                            }
                        }
                        if(zipCode.length > 0){
                            if(zipCode.length != 5){
                                errors.push("zipCode");
                            }
                        }
                        if(province.length > 0){
                            if(province.length != 2){
                                errors.push("province");
                            }
                        }
                        if(country.length > 0){
                            if(country.length != 2){
                                errors.push("country");
                            }
                        }
                        if(errors.length > 0){
                            setErrorsFields(errors);
                            return;
                        }

                        const payload = {
                            "_id": _id,
                            "title": title,
                            "firstname": firstname,
                            "lastname": lastname,
                            "vatNumber": vatNumber,
                            "fiscalCode": fiscalCode,
                            "businessName": businessName,
                            "address": address,
                            "city": city,
                            "zipCode": zipCode,
                            "province": province,
                            "country": country,
                            "phone": phone,
                            "email": email,
                            "sdiCode": sdiCode,
                            "pec": pec
                        };

                        setIsLoading(true);
                        const isCreated = await createCustomer(payload);
                        setIsLoading(false);
                        
                        if(isCreated){
                            router.push("/customers");
                        }else{
                            toast.error("Errore durante la creazione del cliente", {position: "top-right"});
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