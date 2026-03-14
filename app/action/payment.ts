'use server'

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getPayments(){

    let documents = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/payment/listAllPayments`,
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

export async function createPayment(
    {_id, title, printerTend, printerSubTend, cashPayment, position, availableOnWebApp, availableOnPos} : 
    {_id?: string | null, title: string, position: number, printerTend?: string | null, printerSubTend?: string | null, cashPayment: boolean, availableOnWebApp: boolean, availableOnPos: boolean}
){

    let created = false;
    
    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response =
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/payment/createOrUpdatePayment`,
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
                            "position": position,
                            "printerTend": printerTend,
                            "printerSubTend": printerSubTend,
                            "cashPayment": cashPayment,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos
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

export async function trashPayment({idPayment}: {idPayment: string}){

    let trashed = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/payment/deletePayment/${idPayment}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${bearer}`
                    }
                }
            );

        if(response.status == 200){
            const json = await response.json();
            if(json && json.success){
                trashed = true;
            }
        }

    }catch(e){
        console.log(e);
    }

    return trashed;
}