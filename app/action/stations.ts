'use server'

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getStations(){

    let documents = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/station/listAllStations`,
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

export async function createStation(
    {_id, title, position, availableForWaiter, availableOnWebApp, idArea} : 
    {_id?: string | null, title: string, position: number, availableForWaiter: boolean, availableOnWebApp: boolean, idArea: string}
){

    let created = false;
    
    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response =
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/station/createOrUpdateStation`,
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
                            "availableForWaiter": availableForWaiter,
                            "availableOnWebApp": availableOnWebApp,
                            "idArea": idArea
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

export async function trashStation({idStation}: {idStation: string}){

    let trashed = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/station/deleteStation/${idStation}`,
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