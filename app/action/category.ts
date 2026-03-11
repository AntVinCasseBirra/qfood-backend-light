'use server';

import { cookies } from "next/headers";
import { decrypt } from "./session";

export async function getCategories(){

    let categories = null;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/category/listAllCategories`,
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
                categories = json.documents ?? [];
            }
        }

    }catch(e){
        console.log(e);
    }

    return categories ?? [];
}

export async function createCategory(
    {_id, title, color, availableOnWebApp, availableOnPos, availableForWaiter, position} : 
    {_id?: string | null, title: string, color: string, availableOnWebApp: boolean, availableOnPos: boolean, availableForWaiter: boolean, position: number}
){

    let created = false;
    
    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response =
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/category/createOrUpdateCategory`,
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
                            "color": color,
                            "availableOnWebApp": availableOnWebApp,
                            "availableOnPos": availableOnPos,
                            "availableForWaiter": availableForWaiter,
                            "position": position
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

export async function trashCategory({idCategory}: {idCategory: string}){

    let trashed = false;

    try{

        const cookieStore   = await cookies();
        const authorization = cookieStore.get('qfoodSession')!.value;
        const bearer        = (await decrypt(authorization))!['bearer'];

        const response = 
            await fetch(
                `${process.env.API_ENDPOINT}/api/v1/category/deleteCategory/${idCategory}`,
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