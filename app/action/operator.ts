'use server'

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getOperators(){

    let documents = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/operator/listAllOperators`,
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

export async function createOperator(
    {_id, title, pinCode} : 
    {_id?: string | null, title: string, pinCode: string}
){

    let created = false;
    
    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response =
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/operator/createOrUpdateOperator`,
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
                            "pinCode": pinCode
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


export async function trashOperator({idOperator}: {idOperator: string}){

    let trashed = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/operator/deleteOperator/${idOperator}`,
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