'use server'

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getCustomers(){

    let documents = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/customer/listAllCustomers`,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${bearer}`
                    }
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                documents = json.documents ?? [];
            }
        }

    }catch(e){
        console.log(e);
    }

    return documents ?? [];
}

export async function createCustomer(
    {_id, title, firstname, lastname, vatNumber, fiscalCode, businessName, address, city, zipCode, province, country, phone, email, sdiCode, pec} : 
    {
        _id?: string | null, 
        title: string, 
        firstname?: string | null, 
        lastname?: string | null, 
        vatNumber?: string | null,
        fiscalCode?: string | null,
        businessName?: string | null,
        address?: string | null,
        city?: string | null,
        zipCode?: string | null,
        province?: string | null,
        country?: string | null,
        phone?: string | null,
        email?: string | null,
        sdiCode?: string | null,
        pec?: string | null
    }
){

    let created = false;
    
    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response =
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/customer/createOrUpdateCustomer`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearer}`
                    },
                    body: JSON.stringify(
                        {
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
                        }
                    )
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                created = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return created;
}